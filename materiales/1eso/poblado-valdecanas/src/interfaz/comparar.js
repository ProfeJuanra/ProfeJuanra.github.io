// Fase f: comparación «excavación de 2008 / reconstrucción». La pantalla se divide con un deslizador:
// a la izquierda, el sector tal como quedó al excavarlo (superficie erosionada, hoyos vaciados, zanja abierta);
// a la derecha, la reconstrucción. Capas de la cámara: 0 común, 1 excavación, 2 reconstrucción.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const EROSION = 0.3;
  const COMUNES = ['relieve-general', 'sierras', 'llanura-lejana', 'cielo'];

  function alturaExcavada(x, y) {
    // La superficie actual está ~0,3 m por debajo de la antigua; la zanja y la cabaña conservan su profundidad real
    let h = V.altura(x, y) - EROSION;
    const z = V.plano.zanja;
    const r = V.distPolilinea(x, y, z.eje);
    if (r.d < z.ancho / 2) h -= 0.61 * (1 - Math.pow(r.d / (z.ancho / 2), 3));
    for (const c of V.plano.cabanas) {
      if (c.nivel !== N.DOC) continue;
      const e = V.enCabana(x, y, c, 0);
      if (e < 1) h -= 0.3 * (1 - V.paso(0.85, 1, e));
    }
    return h;
  }

  function construirExcavacion(ctx) {
    const S = V.SITIO, paso = ctx.calidad === 'baja' ? 0.8 : 0.6;
    const grupo = new THREE.Group(); grupo.name = 'excavacion-2008';
    // Superficie desbrozada: arcilla clara, con huellas de máquina y manchas
    const nx = Math.round((S.x1 - S.x0) / paso), ny = Math.round((S.y1 - S.y0) / paso);
    const g = new THREE.PlaneGeometry(S.x1 - S.x0, S.y1 - S.y0, nx, ny);
    g.rotateX(-Math.PI / 2);
    const pa = g.attributes.position, col = new Float32Array(pa.count * 3), c = new THREE.Color();
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i) + (S.x0 + S.x1) / 2, y = -(pa.getZ(i)) + (S.y0 + S.y1) / 2;
      pa.setXYZ(i, x, alturaExcavada(x, y), -y);
      const r = V.distPolilinea(x, y, V.plano.zanja.eje);
      c.setRGB(0.80, 0.68, 0.52).multiplyScalar(0.92 + 0.08 * V.fbm(x / 2, y / 2));
      if (r.d < V.plano.zanja.ancho / 2) c.multiplyScalar(0.82);
      c.convertSRGBToLinear();
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    const suelo = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true }));
    suelo.receiveShadow = true;
    grupo.add(V.marcar(suelo, N.DOC, 'Superficie excavada en 2008'));

    // Hoyos vaciados con su planta y profundidad documentadas (hogar: anillo de adobes)
    for (const e of V.plano.estructuras) {
      const h = alturaExcavada(e.x, e.y);
      if (e.tipo === 'hogar') {
        const anillo = new THREE.Mesh(new THREE.TorusGeometry(e.diametro / 2 - 0.15, 0.08, 4, 18), V.mat(0x8e6a48, { flatShading: true }));
        anillo.rotation.x = Math.PI / 2; anillo.position.set(e.x, h + 0.03, -e.y);
        grupo.add(V.marcar(anillo, N.DOC, 'Restos del hogar 11/4'));
        continue;
      }
      const prof = Math.max(0.08, e.profundidad || 0.5), D = e.diametro;
      const campana = e.tipo === 'silo';
      const perfil = campana
        ? [[0.001, -prof], [D / 2 * 0.95, -prof + 0.02], [D / 2, -prof * 0.5], [D / 2 * 0.85, -0.02], [D / 2 * 0.85, 0.01]]
        : [[0.001, -prof], [D / 2 * 0.95, -prof + 0.02], [D / 2, 0.01]];
      const lathe = new THREE.LatheGeometry(perfil.map(([r, y]) => new THREE.Vector2(r, y)), 18);
      const int = new THREE.Mesh(lathe, new THREE.MeshLambertMaterial({ color: 0x9a7a58, side: THREE.BackSide }));
      int.position.set(e.x, h, -e.y); int.renderOrder = -2;
      grupo.add(V.marcar(int, N.DOC, 'Hoyo ' + e.id + ' vaciado'));
      const masc = new THREE.Mesh(new THREE.CircleGeometry(campana ? D / 2 * 0.85 : D / 2, 18), new THREE.MeshBasicMaterial({ colorWrite: false }));
      masc.rotation.x = -Math.PI / 2; masc.position.set(e.x, h + 0.012, -e.y); masc.renderOrder = -1;
      grupo.add(masc);
    }
    // Jalones de excavación junto a algunos hoyos (referencia de escala, 1 m blanco y rojo)
    [['17', 1.2], ['33', 1.0], ['25', 1.4]].forEach(([id, d]) => {
      const e = V.plano.estructuras.find(s => s.id === id);
      const j = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const t = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 5), V.mat(i % 2 ? 0xffffff : 0xc0392b));
        t.position.y = 0.1 + i * 0.2; j.add(t);
      }
      j.position.set(e.x + d, alturaExcavada(e.x + d, e.y), -e.y);
      grupo.add(V.marcar(j, N.DOC, 'Jalón de escala (1 m)'));
    });
    ctx.scene.add(grupo);
    return grupo;
  }

  function capa(obj, n) { obj.traverse(o => o.layers.set(n)); }

  V.construirComparacion = function (ctx) {
    const { scene, camera, renderer } = ctx;
    const exc = construirExcavacion(ctx);
    // Reparto en capas
    for (const o of scene.children.slice()) {
      if (o === exc) capa(o, 1);
      else if (o.isLight) o.layers.enableAll();
      else if (o.isSprite) o.layers.enableAll();
      else if (COMUNES.includes(o.name) || (o.material && o.material.side === THREE.BackSide && o.geometry && o.geometry.type === 'SphereGeometry')) capa(o, 0);
      else capa(o, 2);
    }
    // El sol proyecta sombras de todas las capas
    camera.layers.set(0); camera.layers.enable(2);

    const linea = document.createElement('div');
    linea.className = 'linea-corte'; linea.hidden = true;
    linea.innerHTML = '<span>◀ 2008 · hacia 2900 a. C. ▶</span>';
    document.body.appendChild(linea);

    let activa = false, corte = 0.5;
    const tam = new THREE.Vector2();
    ctx.renderizar = function () {
      if (!activa) { renderer.render(scene, camera); return; }
      renderer.getSize(tam);
      const xc = Math.round(tam.x * corte);
      renderer.setScissorTest(true);
      // Izquierda: excavación de 2008
      renderer.setScissor(0, 0, xc, tam.y); renderer.setViewport(0, 0, tam.x, tam.y);
      camera.layers.set(0); camera.layers.enable(1);
      renderer.render(scene, camera);
      // Derecha: reconstrucción
      renderer.setScissor(xc, 0, tam.x - xc, tam.y);
      camera.layers.set(0); camera.layers.enable(2);
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
    };
    ctx.activarComparacion = function (on, valor) {
      activa = on;
      if (valor !== undefined) corte = valor;
      linea.hidden = !on;
      linea.style.left = (corte * 100) + 'vw';
      if (!on) { camera.layers.set(0); camera.layers.enable(2); }
      ctx.pedirRender();
    };
    ctx.fijarComparacion = function (v) {
      if (!activa) ctx.activarComparacion(true, v);
      corte = v; linea.style.left = (corte * 100) + 'vw';
      ctx.pedirRender();
    };
  };
})(window.VALDE);
