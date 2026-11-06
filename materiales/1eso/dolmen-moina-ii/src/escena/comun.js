// Utilidades compartidas: ruido, relieve natural, materiales, texturas y niveles de evidencia.
// Coordenadas del plano: x hacia el este, y hacia el norte (m). En Three.js: X = x, Z = -y.
window.MOINA = window.MOINA || {};
(function (V) {
  'use strict';
  THREE.ColorManagement.legacyMode = false;

  V.NIVEL = { DOC: 1, DED: 2, HIP: 3 };
  V.COLOR_NIVEL = { 1: 0x0072B2, 2: 0xE69F00, 3: 0xCC79A7 };
  V.NOMBRE_NIVEL = { 1: 'Documentado', 2: 'Deducido', 3: 'Hipótesis' };

  // --- Ruido determinista ---
  function hash(i, j) {
    const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }
  function ruido(x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
    return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
  }
  V.fbm = function (x, y) {
    return ruido(x, y) * 0.55 + ruido(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.3 + ruido(x * 4.3 + 9.1, y * 4.3 + 7.7) * 0.15;
  };
  // Generador pseudoaleatorio con semilla (la escena sale igual en cada carga)
  V.semilla = function (s) {
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  };
  V.azar = V.semilla(20121105);

  V.paso = function (e0, e1, x) {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  // Dirección (en el plano) de un rumbo en grados desde el norte
  V.dir = function (rumbo) {
    const a = rumbo * Math.PI / 180;
    return { x: Math.sin(a), y: Math.cos(a) };
  };
  // Coordenadas a lo largo del acceso: s = distancia desde el centro de la cámara hacia fuera; t = desplazamiento lateral (+ = izquierda al salir)
  V.enEje = function (x, y) {
    const d = V.dir(V.datos.rumboAcceso);
    return { s: x * d.x + y * d.y, t: -x * d.y + y * d.x };
  };
  V.desdeEje = function (s, t) {
    const d = V.dir(V.datos.rumboAcceso);
    return { x: d.x * s - d.y * t, y: d.y * s + d.x * t };
  };

  // --- Relieve natural: ladera sur de la sierra de Gredos, en La Vera ---
  // Plataforma granítica casi llana alrededor del dolmen (el túmulo «cimenta directamente sobre un batolito
  // granítico» [DOC]) y suave caída hacia el sur, hacia el valle del Tiétar [DED]. Forma exacta: hipótesis.
  V.alturaNatural = function (x, y) {
    const r = Math.hypot(x, y);
    let h = 0.012 * y + 0.35 * V.fbm(x / 22, y / 22);
    h += 6 * V.fbm(x / 140 + 3, y / 140 - 2) * V.paso(25, 160, r);
    h += 0.028 * Math.max(0, y - 60) - 0.02 * Math.max(0, -y - 60);
    return h * V.paso(0, 18, r) + 0.08 * V.fbm(x / 3, y / 3);
  };

  // Registro de objetos con su nivel de evidencia
  V.objetosNivel = [];
  V.marcar = function (obj, nivel, etiqueta) {
    obj.userData.nivel = nivel;
    if (etiqueta) obj.userData.etiqueta = etiqueta;
    V.objetosNivel.push(obj);
    return obj;
  };

  const cache = {};
  V.mat = function (color, opts) {
    const k = color + JSON.stringify(opts || {});
    if (!cache[k]) cache[k] = new THREE.MeshLambertMaterial(Object.assign({ color: color }, opts || {}));
    return cache[k];
  };

  V.texturaCanvas = function (w, h, pintar, repetir) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    pintar(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    if (repetir) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repetir[0], repetir[1]); }
    t.anisotropy = 4;
    return t;
  };

  // Granito de grano grueso (cuarzo, feldespato y mica)
  V.pintarGranito = function (g, w, h, base, semilla) {
    const r = V.semilla(semilla || 7);
    g.fillStyle = base || '#a49d91'; g.fillRect(0, 0, w, h);
    const n = Math.round(w * h / 9);
    for (let i = 0; i < n; i++) {
      const c = r();
      g.fillStyle = c < 0.42 ? 'rgba(58,55,52,0.5)' : c < 0.78 ? 'rgba(226,220,210,0.55)' : c < 0.92 ? 'rgba(160,124,96,0.45)' : 'rgba(30,28,26,0.6)';
      const s = 1 + r() * 2.4;
      g.fillRect(r() * w, r() * h, s, s);
    }
    // manchas de líquenes y meteorización
    for (let i = 0; i < 14; i++) {
      g.fillStyle = r() < 0.5 ? 'rgba(120,118,96,0.16)' : 'rgba(205,200,180,0.18)';
      g.beginPath(); g.ellipse(r() * w, r() * h, 8 + r() * 30, 6 + r() * 20, r() * 3, 0, 7); g.fill();
    }
  };
  let granito = null;
  V.texGranito = function () {
    if (!granito) granito = V.texturaCanvas(256, 256, (g, w, h) => V.pintarGranito(g, w, h, '#a49d91', 11), [1, 1]);
    return granito;
  };

  // Losa irregular de granito (caja deformada con ruido). La base queda en y = 0.
  V.losa = function (ancho, alto, grueso, semilla, estrechar) {
    const g = new THREE.BoxGeometry(ancho, alto, grueso, 3, 4, 1);
    const p = g.attributes.position;
    const est = estrechar === undefined ? 0.22 : estrechar;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const k = V.fbm(x * 2.2 + semilla, y * 2.2 - semilla) * 0.09;
      const e = 1 - est * Math.max(0, y / (alto / 2));
      const top = y > 0 ? V.fbm(x * 3 + semilla, semilla * 0.7) * 0.08 * alto : 0;
      const borde = 1 - 0.12 * Math.pow(Math.abs(x) / (ancho / 2), 4) * (y > 0 ? 1 : 0);
      p.setXYZ(i, x * e * borde + k * ancho, y + top, z * (1 + k));
    }
    g.computeVertexNormals();
    g.translate(0, alto / 2, 0);
    return g;
  };

  // Piedra suelta (canto o bloque) de forma irregular
  V.geoPiedra = function (semilla, detalle) {
    const g = new THREE.IcosahedronGeometry(1, detalle || 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const k = 1 + 0.28 * V.fbm(x * 1.7 + semilla, z * 1.7 + y + semilla * 0.3);
      p.setXYZ(i, x * k, y * k * 0.72, z * k);
    }
    g.computeVertexNormals();
    return g;
  };
})(window.MOINA);
