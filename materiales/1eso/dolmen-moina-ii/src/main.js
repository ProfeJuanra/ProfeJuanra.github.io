// Arranque: renderizador, cámara, construcción de la escena y bucle de dibujo.
(function (V) {
  'use strict';
  function hayWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  if (!hayWebGL()) { location.replace('texto.html?sin3d=1'); return; }

  const movil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 820);
  let calidad = movil ? 'baja' : 'alta';
  try { calidad = localStorage.getItem('moina-calidad') || calidad; } catch (e) { /* sin almacenamiento */ }
  const q = new URLSearchParams(location.search);
  if (q.get('calidad') === 'baja' || q.get('calidad') === 'alta') calidad = q.get('calidad');

  const contenedor = document.getElementById('escena');
  const renderer = new THREE.WebGLRenderer({ antialias: calidad !== 'baja', preserveDrawingBuffer: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, calidad === 'baja' ? 1.25 : 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = calidad !== 'baja';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  contenedor.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 9000);
  const ctx = V.ctx = { scene, renderer, camera, calidad, movil, horaInicial: 10.5 };
  let pendiente = true;
  ctx.pedirRender = function () { pendiente = true; };
  ctx.animadores = [];

  function ajustar() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    pendiente = true;
  }
  window.addEventListener('resize', ajustar);

  const fases = ['construirPaisaje', 'construirLuz', 'construirDolmen', 'construirInterfaz', 'construirEvidencia'];
  for (const f of fases) V[f](ctx);

  // Parámetros para capturas reproducibles: ?cam=x,y,z,tx,ty,tz&hora=18&momento=hoy&corte=1&ficha=3
  if (q.get('momento') && ctx.fijarMomento) ctx.fijarMomento(q.get('momento'), true);
  if (q.get('estatico')) { ctx.animando = false; ctx.vueloInstantaneo = true; }
  if (q.get('ficha') && ctx.abrirFicha) ctx.abrirFicha(Number(q.get('ficha')), true);
  if (q.get('corte') && ctx.fijarCorte) ctx.fijarCorte(true);
  if (q.get('cam')) {
    const v = q.get('cam').split(',').map(Number);
    camera.position.set(v[0], v[1], v[2]);
    ctx.orbita.target.set(v[3], v[4], v[5]);
  }
  if (q.get('hora')) { const rh = document.getElementById('r-hora'); rh.value = q.get('hora'); rh.dispatchEvent(new Event('input')); }
  if (q.get('pasear') && ctx.alternarPaseo) ctx.alternarPaseo(true);
  if (q.get('capa') && ctx.capaEvidencia) ctx.capaEvidencia(true);
  if (q.get('limpio')) { document.body.classList.add('limpio'); ctx.verMarcadores(false); }

  ajustar();
  const reloj = new THREE.Clock();
  function bucle() {
    requestAnimationFrame(bucle);
    const dt = Math.min(reloj.getDelta(), 0.1);
    let mover = false;
    if (ctx.orbita && ctx.orbita.enabled) mover = ctx.orbita.update() || mover;
    for (const a of ctx.animadores) mover = a(dt) || mover;
    if (pendiente || mover) { renderer.render(scene, camera); pendiente = false; }
  }
  bucle();
  const carga = document.getElementById('cargando');
  if (carga) { carga.classList.add('oculto'); setTimeout(() => carga.remove(), 800); }
  V.info = () => renderer.info.render;
})(window.MOINA);
