// Controles: vista orbital y paseo a pie (teclado, arrastre y mando táctil).
// En el paseo no se atraviesan las piedras: se entra por el vestíbulo y el corredor (agachado) hasta la cámara.
(function (V) {
  'use strict';
  const VEL = 1.8, CORRER = 4.2, LIMITE = 300;

  V.construirControles = function (ctx) {
    const { camera, renderer } = ctx;
    const lienzo = renderer.domElement;
    lienzo.tabIndex = -1;

    // ---------- Órbita ----------
    const oc = new THREE.OrbitControls(camera, lienzo);
    oc.target.set(0, 0.8, 0);
    oc.maxPolarAngle = Math.PI * 0.49;
    oc.minDistance = 1.5; oc.maxDistance = 260;
    oc.enableDamping = true; oc.dampingFactor = 0.08;
    oc.screenSpacePanning = false;
    oc.addEventListener('change', ctx.pedirRender);
    ctx.orbita = oc;
    const ini = V.desdeEje(24, -9);
    ctx.vistaGeneral = { cam: new THREE.Vector3(ini.x, 13, -ini.y), obj: new THREE.Vector3(0, 0.8, 0) };
    camera.position.copy(ctx.vistaGeneral.cam);

    // ---------- Paseo ----------
    const p = ctx.paseo = { activo: false, yaw: 0, pitch: -0.05, x: 0, y: 0, ojos: 1.6 };
    const teclas = {};
    let mando = { x: 0, y: 0 };
    let mirando = null;

    // Antorcha: luz cálida que acompaña al visitante bajo techo
    const antorcha = new THREE.PointLight(0xffb066, 0, 7, 1.4);
    ctx.scene.add(antorcha);

    function colocarCamara() {
      const objetivo = V.ojosPaseo(p.x, p.y);
      p.ojos += (objetivo - p.ojos) * 0.25;
      camera.position.set(p.x, V.sueloPaseo(p.x, p.y) + p.ojos, -p.y);
      const d = new THREE.Vector3(Math.sin(p.yaw) * Math.cos(p.pitch), Math.sin(p.pitch), -Math.cos(p.yaw) * Math.cos(p.pitch));
      camera.lookAt(camera.position.clone().add(d));
      const dentro = V.cubierto(p.x, p.y);
      antorcha.intensity = dentro ? 1.6 : 0;
      antorcha.position.copy(camera.position).add(new THREE.Vector3(0.25, -0.15, 0));
      const f = dentro ? 0.3 : 1;
      if (ctx.factorInterior !== f) {
        ctx.factorInterior = f;
        if (ctx.hemi && ctx.hemiBase) ctx.hemi.intensity = ctx.hemiBase * f;
        ctx.alEntrar && ctx.alEntrar(dentro);
      }
    }

    ctx.alternarPaseo = function (activar) {
      const nuevo = activar === undefined ? !p.activo : activar;
      if (nuevo === p.activo) return;
      p.activo = nuevo;
      if (nuevo) {
        // Empieza fuera, frente al vestíbulo, mirando hacia la cámara
        const s = V.desdeEje(12.5, 0);
        p.x = s.x; p.y = s.y;
        const d = V.dir(V.datos.rumboAcceso);
        p.yaw = Math.atan2(-d.x, -d.y);
        p.pitch = -0.08; p.ojos = 1.6;
        oc.enabled = false;
        camera.fov = 68; camera.updateProjectionMatrix();
        colocarCamara();
      } else {
        oc.enabled = true;
        camera.fov = 50; camera.updateProjectionMatrix();
        antorcha.intensity = 0;
        ctx.factorInterior = 1; if (ctx.hemi && ctx.hemiBase) ctx.hemi.intensity = ctx.hemiBase;
        const fr = new THREE.Vector3(Math.sin(p.yaw), 0, -Math.cos(p.yaw));
        oc.target.set(p.x, V.sueloPaseo(p.x, p.y) + 0.8, -p.y).addScaledVector(fr, 3);
        camera.position.set(p.x, V.sueloPaseo(p.x, p.y) + 7, -p.y).addScaledVector(fr, -8);
        oc.update();
        ctx.alEntrar && ctx.alEntrar(false);
      }
      ctx.alCambiarModo && ctx.alCambiarModo(nuevo);
      ctx.pedirRender();
    };
    ctx.recolocarPaseo = function () { if (p.activo) { const s = V.desdeEje(12.5, 0); p.x = s.x; p.y = s.y; colocarCamara(); ctx.pedirRender(); } };

    window.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input, textarea, select, dialog[open]')) return;
      teclas[e.code] = true;
      if (p.activo && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { teclas[e.code] = false; });
    window.addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });

    lienzo.addEventListener('pointerdown', e => {
      if (!p.activo) return;
      mirando = { id: e.pointerId, x: e.clientX, y: e.clientY };
      lienzo.setPointerCapture(e.pointerId);
    });
    lienzo.addEventListener('pointermove', e => {
      if (!p.activo || !mirando || e.pointerId !== mirando.id) return;
      const k = e.pointerType === 'touch' ? 0.006 : 0.004;
      p.yaw += (e.clientX - mirando.x) * k;
      p.pitch = Math.max(-1.2, Math.min(1.1, p.pitch - (e.clientY - mirando.y) * k));
      mirando.x = e.clientX; mirando.y = e.clientY;
      colocarCamara(); ctx.pedirRender();
    });
    const soltar = e => { if (mirando && e.pointerId === mirando.id) mirando = null; };
    lienzo.addEventListener('pointerup', soltar);
    lienzo.addEventListener('pointercancel', soltar);
    lienzo.addEventListener('wheel', e => {
      if (!p.activo) return;
      e.preventDefault();
      mover(0, -Math.sign(e.deltaY) * 0.5);
    }, { passive: false });

    const elMando = document.getElementById('mando'), bola = document.getElementById('mando-bola');
    if (elMando) {
      let id = null;
      const centro = () => { const r = elMando.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 }; };
      const fijar = e => {
        const c = centro();
        let dx = (e.clientX - c.x) / c.r, dy = (e.clientY - c.y) / c.r;
        const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
        mando = { x: dx, y: dy };
        bola.style.transform = `translate(${dx * 35}px, ${dy * 35}px)`;
      };
      elMando.addEventListener('pointerdown', e => { id = e.pointerId; elMando.setPointerCapture(id); fijar(e); e.stopPropagation(); });
      elMando.addEventListener('pointermove', e => { if (e.pointerId === id) fijar(e); });
      const fin = e => { if (e.pointerId === id) { id = null; mando = { x: 0, y: 0 }; bola.style.transform = ''; } };
      elMando.addEventListener('pointerup', fin);
      elMando.addEventListener('pointercancel', fin);
    }

    function mover(lado, adelante) {
      const s = Math.sin(p.yaw), c = Math.cos(p.yaw);
      const nx = p.x + s * adelante + c * lado, ny = p.y + c * adelante - s * lado;
      if (Math.hypot(nx, ny) > LIMITE) return false;
      if (V.puedePasar(p.x, p.y, nx, ny)) { p.x = nx; p.y = ny; }
      else if (V.puedePasar(p.x, p.y, nx, p.y)) p.x = nx;      // deslizar junto a la pared
      else if (V.puedePasar(p.x, p.y, p.x, ny)) p.y = ny;
      else return false;
      colocarCamara();
      return true;
    }

    ctx.animadores.push(dt => {
      if (!p.activo) return false;
      let ad = 0, la = 0, giro = 0;
      if (teclas.KeyW || teclas.ArrowUp) ad += 1;
      if (teclas.KeyS || teclas.ArrowDown) ad -= 1;
      if (teclas.KeyA) la -= 1;
      if (teclas.KeyD) la += 1;
      if (teclas.ArrowLeft) giro -= 1;
      if (teclas.ArrowRight) giro += 1;
      ad -= mando.y; la += mando.x * 0.7;
      const asentando = Math.abs(V.ojosPaseo(p.x, p.y) - p.ojos) > 0.01;
      if (!ad && !la && !giro) { if (asentando) { colocarCamara(); return true; } return false; }
      const v = (teclas.ShiftLeft || teclas.ShiftRight ? CORRER : VEL) * dt;
      p.yaw += giro * 1.6 * dt;
      mover(la * v, ad * v);
      colocarCamara();
      return true;
    });

    // ---------- Vuelo de cámara hasta una vista ----------
    let vuelo = null;
    ctx.volarA = function (cam, obj, dur) {
      if (p.activo) ctx.alternarPaseo(false);
      const lejos = camera.position.distanceTo(cam);
      vuelo = { t: 0, dur: ctx.vueloInstantaneo ? 0.001 : (dur || Math.min(3, Math.max(1.2, lejos / 40))), c0: camera.position.clone(), o0: oc.target.clone(), c1: cam.clone(), o1: obj.clone() };
      ctx.pedirRender();
    };
    // Vista en coordenadas del plano: [x, y, altura absoluta, tx, ty, taltura absoluta]
    ctx.volarAVista = function (v, dur) {
      ctx.volarA(new THREE.Vector3(v[0], v[2], -v[1]), new THREE.Vector3(v[3], v[5], -v[4]), dur);
    };
    ctx.animadores.push(dt => {
      if (!vuelo) return false;
      vuelo.t += dt / vuelo.dur;
      const t = Math.min(1, vuelo.t), k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const arco = Math.sin(Math.PI * t) * Math.min(12, vuelo.c0.distanceTo(vuelo.c1) * 0.2);
      camera.position.lerpVectors(vuelo.c0, vuelo.c1, k); camera.position.y += arco;
      oc.target.lerpVectors(vuelo.o0, vuelo.o1, k);
      oc.update();
      if (t >= 1) vuelo = null;
      return true;
    });

    ctx.controles = { orbita: oc, paseo: p };
  };
})(window.MOINA);
