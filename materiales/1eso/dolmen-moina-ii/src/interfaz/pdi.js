// Marcadores numerados de los puntos de interés, con selección por clic, toque o teclado.
(function (V) {
  'use strict';

  function texturaNumero(n, activo) {
    return V.texturaCanvas(128, 128, (g, w, h) => {
      g.beginPath(); g.arc(w / 2, h / 2, 54, 0, Math.PI * 2);
      g.fillStyle = activo ? '#8a3b00' : '#1f1b16'; g.fill();
      g.lineWidth = 9; g.strokeStyle = '#ffffff'; g.stroke();
      g.fillStyle = '#ffffff'; g.font = 'bold 62px system-ui, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(n), w / 2, h / 2 + 3);
    });
  }

  V.construirPDI = function (ctx) {
    const { scene, camera, renderer } = ctx;
    const marcadores = [];

    for (const f of V.fichas) {
      const base = { x: f.marcador[0], y: f.marcador[1], h: f.marcador[2] };
      const mat = new THREE.SpriteMaterial({ map: texturaNumero(f.n, false), depthTest: false, depthWrite: false, sizeAttenuation: false });
      const s = new THREE.Sprite(mat);
      s.scale.set(0.045, 0.045, 1);
      s.position.set(base.x, base.h, -base.y);
      s.renderOrder = 100;
      s.userData = { pdi: f.n, normal: mat.map, activo: texturaNumero(f.n, true) };
      scene.add(s);
      marcadores.push(s);
    }
    ctx.marcadores = marcadores;

    ctx.resaltarPDI = function (n) {
      for (const m of marcadores) m.material.map = m.userData.pdi === n ? m.userData.activo : m.userData.normal;
      ctx.pedirRender();
    };
    ctx.verMarcadores = function (si) { marcadores.forEach(m => { m.visible = si; }); ctx.pedirRender(); };

    // Selección con el puntero (distingue clic de arrastre)
    const ray = new THREE.Raycaster();
    const lienzo = renderer.domElement;
    const etiqueta = document.createElement('div');
    etiqueta.className = 'etiqueta-pdi'; etiqueta.hidden = true;
    document.body.appendChild(etiqueta);
    function tocado(e) {
      const r = lienzo.getBoundingClientRect();
      const v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(v, camera);
      const hits = ray.intersectObjects(marcadores.filter(m => m.visible), false);
      return hits.length ? hits[0].object : null;
    }
    let inicio = null;
    lienzo.addEventListener('pointerdown', e => { inicio = { x: e.clientX, y: e.clientY }; });
    lienzo.addEventListener('pointerup', e => {
      if (!inicio || Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 7) { inicio = null; return; }
      inicio = null;
      const m = tocado(e);
      if (m && ctx.abrirFicha) ctx.abrirFicha(m.userData.pdi, true);
    });
    lienzo.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const m = tocado(e);
      document.getElementById('escena').classList.toggle('sobre-pdi', !!m);
      if (m) {
        const f = V.fichas.find(x => x.n === m.userData.pdi);
        etiqueta.textContent = f.n + '. ' + f.titulo;
        etiqueta.style.left = e.clientX + 'px'; etiqueta.style.top = e.clientY + 'px';
        etiqueta.hidden = false;
      } else etiqueta.hidden = true;
    });
    lienzo.addEventListener('pointerleave', () => { etiqueta.hidden = true; });
  };
})(window.MOINA);
