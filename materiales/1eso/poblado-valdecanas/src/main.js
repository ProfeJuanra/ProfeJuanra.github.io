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
  let calidad = 'alta';
  try { calidad = localStorage.getItem('valde-calidad') || (movil ? 'baja' : 'alta'); } catch (e) { calidad = movil ? 'baja' : 'alta'; }
  const qCal = new URLSearchParams(location.search).get('calidad');
  if (qCal === 'baja' || qCal === 'alta') calidad = qCal;   // ?calidad=baja fuerza el modo ligero

  const contenedor = document.getElementById('escena');
  const renderer = new THREE.WebGLRenderer({ antialias: calidad !== 'baja', logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, calidad === 'baja' ? 1.25 : 1.5));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = calidad !== 'baja';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  contenedor.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 9000);
  camera.position.set(42, 34, 58);

  const ctx = V.ctx = { scene, renderer, camera, calidad, movil, horaInicial: 10.5 };

  let pendiente = true;
  ctx.pedirRender = function () { pendiente = true; };
  ctx.animadores = [];   // funciones (dt) que necesitan dibujo continuo

  function ajustar() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    pendiente = true;
  }
  window.addEventListener('resize', ajustar);

  // Construcción por fases
  V.plano = window.VALDE.plano;
  const fases = ['construirTerreno', 'construirVegetacion', 'construirLuz', 'construirEstructuras', 'construirCabanas', 'construirVida', 'construirInterfaz', 'construirEvidencia', 'construirComparacion'];
  for (const f of fases) if (typeof V[f] === 'function') V[f](ctx);

  // Controles orbitales por defecto (la interfaz puede sustituirlos)
  if (!ctx.controles) {
    const oc = new THREE.OrbitControls(camera, renderer.domElement);
    oc.target.set(-2, 0, 0);
    oc.maxPolarAngle = Math.PI * 0.47;
    oc.minDistance = 4; oc.maxDistance = 400;
    oc.enableDamping = true;
    oc.addEventListener('change', ctx.pedirRender);
    ctx.orbita = oc;
  }

  // Parámetros de URL para capturas reproducibles: ?cam=x,y,z,tx,ty,tz&hora=18
  const q = new URLSearchParams(location.search);
  if (q.get('cam')) {
    const v = q.get('cam').split(',').map(Number);
    camera.position.set(v[0], v[1], v[2]);
    if (ctx.orbita) ctx.orbita.target.set(v[3], v[4], v[5]); else camera.lookAt(v[3], v[4], v[5]);
  }
  if (q.get('hora')) {
    const rh = document.getElementById('r-hora');
    if (rh) { rh.value = q.get('hora'); rh.dispatchEvent(new Event('input')); } else if (ctx.fijarHora) ctx.fijarHora(Number(q.get('hora')));
  }
  if (q.get('limpio')) { document.body.classList.add('limpio'); if (ctx.verMarcadores) ctx.verMarcadores(false); }   // imagen sin interfaz
  if (q.get('estatico')) { ctx.animando = false; ctx.vueloInstantaneo = true; }   // modo de capturas de prueba
  if (q.get('ficha') && ctx.abrirFicha) ctx.abrirFicha(Number(q.get('ficha')), true);
  if (q.get('pasear') && ctx.alternarPaseo) ctx.alternarPaseo(true);
  if (q.get('depurar')) setInterval(() => {
    const i = renderer.info.render;
    document.body.dataset.cam = camera.position.toArray().map(v => v.toFixed(1)).join(',');
    document.body.dataset.info = `tri=${i.triangles} llamadas=${i.calls} objetos=${V.objetosNivel.length}`;
    document.body.dataset.etiquetas = [...new Set(V.objetosNivel.map(o => o.userData.nivel + ':' + (o.userData.etiqueta || '').replace(/ \d+[\/\d]*| [0-9-ab]+ /g, ' ')))].sort().join('|');
  }, 300);
  if (q.get('capa') && ctx.capaEvidencia) ctx.capaEvidencia(true);
  if (q.get('comparar') && ctx.fijarComparacion) ctx.fijarComparacion(Number(q.get('comparar')));

  ajustar();
  const reloj = new THREE.Clock();
  function bucle() {
    requestAnimationFrame(bucle);
    const dt = Math.min(reloj.getDelta(), 0.1);
    let mover = false;
    if (ctx.orbita && ctx.orbita.enabled) mover = ctx.orbita.update() || mover;
    for (const a of ctx.animadores) mover = a(dt) || mover;
    if (pendiente || mover) {
      if (ctx.renderizar) ctx.renderizar(); else renderer.render(scene, camera);
      pendiente = false;
      ctx.trasRender && ctx.trasRender();
    }
  }
  bucle();
  const carga = document.getElementById('cargando');
  if (carga) { carga.classList.add('oculto'); setTimeout(() => carga.remove(), 800); }
  V.info = () => renderer.info.render;
})(window.VALDE);
