/*
  MAPA INTERACTIVO DEL ANTIGUO EGIPTO
  ===================================
  Dibuja un mapa SVG propio (sin servidores de mapas externos) a partir de
  GEO_EGIPTO y ENCLAVES. Tiene tres vistas: todo Egipto, zona de Menfis y
  zona de Tebas. Debajo crea una lista de enclaves que se maneja con teclado.
*/
(function () {
  'use strict';
  const { el } = window.EGIPTO;
  const G = window.GEO_EGIPTO, M = G.marco;
  const NS = 'http://www.w3.org/2000/svg';
  const K = Math.cos(26.5 * Math.PI / 180);           // corrección de la longitud a esta latitud
  const ESCALA = 100;                                  // unidades del mapa por grado
  const ANCHO = (M.lonE - M.lonO) * ESCALA * K;
  const ALTO = (M.latN - M.latS) * ESCALA;
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const px = (lat, lon) => [(lon - M.lonO) * ESCALA * K, (M.latN - lat) * ESCALA];
  const ruta = (pts, cerrar) => pts.map((p, i) => (i ? 'L' : 'M') + px(p[0], p[1]).map(n => n.toFixed(1)).join(' ')).join('') + (cerrar ? 'Z' : '');
  const svg = (tag, attrs, ...hijos) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
    for (const h of hijos) e.append(h);
    return e;
  };

  // Formas de los marcadores (no dependen solo del color)
  const FORMAS = {
    cuadrado: 'M-6 -6H6V6H-6Z',
    triangulo: 'M0 -8L7.5 6H-7.5Z',
    circulo: 'M7 0A7 7 0 1 1 -7 0A7 7 0 1 1 7 0Z',
    rombo: 'M0 -8L8 0L0 8L-8 0Z',
  };
  window.EGIPTO.iconoTipo = function (tipo) {
    const forma = window.TIPOS_ENCLAVE[tipo].forma;
    return svg('svg', { class: 'icono-tipo t-' + tipo, viewBox: '-10 -10 20 20', width: '18', height: '18', 'aria-hidden': 'true', focusable: 'false' },
      svg('path', { d: FORMAS[forma] }));
  };

  // Rectángulos de las vistas (en unidades del mapa)
  function cajaZona(z) {
    const [x1, y1] = px(z.latN, z.lonO), [x2, y2] = px(z.latS, z.lonE);
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }
  const VISTAS = {
    todo: { x: 0, y: 0, w: ANCHO, h: ALTO },
    menfis: cajaZona(G.zonas.menfis),
    tebas: cajaZona(G.zonas.tebas),
  };

  // Textura del desierto: ruido suave (valor interpolado) dibujado en un lienzo pequeño.
  // Es decorativa: NO representa el relieve real, solo da aspecto de arena.
  function texturaDesierto() {
    try {
      const W = 322, Hh = 540, c = document.createElement('canvas'); c.width = W; c.height = Hh;
      const g = c.getContext('2d'), img = g.createImageData(W, Hh), d = img.data;
      let semilla = 9;
      const rnd = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; };
      const rejilla = (n) => { const r = []; for (let i = 0; i < (n + 2) * (n + 2); i++) r.push(rnd()); return r; };
      const capas = [[6, 0.5], [14, 0.3], [40, 0.2]].map(([n, peso]) => ({ n, peso, r: rejilla(n) }));
      const suave = t => t * t * (3 - 2 * t);
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        let v = 0;
        for (const { n, peso, r } of capas) {
          const fx = x / W * n, fy = y / Hh * n * 1.4, ix = Math.floor(fx), iy = Math.floor(fy) % (n + 1);
          const tx = suave(fx - ix), ty = suave(fy - Math.floor(fy)), w = n + 2;
          const a = r[iy * w + ix], b = r[iy * w + ix + 1], c2 = r[(iy + 1) * w + ix], e = r[(iy + 1) * w + ix + 1];
          v += peso * ((a * (1 - tx) + b * tx) * (1 - ty) + (c2 * (1 - tx) + e * tx) * ty);
        }
        const i = (y * W + x) * 4, k = (v - 0.5) * 2;
        d[i] = 238 + k * 14; d[i + 1] = 223 + k * 16; d[i + 2] = 186 + k * 18; d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c.toDataURL('image/png');
    } catch (e) { return null; }
  }

  function iniciar() {
    const caja = document.getElementById('mapa-egipto');
    if (!caja) return;
    const fichaCaja = document.getElementById('ficha-enclave');
    const lista = document.getElementById('lista-enclaves');
    const botonesVista = document.querySelectorAll('[data-vista]');

    // ---------- Fondo del mapa ----------
    const mapa = svg('svg', { viewBox: `0 0 ${ANCHO.toFixed(0)} ${ALTO.toFixed(0)}`, role: 'group',
      'aria-labelledby': 'mapa-titulo', class: 'mapa', preserveAspectRatio: 'xMidYMid meet' });
    mapa.append(svg('title', { id: 'mapa-titulo' }, 'Mapa del antiguo Egipto: el Nilo, el delta, las cataratas y los principales enclaves'));
    // Motivos de relleno: campos de cultivo y montes (se dibujan una vez, no pesan)
    const defs = svg('defs', {},
      svg('pattern', { id: 'p-campos', width: 7, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-20)' },
        svg('rect', { width: 7, height: 5, fill: 'var(--verde)' }),
        svg('rect', { width: 3.4, height: 2.3, fill: '#a4cd7d' }), svg('rect', { x: 3.6, y: 2.6, width: 3.4, height: 2.4, fill: '#7fb15a' })),
      svg('pattern', { id: 'p-montes', width: 16, height: 12, patternUnits: 'userSpaceOnUse' },
        svg('path', { d: 'M1 9L4.5 4L8 9M9 4L12 0.5L15 4', fill: 'none', stroke: '#9c7a45', 'stroke-width': 1.1, 'stroke-linejoin': 'round', opacity: 0.75 })),
      svg('clipPath', { id: 'c-mar' }, svg('path', { d: ruta(G.mediterraneo, true) + ruta(G.marRojo, true) })),
      svg('linearGradient', { id: 'g-mar', x1: 0, y1: 0, x2: 0, y2: 1 },
        svg('stop', { offset: 0, 'stop-color': '#a9d0e6' }), svg('stop', { offset: 1, 'stop-color': '#c4e0ee' })));
    mapa.append(defs);
    mapa.append(svg('rect', { class: 'tierra', x: 0, y: 0, width: ANCHO, height: ALTO }));
    // Textura del desierto: manchas suaves generadas una sola vez en un lienzo
    const tex = texturaDesierto();
    if (tex) mapa.append(svg('image', { href: tex, x: 0, y: 0, width: ANCHO, height: ALTO, preserveAspectRatio: 'none', opacity: 0.9, 'aria-hidden': 'true', class: 'textura-desierto' }));
    // Montes (relieve esquemático)
    for (const m of G.montes) mapa.append(svg('path', { class: 'montes', d: ruta(m.contorno, true) }));
    mapa.append(svg('path', { class: 'mar', d: ruta(G.mediterraneo, true) }));
    mapa.append(svg('path', { class: 'mar', d: ruta(G.marRojo, true) }));
    // Aguas poco profundas junto a la costa
    mapa.append(svg('g', { 'clip-path': 'url(#c-mar)' },
      svg('path', { class: 'costa-agua', d: ruta(G.mediterraneo, true) }), svg('path', { class: 'costa-agua', d: ruta(G.marRojo, true) })));
    // Oasis
    for (const o of G.oasis) {
      const [ox, oy] = px(o.pos[0], o.pos[1]);
      mapa.append(svg('ellipse', { class: 'fertil campos', cx: ox, cy: oy, rx: o.rx * ESCALA * K, ry: o.ry * ESCALA }));
    }
    const [fx, fy] = px(G.fayum.centro[0], G.fayum.centro[1]);
    mapa.append(svg('ellipse', { class: 'fertil campos', cx: fx, cy: fy, rx: G.fayum.radio * ESCALA * K, ry: G.fayum.radio * ESCALA * 0.8 }));
    const [lx, ly] = px(G.fayum.lago[0], G.fayum.lago[1]);
    mapa.append(svg('ellipse', { class: 'lago', cx: lx, cy: ly, rx: 9, ry: 3.5 }));
    mapa.append(svg('path', { class: 'fertil campos', d: ruta(G.delta, true) }));
    mapa.append(svg('path', { class: 'valle-borde', d: ruta(G.nilo) }));
    mapa.append(svg('path', { class: 'valle', d: ruta(G.nilo) }));
    mapa.append(svg('path', { class: 'nilo', d: ruta(G.nilo) }));
    G.brazos.forEach(b => mapa.append(svg('path', { class: 'nilo brazo', d: ruta(b) })));
    mapa.append(svg('path', { class: 'frontera', d: ruta(G.frontera) }));

    // Rótulos geográficos (solo en la vista general)
    const rotulos = svg('g', { class: 'rotulos', 'aria-hidden': 'true' });
    for (const [lat, lon, texto, clase, giro] of G.rotulos) {
      const [x, y] = px(lat, lon);
      rotulos.append(svg('text', { x, y, class: 'r-' + clase, transform: giro ? `rotate(${giro} ${x} ${y})` : '' }, texto));
    }
    for (const o of G.oasis) { const [x, y] = px(o.pos[0] - o.ry - 0.12, o.pos[1]); rotulos.append(svg('text', { x, y, class: 'r-oasis' }, o.nombre)); }
    for (const m of G.montes) { const [x, y] = px(m.rotulo[0], m.rotulo[1]); rotulos.append(svg('text', { x, y, class: 'r-montes', transform: m.rotulo[2] ? `rotate(${m.rotulo[2]} ${x} ${y})` : '' }, m.nombre)); }
    mapa.append(rotulos);

    // Capa de elementos que mantienen su tamaño al ampliar
    const capa = svg('g', { class: 'capa-fija' });
    mapa.append(capa);
    const fijos = [];   // { nodo, x, y, vista }
    const fijo = (nodo, lat, lon, vista) => { const [x, y] = px(lat, lon); fijos.push({ nodo, x, y, vista }); capa.append(nodo); return nodo; };

    // Cataratas: marcas de rocas
    for (const c of G.cataratas) {
      const g = svg('g', { class: 'catarata', 'aria-hidden': 'true' },
        svg('path', { d: 'M-7 -3L-3 -6L1 -3L5 -6L9 -3M-7 3L-3 0L1 3L5 0L9 3' }),
        svg('text', { x: -10, y: 4, 'text-anchor': 'end' }, c.nombre));
      fijo(g, c.pos[0], c.pos[1], 'todo');
    }

    // Rótulos que solo se ven al ampliar una zona
    const ROT_ZONA = [
      ['tebas', 25.762, 32.6, 'Orilla oeste: tumbas y templos funerarios'],
      ['tebas', 25.676, 32.668, 'Orilla este: ciudad y templos'],
      ['tebas', 25.69, 32.622, 'Nilo'],
      ['menfis', 29.99, 31.06, 'Meseta del desierto'],
      ['menfis', 29.76, 31.315, 'Nilo'],
      ['menfis', 30.17, 31.04, 'Hacia el delta'],
    ];
    for (const [zona, lat, lon, texto] of ROT_ZONA) {
      fijo(svg('text', { class: 'rot-zona', 'aria-hidden': 'true' }, texto), lat, lon, zona);
    }

    // Botones de zona en la vista general
    const botonesZona = {};
    for (const [id, z] of Object.entries(G.zonas)) {
      const n = window.ENCLAVES.filter(e => e.zona === id).length;
      const c = cajaZona(z);
      const g = svg('g', { class: 'boton-zona', role: 'button', tabindex: '0',
        'aria-label': `${z.nombre}: ${n} enclaves. Pulsa para ampliar` },
        svg('circle', { r: 13 }),
        svg('text', { x: 18, y: -4, class: 'zona-nombre' }, z.nombre),
        svg('text', { x: 18, y: 11, class: 'zona-accion' }, `${n} enclaves · ampliar ⊕`));
      const lat = (z.latN + z.latS) / 2, lon = (z.lonO + z.lonE) / 2;
      fijo(g, lat, lon, 'todo');
      activar(g, () => verVista(id, true));
      botonesZona[id] = g;
      void c;
    }

    // Marcadores de los enclaves
    const marcadores = {};
    for (const e of window.ENCLAVES) {
      const forma = window.TIPOS_ENCLAVE[e.tipo].forma;
      const pos = { d: [12, 4, 'start'], i: [-12, 4, 'end'], ar: [0, -12, 'middle'], ab: [0, 20, 'middle'] }[e.etiqueta || 'd'];
      const g = svg('g', { class: 'marcador t-' + e.tipo, role: 'button', tabindex: '0',
        'aria-label': `${e.nombre} (${window.TIPOS_ENCLAVE[e.tipo].nombre.toLowerCase()})`, 'data-id': e.id },
        svg('circle', { class: 'zona-toque', r: 16 }),
        svg('path', { class: 'forma', d: FORMAS[forma] }),
        svg('text', { x: pos[0], y: pos[1], 'text-anchor': pos[2] }, e.nombre));
      fijo(g, e.lat, e.lon, e.zona || 'todo');
      activar(g, () => seleccionar(e.id, false));
      marcadores[e.id] = g;
    }
    caja.append(mapa);
    const rosa = el('div', { class: 'rosa', 'aria-hidden': 'true' });
    rosa.innerHTML = '<svg viewBox="-20 -24 40 46" width="38" height="44"><path d="M0 -18L6 0L0 -4L-6 0Z" fill="#0d1033"/><path d="M0 18L6 0L0 4L-6 0Z" fill="#fff" stroke="#0d1033" stroke-width="1"/><text x="0" y="-19" text-anchor="middle" font-size="10" font-weight="800" fill="#0d1033">N</text></svg>';
    const escala = el('div', { class: 'escala', 'aria-hidden': 'true' }, el('span', { class: 'barra-escala' }), el('span', { class: 'texto-escala' }));
    caja.append(rosa, escala);

    // ---------- Vistas y ampliación ----------
    let vista = 'todo', vb = { ...VISTAS.todo }, anim = null;
    function aplicarVB(v) {
      mapa.setAttribute('viewBox', `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);
      // Los marcadores mantienen su tamaño en pantalla (en píxeles), sea cual sea el zoom
      // o el ancho del dispositivo: s = unidades del mapa por cada píxel de pantalla.
      const cw = mapa.clientWidth || 600, ch = mapa.clientHeight || 1000;
      const s = Math.min(1.6, Math.max(v.w / cw, v.h / ch));
      for (const f of fijos) f.nodo.setAttribute('transform', `translate(${f.x.toFixed(2)} ${f.y.toFixed(2)}) scale(${s.toFixed(5)})`);
      mapa.style.setProperty('--grosor', s);
      // Escala gráfica: 1 grado de latitud ≈ 111 km
      const pxKm = (1 / s) * (ESCALA / 111);
      const km = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5].find(k => k * pxKm <= 120) || 0.5;
      escala.querySelector('.barra-escala').style.width = (km * pxKm).toFixed(0) + 'px';
      escala.querySelector('.texto-escala').textContent = km >= 1 ? km + ' km' : km * 1000 + ' m';
    }
    function verVista(id, foco) {
      vista = id;
      const destino = VISTAS[id];
      // Anchura de la franja fértil: más visible en la vista general, más fiel al ampliar
      mapa.style.setProperty('--valle', { todo: 9, menfis: 6, tebas: 4 }[id] + 'px');
      caja.dataset.vista = id;
      for (const f of fijos) {
        const visible = f.vista === id || (f.vista === 'todo' && id === 'todo');
        f.nodo.style.display = visible ? '' : 'none';
      }
      // Rótulos generales y cataratas solo en la vista general
      rotulos.style.display = id === 'todo' ? '' : 'none';
      botonesVista.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === id)));
      document.getElementById('mapa-estado').textContent =
        id === 'todo' ? 'Vista: todo Egipto' : 'Vista ampliada: ' + G.zonas[id].nombre;
      cancelAnimationFrame(anim);
      const desde = { ...vb }, t0 = performance.now(), dur = reducido ? 0 : 650;
      const paso = (t) => {
        const k = dur ? Math.min(1, (t - t0) / dur) : 1;
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        // Interpolación logarítmica del tamaño para que el zoom sea suave
        const w = Math.exp(Math.log(desde.w) + (Math.log(destino.w) - Math.log(desde.w)) * e);
        const h = w * destino.h / destino.w;
        const cx = (desde.x + desde.w / 2) + ((destino.x + destino.w / 2) - (desde.x + desde.w / 2)) * e;
        const cy = (desde.y + desde.h / 2) + ((destino.y + destino.h / 2) - (desde.y + desde.h / 2)) * e;
        vb = { x: cx - w / 2, y: cy - h / 2, w, h };
        aplicarVB(vb);
        if (k < 1) anim = requestAnimationFrame(paso); else { vb = { ...destino }; aplicarVB(vb); }
      };
      anim = requestAnimationFrame(paso);
      if (foco && id !== 'todo') {
        const primero = window.ENCLAVES.find(e => e.zona === id);
        if (primero) setTimeout(() => marcadores[primero.id].focus({ preventScroll: true }), dur + 20);
      }
    }
    botonesVista.forEach(b => b.addEventListener('click', () => verVista(b.dataset.vista, false)));
    window.addEventListener('resize', () => aplicarVB(vb));

    // ---------- Ficha del enclave ----------
    let actual = null;
    function pintarFicha() {
      fichaCaja.textContent = '';
      if (!actual) {
        fichaCaja.append(el('p', { class: 'ficha-vacia', text: 'Pulsa un enclave del mapa o de la lista para ver su ficha.' }));
        return;
      }
      const e = window.ENCLAVES.find(x => x.id === actual);
      const tipo = window.TIPOS_ENCLAVE[e.tipo];
      const facil = window.EGIPTO.facil;
      fichaCaja.append(...[
        el('p', { class: 'ficha-tipo t-' + e.tipo }, window.EGIPTO.iconoTipo(e.tipo), el('span', { text: tipo.nombre })),
        el('h3', { id: 'ficha-titulo', tabindex: '-1', text: e.nombre }),
        el('p', { class: 'ficha-periodo', text: e.periodo }),
        e.aviso ? el('p', { class: 'ficha-aviso', text: '⚠ ' + e.aviso }) : null,
        el('p', { class: 'ficha-texto', text: facil ? e.facil : e.texto }),
        e.aprox ? el('p', { class: 'ficha-nota', text: 'Ubicación aproximada.' }) : null,
      ].filter(Boolean));
      if (e.piramide) {
        const a = el('a', { class: 'boton-3d boton-piramide', 'data-enlace-3d': 'materiales/1eso/gran-piramide/index.html',
          href: 'materiales/1eso/gran-piramide/index.html' + (facil ? '?facil=1' : '') },
          el('span', { class: 'icono', 'aria-hidden': 'true', text: '3D' }),
          el('span', {}, el('b', { text: 'Ver la Gran Pirámide en 3D' }), el('span', { class: 'sub', text: 'Recién terminada y como está hoy, por fuera y por dentro' })),
          el('span', { class: 'flecha', 'aria-hidden': 'true', text: '→' }));
        fichaCaja.append(a, el('p', { class: 'ficha-enlace' }, el('a', { href: '#piramide', text: 'Leer la ficha de datos de la pirámide ↓' })));
      }
    }
    function seleccionar(id, desdeLista) {
      actual = id;
      const e = window.ENCLAVES.find(x => x.id === id);
      const zona = e.zona || 'todo';
      if (zona !== vista) verVista(zona, false);
      for (const [k, m] of Object.entries(marcadores)) m.classList.toggle('activo', k === id);
      lista.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', String(b.dataset.id === id)));
      pintarFicha();
      if (desdeLista) {
        fichaCaja.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'nearest' });
        document.getElementById('ficha-titulo').focus({ preventScroll: true });
      }
    }

    // ---------- Lista accesible (alternativa al mapa) ----------
    const grupos = [
      ['Zona de Menfis', e => e.zona === 'menfis'],
      ['Delta y costa', e => ['avaris', 'alejandria'].includes(e.id)],
      ['Egipto Medio', e => ['amarna', 'abidos'].includes(e.id)],
      ['Zona de Tebas', e => e.zona === 'tebas'],
      ['Sur y Nubia', e => ['asuan', 'abu-simbel'].includes(e.id)],
      ['Mar Rojo', e => e.id === 'wadi-el-jarf'],
    ];
    for (const [titulo, filtro] of grupos) {
      const ul = el('ul', { 'aria-label': titulo });
      for (const e of window.ENCLAVES.filter(filtro)) {
        const b = el('button', { type: 'button', 'data-id': e.id, 'aria-current': 'false' },
          window.EGIPTO.iconoTipo(e.tipo),
          el('span', { class: 'nombre', text: e.nombre }),
          el('span', { class: 'tipo-txt', text: window.TIPOS_ENCLAVE[e.tipo].nombre }));
        b.addEventListener('click', () => seleccionar(e.id, true));
        ul.append(el('li', {}, b));
      }
      lista.append(el('div', { class: 'grupo-lista' }, el('h3', { text: titulo }), ul));
    }
    // Flechas arriba/abajo para moverse por la lista
    lista.addEventListener('keydown', ev => {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      const bs = [...lista.querySelectorAll('button')], i = bs.indexOf(document.activeElement);
      if (i < 0) return;
      ev.preventDefault();
      bs[(i + (ev.key === 'ArrowDown' ? 1 : bs.length - 1)) % bs.length].focus();
    });

    // ---------- Leyenda ----------
    const leyenda = document.getElementById('leyenda-mapa');
    for (const [id, t] of Object.entries(window.TIPOS_ENCLAVE)) {
      leyenda.append(el('li', {}, window.EGIPTO.iconoTipo(id), el('span', { text: t.nombre })));
    }

    function activar(nodo, fn) {
      nodo.addEventListener('click', fn);
      nodo.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(); } });
    }

    window.EGIPTO.alCambiar(pintarFicha);
    verVista('todo', false);
    pintarFicha();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
