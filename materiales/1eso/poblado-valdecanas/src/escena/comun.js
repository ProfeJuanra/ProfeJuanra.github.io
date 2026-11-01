// Utilidades compartidas: relieve, ruido, materiales y niveles de evidencia.
// Coordenadas del plano: x hacia el este, y hacia el norte (m). En Three.js: X = x, Z = -y.
window.VALDE = window.VALDE || {};
(function (V) {
  'use strict';

  // Los colores hexadecimales se interpretan en sRGB (gestión de color de Three.js r147)
  THREE.ColorManagement.legacyMode = false;

  V.NIVEL = { DOC: 1, DED: 2, HIP: 3 };
  V.COLOR_NIVEL = { 1: 0x0072B2, 2: 0xE69F00, 3: 0xCC79A7 };
  V.NOMBRE_NIVEL = { 1: 'Documentado', 2: 'Deducido', 3: 'Hipótesis' };

  // Límites del sector excavado, modelado con detalle
  V.SITIO = { x0: -34, x1: 30, y0: -36, y1: 36 };

  // --- Ruido determinista (la escena es igual en cada carga) ---
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
  V.azar = (function () { // generador pseudoaleatorio con semilla
    let s = 20080601;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  })();

  // Paso suave entre e0 y e1 (vale también con e0 > e1)
  V.paso = function (e0, e1, x) {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  // --- Relieve (HIPÓTESIS: no hay topografía anterior al embalse) ---
  // Terraza casi llana con leve caída al sur; vaguada que recoge la zanja; el Tajo a ~250 m al sur.
  V.yRio = function (x) { return -262 + 12 * Math.sin(x / 95) + 6 * Math.sin(x / 37 + 1); };
  V.NIVEL_AGUA = -9.0;
  V.ejeVaguada = function (y) { return -0.6 + 0.28 * (y + 24) + 6 * Math.sin(y / 40); };

  V.altura = function (x, y) {
    const P = V.paso;
    let h = 0.004 * y;                              // terraza: el norte algo más alto
    h -= 7.6 * P(-40, -235, y);                     // bajada hacia el río
    h += 2.5 * P(40, 420, y);                       // suave subida hacia el norte
    h += 13 * P(-300, -430, y);                     // ladera de la otra orilla
    // ondulaciones lejos del sitio (el sector excavado se mantiene casi llano)
    const r = Math.hypot(x, y);
    h += V.fbm(x / 70, y / 70) * 1.6 * P(45, 160, r);
    h += V.fbm(x / 9, y / 9) * 0.05;
    // vaguada
    if (y < -16) {
      const prof = 0.7 * P(-16, -30, y) + 2.2 * P(-30, -150, y);
      const ancho = 5 + 0.07 * (-y);
      const dx = (x - V.ejeVaguada(y)) / ancho;
      h -= prof * Math.exp(-dx * dx);
    }
    // cauce del Tajo
    const dr = Math.abs(y - V.yRio(x));
    h -= 3.2 * (1 - P(28, 52, dr));
    return h;
  };

  // Distancia de un punto a una polilínea [[x,y],...]
  V.distPolilinea = function (x, y, pts) {
    let mejor = Infinity, t = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const vx = bx - ax, vy = by - ay;
      const l2 = vx * vx + vy * vy;
      let u = ((x - ax) * vx + (y - ay) * vy) / l2;
      u = Math.max(0, Math.min(1, u));
      const d = Math.hypot(x - (ax + u * vx), y - (ay + u * vy));
      if (d < mejor) { mejor = d; t = i + u; }
    }
    return { d: mejor, t: t / (pts.length - 1) };
  };

  // ¿Está el punto dentro de la elipse de una cabaña? Devuelve el valor normalizado (<1 dentro)
  V.enCabana = function (x, y, c, margen) {
    const g = c.giro * Math.PI / 180;
    const dx = x - c.x, dy = y - c.y;
    // eje largo girado «giro» grados desde el norte hacia el este
    const along = dx * Math.sin(g) + dy * Math.cos(g);
    const across = dx * Math.cos(g) - dy * Math.sin(g);
    const a = c.largo / 2 + (margen || 0), b = c.ancho / 2 + (margen || 0);
    return Math.sqrt((along / a) ** 2 + (across / b) ** 2);
  };

  // Relieve de detalle dentro del sector: zanja de drenaje y suelos rebajados de las cabañas
  V.PROF_ZANJA = 0.9;     // 0,61 m conservados + ~0,3 m erosionados (hipótesis)
  V.REBAJE_CABANA = 0.5;  // 0,30 m conservados + erosión (hipótesis)
  V.alturaSitio = function (x, y) {
    let h = V.altura(x, y);
    const P = V.plano;
    if (!P) return h;
    const z = P.zanja;
    const r = V.distPolilinea(x, y, z.eje);
    const semi = z.ancho / 2;
    if (r.d < semi) {   // sección en U
      const u = r.d / semi;
      h -= V.PROF_ZANJA * (1 - Math.pow(u, 3)) * (0.85 + 0.3 * r.t); // algo más honda hacia la vaguada
    }
    for (const c of P.cabanas) {
      const e = V.enCabana(x, y, c, 0);
      if (e < 1) h -= V.REBAJE_CABANA * (1 - V.paso(0.82, 1, e));
    }
    return h;
  };

  // Altura del suelo en cualquier punto: detalle dentro del sector, relieve general fuera
  V.alturaSitioOGeneral = function (x, y) {
    const S = V.SITIO;
    return (x > S.x0 && x < S.x1 && y > S.y0 && y < S.y1) ? V.alturaSitio(x, y) : V.altura(x, y);
  };

  // Paso de coordenadas del plano a la escena
  V.pos = function (x, y, dy) {
    return new THREE.Vector3(x, V.alturaSitio(x, y) + (dy || 0), -y);
  };

  // Registro de objetos con su nivel de evidencia (lo usa la capa de evidencia)
  V.objetosNivel = [];
  V.marcar = function (obj, nivel, etiqueta) {
    obj.userData.nivel = nivel;
    if (etiqueta) obj.userData.etiqueta = etiqueta;
    V.objetosNivel.push(obj);
    return obj;
  };

  // Materiales sencillos (Lambert: barato y suficiente para un estilo low-poly)
  const cache = {};
  V.mat = function (color, opts) {
    const k = color + JSON.stringify(opts || {});
    if (!cache[k]) cache[k] = new THREE.MeshLambertMaterial(Object.assign({ color: color }, opts || {}));
    return cache[k];
  };

  // Textura procedural en un canvas
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
})(window.VALDE);
