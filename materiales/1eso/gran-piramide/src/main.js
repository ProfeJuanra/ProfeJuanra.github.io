/*
  RECONSTRUCCIÓN 3D DE LA GRAN PIRÁMIDE: arranque, controles e interfaz.
  Usa three.js r147 (copia local en src/vendor) y OrbitControls.
  Solo dibuja cuando algo cambia, para ahorrar batería en móviles y tablets.
*/
(function () {
  'use strict';
  function hayWebGL() {
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }
  if (!hayWebGL()) { location.replace('texto.html?sin3d=1'); return; }

  const $ = s => document.querySelector(s);
  const el = (tag, attrs, ...hijos) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) { if (k === 'text') e.textContent = v; else if (k === 'class') e.className = v; else e.setAttribute(k, v); }
    for (const h of hijos) if (h != null) e.append(h);
    return e;
  };
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const movil = /Android|iPhone|iPad|iPod|Mobile|CrOS/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 820);
  const calidad = /calidad=alta/.test(location.search) ? 'alta' : (/calidad=baja/.test(location.search) || movil ? 'baja' : 'alta');

  // ---------- Renderizador y cámara ----------
  const contenedor = $('#escena');
  const renderer = new THREE.WebGLRenderer({ antialias: calidad !== 'baja', preserveDrawingBuffer: /captura=1/.test(location.search) });
  renderer.setPixelRatio(Math.min(devicePixelRatio, calidad === 'baja' ? 1.25 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = calidad !== 'baja';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  contenedor.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('tabindex', '0');
  renderer.domElement.setAttribute('aria-label', 'Vista 3D de la Gran Pirámide. Flechas: girar. Más y menos: acercar y alejar.');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.3, 6000);
  const escena = window.construirEscena({ scene, calidad });

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 3; controls.maxDistance = 1100;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.enablePan = true; controls.screenSpacePanning = true;

  let pendiente = true;
  const pedir = () => { pendiente = true; };
  controls.addEventListener('change', pedir);

  const VISTAS = {
    general: { pos: [300, 150, -360], obj: [0, 50, 0] },
    dentro: { pos: [175, 42, -38], obj: [4, 14, -34] },
    persona: { pos: [A_() + 12, 3.2, -A_() - 18], obj: [A_() + 2, 1.0, -A_()] },
  };
  function A_() { return window.MEDIDAS.A; }

  function ajustar() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas verticales se aleja la cámara para que quepa la pirámide
    camera.fov = w < h ? 60 : 45;
    camera.updateProjectionMatrix();
    pedir();
  }
  addEventListener('resize', ajustar);

  // Vuelo suave de la cámara
  let vuelo = null;
  function volar(nombre, inmediato) {
    const v = VISTAS[nombre];
    const p1 = new THREE.Vector3(...v.pos), o1 = new THREE.Vector3(...v.obj);
    // En pantallas estrechas (móvil en vertical) la cámara se aleja para que quepa todo
    if (nombre !== 'persona' && camera.aspect < 1) p1.sub(o1).multiplyScalar(1 + (1 - camera.aspect) * 1.1).add(o1);
    if (inmediato || reducido) { camera.position.copy(p1); controls.target.copy(o1); controls.update(); pedir(); return; }
    vuelo = { p0: camera.position.clone(), o0: controls.target.clone(), p1, o1, t0: performance.now(), dur: 1400 };
  }

  // ---------- Estado de la interfaz ----------
  let estado = 'completa', dentro = false;
  let facil = /[?&]facil=1/.test(location.search);
  try { if (!facil) facil = localStorage.getItem('egipto-facil') === '1'; } catch (e) { /* sin almacenamiento */ }

  const bCompleta = $('#b-completa'), bHoy = $('#b-hoy'), bDentro = $('#b-dentro'), bFacil = $('#b-facil');
  function aplicarEstado() {
    escena.ponerEstado(estado, dentro);
    bCompleta.setAttribute('aria-pressed', String(estado === 'completa'));
    bHoy.setAttribute('aria-pressed', String(estado === 'hoy'));
    bDentro.setAttribute('aria-pressed', String(dentro));
    $('#nota-interior').hidden = !dentro;
    $('#estado-texto').textContent = (estado === 'completa' ? 'Recién terminada, hacia 2560 a. C.' : 'Hoy') + (dentro ? ' · vista por dentro' : '');
    pintarLista(); pintarMarcas(); pedir();
  }
  bCompleta.addEventListener('click', () => { estado = 'completa'; aplicarEstado(); });
  bHoy.addEventListener('click', () => { estado = 'hoy'; aplicarEstado(); });
  bDentro.addEventListener('click', () => { dentro = !dentro; aplicarEstado(); volar(dentro ? 'dentro' : 'general'); });
  bFacil.addEventListener('click', () => {
    facil = !facil;
    try { localStorage.setItem('egipto-facil', facil ? '1' : '0'); } catch (e) { /* sin almacenamiento */ }
    pintarFacil();
  });
  function pintarFacil() {
    bFacil.setAttribute('aria-pressed', String(facil));
    document.documentElement.classList.toggle('lectura-facil', facil);
    $('#volver-mapa').href = '../../../egipto.html' + (facil ? '?facil=1' : '') + '#piramide';
    if (abierto) abrirPunto(abierto, false);
  }
  $('#b-reset').addEventListener('click', () => volar(dentro ? 'dentro' : 'general'));
  $('#b-escala').addEventListener('click', () => { if (dentro) { dentro = false; aplicarEstado(); } volar('persona'); abrirPunto('persona', false); });

  // Girar y acercar con botones y teclado
  function girar(ang) {
    const o = controls.target, p = camera.position.clone().sub(o);
    p.applyAxisAngle(new THREE.Vector3(0, 1, 0), ang);
    camera.position.copy(o).add(p); controls.update(); pedir();
  }
  function zoom(f) {
    const o = controls.target, p = camera.position.clone().sub(o);
    const d = THREE.MathUtils.clamp(p.length() * f, controls.minDistance, controls.maxDistance);
    camera.position.copy(o).add(p.setLength(d)); controls.update(); pedir();
  }
  $('#b-izq').addEventListener('click', () => girar(-Math.PI / 8));
  $('#b-der').addEventListener('click', () => girar(Math.PI / 8));
  $('#b-mas').addEventListener('click', () => zoom(0.75));
  $('#b-menos').addEventListener('click', () => zoom(1.33));
  renderer.domElement.addEventListener('keydown', e => {
    const acc = { ArrowLeft: () => girar(-Math.PI / 24), ArrowRight: () => girar(Math.PI / 24), ArrowUp: () => zoom(0.9), ArrowDown: () => zoom(1.1), '+': () => zoom(0.85), '-': () => zoom(1.18) }[e.key];
    if (acc) { e.preventDefault(); acc(); }
  });

  // ---------- Puntos de información ----------
  const marcasCaja = $('#marcas');
  const visible = p => (p.modo === 'ambos' || (p.modo === 'dentro') === dentro) && (p.estado === 'ambos' || p.estado === estado);
  const marcas = {};
  for (const p of window.PUNTOS) {
    const b = el('button', { type: 'button', class: 'marca', 'aria-label': p.n + '. ' + p.titulo, title: p.titulo, text: String(p.n) });
    b.addEventListener('click', () => abrirPunto(p.id, true));
    marcas[p.id] = b; marcasCaja.append(b);
  }
  function pintarMarcas() { for (const p of window.PUNTOS) marcas[p.id].hidden = !visible(p); posicionarMarcas(); }
  const v3 = new THREE.Vector3();
  function posicionarMarcas() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    for (const p of window.PUNTOS) {
      const b = marcas[p.id];
      if (b.hidden) continue;
      v3.set(...p.pos).project(camera);
      const fuera = v3.z > 1 || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05;
      b.style.visibility = fuera ? 'hidden' : '';
      b.style.transform = `translate(${((v3.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v3.y) / 2 * h).toFixed(1)}px)`;
    }
  }

  // Lista de puntos (alternativa accesible al 3D)
  const ol = $('#lista-puntos');
  function pintarLista() {
    ol.textContent = '';
    for (const p of window.PUNTOS.filter(visible)) {
      const b = el('button', { type: 'button', 'data-id': p.id }, el('span', { class: 'n', text: String(p.n) }), el('span', { text: p.titulo }));
      b.addEventListener('click', () => abrirPunto(p.id, true));
      ol.append(el('li', {}, b));
    }
  }

  // Panel con la ficha del punto
  const panel = $('#panel');
  let abierto = null;
  const NIVEL = { 'Medido': ['📏', 'medido'], 'Estimación': ['≈', 'estimacion'], 'Documentado': ['📜', 'documentado'], 'Hipótesis': ['?', 'hipotesis'] };
  // Cita breve: «Autor (año)» o la primera parte de la cita
  const corta = c => { const m = c.match(/^(.*?\(\d{4}\))/); return m ? m[1] : c.split(':')[0].split(', libro')[0]; };
  function abrirPunto(id, mover) {
    const p = window.PUNTOS.find(x => x.id === id);
    abierto = id;
    for (const [k, b] of Object.entries(marcas)) b.classList.toggle('activa', k === id);
    $('#panel-num').textContent = p.n;
    $('#panel-titulo').textContent = p.titulo;
    const nv = NIVEL[p.nivel];
    const nivel = $('#panel-nivel');
    nivel.className = 'nivel ' + nv[1]; nivel.textContent = nv[0] + ' ' + p.nivel;
    $('#panel-texto').textContent = facil ? p.facil : p.texto;
    const datoCaja = $('#panel-dato');
    datoCaja.textContent = '';
    const d = p.dato && window.PIRAMIDE.datos.find(x => x.id === p.dato);
    if (d) {
      const F = window.PIRAMIDE.FUENTES;
      datoCaja.append(
        el('p', { class: 'dato-cab' }, el('span', { class: 'nivel ' + NIVEL[d.nivel][1], text: NIVEL[d.nivel][0] + ' ' + d.nivel }), ' ', el('b', { text: d.titulo + ': ' }), d.valor),
        el('p', { class: 'dato-fuentes', text: 'Fuentes: ' + d.fuentes.map(f => corta(F[f].cita)).join(' · ') }));
    }
    panel.hidden = false;
    if (mover) $('#panel-titulo').focus({ preventScroll: true });
  }
  $('#panel-cerrar').addEventListener('click', () => {
    panel.hidden = true;
    if (abierto && marcas[abierto]) { marcas[abierto].classList.remove('activa'); }
    abierto = null;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) $('#panel-cerrar').click(); });

  // Ayuda
  const ayuda = $('#ayuda');
  $('#b-ayuda').addEventListener('click', () => { ayuda.hidden = !ayuda.hidden; $('#b-ayuda').setAttribute('aria-expanded', String(!ayuda.hidden)); });
  $('#ayuda-cerrar').addEventListener('click', () => { ayuda.hidden = true; $('#b-ayuda').setAttribute('aria-expanded', 'false'); $('#b-ayuda').focus(); });

  // Lista plegable en móvil
  $('#b-lista').addEventListener('click', () => {
    const nav = $('#nav-puntos'), abiertaL = nav.classList.toggle('abierta');
    $('#b-lista').setAttribute('aria-expanded', String(abiertaL));
  });

  // ---------- Bucle de dibujo ----------
  function bucle(t) {
    requestAnimationFrame(bucle);
    if (vuelo) {
      const k = Math.min(1, (t - vuelo.t0) / vuelo.dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.lerpVectors(vuelo.p0, vuelo.p1, e);
      controls.target.lerpVectors(vuelo.o0, vuelo.o1, e);
      if (k >= 1) vuelo = null;
      pendiente = true;
    }
    if (controls.update()) pendiente = true;
    if (!pendiente) return;
    pendiente = false;
    renderer.render(scene, camera);
    posicionarMarcas();
  }

  ajustar();
  volar('general', true);
  aplicarEstado();
  pintarFacil();
  requestAnimationFrame(bucle);
  const cargando = $('#cargando');
  cargando.classList.add('oculto');
  setTimeout(() => cargando.remove(), 700);
  window.__piramide = { renderer, scene, camera, controls, volar, pedir };
})();
