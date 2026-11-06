// Grabados de los ortostatos, dibujados a partir de las fichas de catalogación del informe.
// Tres modos: 'fresco' (recién hechos), 'gastado' (hoy, con «mala visibilidad») y 'resaltado' (calco en color).
(function (V) {
  'use strict';

  // Dibuja un trazo como surco: sombra oscura y borde iluminado
  function surco(g, modo, ancho, dibujar) {
    const capas = modo === 'resaltado'
      ? [['rgba(176,58,32,0.95)', 0, 0]]
      : modo === 'gastado'
        ? [['rgba(236,230,218,0.18)', -1, -1], ['rgba(52,46,40,0.42)', 0.8, 0.8]]
        : [['rgba(238,232,220,0.35)', -1.4, -1.4], ['rgba(40,34,29,0.78)', 0.9, 0.9]];
    for (const [color, dx, dy] of capas) {
      g.save(); g.translate(dx, dy);
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = ancho; g.lineCap = 'round'; g.lineJoin = 'round';
      dibujar(g);
      g.restore();
    }
  }
  // Piqueteado: nube de pequeños golpes (puntos) a lo largo del trazo
  function golpes(g, modo, puntos, radio, semilla) {
    const r = V.semilla(semilla);
    const color = modo === 'resaltado' ? 'rgba(176,58,32,0.9)' : modo === 'gastado' ? 'rgba(52,46,40,0.4)' : 'rgba(40,34,29,0.75)';
    g.fillStyle = color;
    for (const [x, y] of puntos) for (let k = 0; k < 3; k++) {
      g.beginPath(); g.arc(x + (r() - 0.5) * radio, y + (r() - 0.5) * radio, radio * (0.25 + r() * 0.3), 0, 7); g.fill();
    }
  }

  function motivo(g, m, cx, cy, k, modo, semilla, tecnica) {
    const w = (m.w || 4) * k, h = (m.h || m.w || 4) * k;
    const lw = Math.max(2, (m.t === 'cazoleta' ? 1 : 1.4) * k);
    const pique = /piquete/.test(tecnica) && !/abrasi|raspad/.test(tecnica);
    g.save(); g.translate(cx, cy);
    if (m.giro) g.rotate(m.giro * Math.PI / 180);
    switch (m.t) {
      case 'cazoleta': {     // pequeña cavidad circular
        const rad = w / 2;
        const grad = g.createRadialGradient(-rad * 0.2, -rad * 0.2, rad * 0.1, 0, 0, rad);
        if (modo === 'resaltado') { grad.addColorStop(0, 'rgba(176,58,32,0.95)'); grad.addColorStop(1, 'rgba(176,58,32,0.7)'); }
        else { const a = modo === 'gastado' ? 0.45 : 0.8; grad.addColorStop(0, `rgba(28,24,20,${a})`); grad.addColorStop(1, `rgba(90,80,70,${a * 0.5})`); }
        g.fillStyle = grad; g.beginPath(); g.arc(0, 0, rad, 0, 7); g.fill();
        break;
      }
      case 'puntos': {       // filas de puntos piqueteados
        const pts = [];
        for (let f = 0; f < m.filas; f++) for (let i = 0; i < 9; i++) pts.push([(-0.5 + i / 8) * w, (-0.5 + f / (m.filas - 1)) * h]);
        golpes(g, modo, pts, 1.6 * k, semilla);
        break;
      }
      case 'lineasPuntos': {
        const pts = [];
        for (let c = 0; c < m.n; c++) for (let i = 0; i < 5; i++) pts.push([(-0.5 + c / (m.n - 1)) * w, (-0.5 + i / 4) * h]);
        golpes(g, modo, pts, 1.2 * k, semilla + 1);
        break;
      }
      case 'circulo': surco(g, modo, lw, s => { s.beginPath(); s.ellipse(0, 0, w / 2, h / 2, 0, 0, 7); s.stroke(); }); break;
      case 'circulos': {     // dos círculos en horizontal y tres encadenados en vertical; el último relleno
        const rad = w / 4;
        const c = [[-rad, -h / 2 + rad], [rad, -h / 2 + rad], [0, -h / 2 + rad * 3], [0, -h / 2 + rad * 5], [0, -h / 2 + rad * 7]];
        surco(g, modo, lw, s => c.forEach(([x, y], i) => { s.beginPath(); s.arc(x, Math.min(y, h / 2 - rad), rad * 0.9, 0, 7); i === 4 ? s.fill() : s.stroke(); }));
        break;
      }
      case 'manchas': {      // motivos circulares rellenos que se solapan
        surco(g, modo, lw, s => { for (let i = 0; i < m.n; i++) { s.beginPath(); s.arc((-0.35 + i * 0.16) * w, Math.sin(i) * h * 0.18, h * 0.25, 0, 7); s.fill(); } });
        break;
      }
      case 'filasCirculos': {   // cuatro filas de figuras circulares y ovales rellenas
        const r = V.semilla(semilla);
        surco(g, modo, lw, s => {
          for (let f = 0; f < m.filas; f++) for (let i = 0; i < m.n / m.filas; i++) {
            const rad = (2 + r() * 1.5) * k;
            s.beginPath(); s.ellipse((-0.42 + i * 0.28 + (f % 2) * 0.08) * w, (-0.4 + f * 0.27) * h, rad, rad * (r() < 0.2 ? 1.6 : 1), 0, 0, 7); s.fill();
          }
        });
        break;
      }
      case 'ce': surco(g, modo, lw, s => { s.beginPath(); s.ellipse(0, 0, w / 2, h / 2, 0, -Math.PI * 0.75, Math.PI * 0.75, true); s.stroke(); }); break;
      case 'antropomorfo': surco(g, modo, lw, s => {
        s.beginPath(); s.arc(0, -h / 2 + w * 0.12, w * 0.12, 0, 7); s.stroke();         // cabeza
        s.beginPath(); s.moveTo(0, -h / 2 + w * 0.24); s.lineTo(0, h * 0.15); s.stroke(); // eje del cuerpo
        s.beginPath();
        if (m.brazos === 'cruz') { s.moveTo(-w / 2, -h * 0.18); s.lineTo(w / 2, -h * 0.18); }
        else { s.moveTo(-w / 2, h * 0.05); s.quadraticCurveTo(-w / 2, -h * 0.25, 0, -h * 0.18); s.lineTo(w / 2, -h * 0.18); }
        s.stroke();
        s.beginPath(); s.moveTo(-w * 0.35, h / 2); s.lineTo(0, h * 0.15); s.lineTo(w * 0.35, h / 2); s.stroke();   // piernas en ángulo
      }); break;
      case 'antropomorfoRect': surco(g, modo, lw, s => {
        s.strokeRect(-w * 0.3, -h / 2, w * 0.6, h * 0.62);
        s.beginPath(); s.moveTo(-w * 0.3, -h * 0.25); s.lineTo(w * 0.3, -h * 0.25); s.stroke();
        s.beginPath(); s.moveTo(-w * 0.12, h * 0.12); s.lineTo(-w * 0.12, h / 2); s.moveTo(w * 0.12, h * 0.12); s.lineTo(w * 0.12, h / 2); s.stroke();
        s.beginPath(); s.moveTo(w * 0.45, -h * 0.45); s.lineTo(w * 0.45, h * 0.3); s.stroke();   // «báculo»
      }); break;
      case 'indeterminado': {
        const r = V.semilla(semilla);
        surco(g, modo, lw, s => { for (let i = 0; i < 6; i++) { s.beginPath(); const x = (r() - 0.5) * w, y = (r() - 0.5) * h; s.moveTo(x, y); s.lineTo(x + (r() - 0.5) * w * 0.4, y + (r() - 0.5) * h * 0.5); s.stroke(); } });
        break;
      }
      case 'trazo': surco(g, modo, Math.max(lw, w), s => {
        s.beginPath(); s.moveTo(0, -h / 2);
        if (m.sinuoso) s.bezierCurveTo(w * 1.5, -h / 6, -w * 1.5, h / 6, 0, h / 2); else s.lineTo(0, h / 2);
        s.stroke();
      }); break;
      case 'ondulado': surco(g, modo, lw * 1.3, s => {   // serpentiforme vertical con varias curvas
        s.beginPath();
        for (let i = 0; i <= 60; i++) { const v = i / 60; s.lineTo(Math.sin(v * Math.PI * m.curvas) * w / 2, -h / 2 + v * h); }
        s.stroke();
        if (m.base) { s.lineWidth = lw * 3; s.beginPath(); s.moveTo(0, h / 2 - 4 * k); s.lineTo(0, h / 2); s.stroke(); }
      }); break;
      case 'rectangulo': surco(g, modo, lw, s => {
        s.beginPath();
        if (m.abierto) { s.moveTo(-w / 2, h / 2); s.lineTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h * 0.2); }
        else s.rect(-w / 2, -h / 2, w, h);
        s.stroke();
        if (m.interior) { s.beginPath(); s.moveTo(0, -h * 0.4); s.lineTo(0, 0); s.stroke(); }
        if (m.dividido) { s.lineWidth = lw * 0.6; s.beginPath(); s.moveTo(-w / 2, -h * 0.2); s.lineTo(w * 0.2, -h * 0.2); s.moveTo(0, -h * 0.2); s.lineTo(0, -h * 0.05); s.stroke(); }
      }); break;
      case 'circuloAbierto': surco(g, modo, lw, s => {
        s.beginPath(); s.arc(0, 0, w / 2, Math.PI * 0.45, Math.PI * 0.05 + Math.PI * 2); s.stroke();
        for (const f of [0.62, 0.8]) { s.beginPath(); s.arc(0, 0, w * f, Math.PI * 0.1, Math.PI * 0.4); s.stroke(); }
      }); break;
      case 'u': surco(g, modo, lw, s => { s.beginPath(); s.moveTo(-w / 2, h / 2); s.quadraticCurveTo(-w / 2, -h / 2, 0, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, h / 2); s.stroke(); }); break;
      case 'angulo': surco(g, modo, lw * 1.4, s => { s.beginPath(); s.moveTo(-w / 2, h / 2); s.lineTo(0, -h / 2); s.lineTo(w / 2, h * 0.3); s.stroke(); }); break;
      case 'ramiforme': surco(g, modo, lw * 0.8, s => {   // eje con trazos transversales en diagonal descendente
        s.beginPath(); s.moveTo(0, -h / 2); s.lineTo(0, h / 2); s.stroke();
        const lado = (n, sg) => { for (let i = 0; i < n; i++) {
          const y = -h / 2 + (i + 0.5) * h / n, curvo = m.curvo && i > n - 4;
          s.beginPath(); s.moveTo(0, y);
          if (curvo) s.quadraticCurveTo(sg * w * 0.35, y + h * 0.02, sg * w / 2, y + h * 0.08); else s.lineTo(sg * w / 2, y + h * 0.06);
          s.stroke();
        } };
        lado(m.izq, -1); lado(m.der, 1);
      }); break;
    }
    if (pique && modo !== 'resaltado' && m.t !== 'cazoleta' && m.t !== 'puntos' && m.t !== 'lineasPuntos') {
      // aspecto rugoso del piqueteado: pequeños golpes sobre el trazo
      const r = V.semilla(semilla + 9);
      g.fillStyle = modo === 'gastado' ? 'rgba(200,192,180,0.2)' : 'rgba(210,202,190,0.35)';
      for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((r() - 0.5) * w, (r() - 0.5) * h, 0.6 * k, 0, 7); g.fill(); }
    }
    g.restore();
  }

  // Máscaras de los motivos sacadas de los calcos del informe (Tera S.L.). Sin máscara se usan los motivos dibujados.
  V.MASCARAS = { '6': 1, '8': 1, '9': 1, '10': 1, '11': 1, '12': 1, '19': 1, '21': 1, 'acceso': 1 };
  const mascaras = {}, pendientes = {};
  function mascara(id, alListo) {
    if (!V.MASCARAS[id]) return null;
    if (mascaras[id]) return mascaras[id].complete ? mascaras[id] : null;
    const img = new Image();
    img.onload = () => { (pendientes[id] || []).forEach(f => f()); pendientes[id] = []; };
    img.src = 'fotos/mascara-' + id + '.png';
    mascaras[id] = img;
    return null;
  }
  // Pinta la máscara como surco: borde iluminado y sombra (o en rojo, como un calco)
  function pintarMascara(g, img, modo, W, Hv) {
    const capa = (color, alfa, dx, dy) => {
      const c = document.createElement('canvas'); c.width = W; c.height = Hv;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0, W, Hv);
      x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, W, Hv);
      g.save(); g.globalAlpha = alfa; g.drawImage(c, dx, dy); g.restore();
    };
    if (modo === 'resaltado') capa('#b03a20', 0.92, 0, 0);
    else if (modo === 'gastado') { capa('#ece6da', 0.16, -1, -1); capa('#342e28', 0.42, 0.8, 0.8); }
    else { capa('#eee8dc', 0.32, -1.4, -1.4); capa('#28221d', 0.78, 0.9, 0.9); }
  }

  // Textura de la cara interior de un ortostato (ancho y alto total en metros, incluida la parte enterrada)
  const cache = {};
  V.texturaOrtostato = function (id, ancho, alto, modo) {
    const clave = id + modo;
    if (cache[clave]) return cache[clave];
    const W = 256, H = Math.round(256 * alto / ancho);
    const datos = V.grabados[id];
    const losa = V.datos.camara.losas.find(l => l.id === id);
    const visible = losa ? losa.alto / alto : 0.455 / alto;   // fracción de la cara por encima del suelo
    const pintar = (g) => {
      V.pintarGranito(g, W, H, '#a59e92', 100 + id.length * 13 + (parseInt(id, 10) || 3));
      if (!datos) return;
      const img = mascara(id);
      if (img) { pintarMascara(g, img, modo, W, Math.round(H * visible)); return; }
      if (V.MASCARAS[id]) return;          // la máscara aún se está cargando
      const k = W / (ancho * 100);      // píxeles por centímetro
      datos.motivos.forEach((m, i) => motivo(g, m, m.u * W, m.v * H, k, modo, 17 + i * 31, datos.tecnica));
    };
    const t = V.texturaCanvas(W, H, pintar);
    if (V.MASCARAS[id] && !mascara(id)) {
      (pendientes[id] = pendientes[id] || []).push(() => {
        const g = t.image.getContext('2d'); g.clearRect(0, 0, W, H); pintar(g);
        t.needsUpdate = true; V.ctx && V.ctx.pedirRender && V.ctx.pedirRender();
      });
    }
    cache[clave] = t;
    return t;
  };

  // Imagen del calco para el panel (SVG de los motivos de una piedra, para ver los grabados en grande)
  V.calcoOrtostato = function (id, ancho, alto) {
    const W = 220, H = Math.round(220 * alto / ancho);
    const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2;
    const g = c.getContext('2d'); g.scale(2, 2);
    g.fillStyle = '#f4eee2'; g.beginPath(); g.roundRect ? g.roundRect(2, 2, W - 4, H - 4, 18) : g.rect(2, 2, W - 4, H - 4); g.fill();
    g.strokeStyle = '#7a6f60'; g.lineWidth = 1.5; g.stroke();
    const k = W / (ancho * 100);
    (V.grabados[id] || { motivos: [] }).motivos.forEach((m, i) => motivo(g, m, m.u * W, m.v * H, k, 'resaltado', 17 + i * 31, V.grabados[id].tecnica));
    return c.toDataURL('image/png');
  };
})(window.MOINA);
