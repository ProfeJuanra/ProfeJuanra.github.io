// Controles: vista orbital (OrbitControls) y paseo a pie (teclado, arrastre y mando táctil).
(function (V) {
  'use strict';
  const OJOS = 1.6, VEL = 2.2, CORRER = 5.0, LIMITE = 400;

  V.construirControles = function (ctx) {
    const { camera, renderer } = ctx;
    const lienzo = renderer.domElement;
    lienzo.tabIndex = -1;

    // ---------- Órbita ----------
    const oc = new THREE.OrbitControls(camera, lienzo);
    oc.target.set(-2, 0, 0);
    oc.maxPolarAngle = Math.PI * 0.48;
    oc.minDistance = 2.5; oc.maxDistance = 600;
    oc.enableDamping = true; oc.dampingFactor = 0.08;
    oc.screenSpacePanning = false;
    oc.addEventListener('change', ctx.pedirRender);
    ctx.orbita = oc;
    ctx.vistaGeneral = { cam: new THREE.Vector3(42, 34, 58), obj: new THREE.Vector3(-2, 0, 0) };

    // ---------- Paseo ----------
    const p = ctx.paseo = { activo: false, yaw: 0, pitch: -0.05, x: 0, y: 0 };
    const teclas = {};
    let mando = { x: 0, y: 0 };
    let mirando = null;

    function sueloEn(x, y) { return V.alturaSitioOGeneral(x, y); }

    // ¿Cruzaría la pared de alguna cabaña? Se puede pasar solo por la puerta (lado largo oriental).
    function choca(x0, y0, x1, y1) {
      for (const cb of (ctx.cabanas || [])) {
        const c = cb.c;
        const e0 = V.enCabana(x0, y0, c, 0.1), e1 = V.enCabana(x1, y1, c, 0.1);
        if ((e0 - 1) * (e1 - 1) < 0 || Math.abs(e1 - 1) < 0.04) {
          const g = c.giro * Math.PI / 180, dx = x1 - c.x, dy = y1 - c.y;
          const along = dx * Math.sin(g) + dy * Math.cos(g), across = dx * Math.cos(g) - dy * Math.sin(g);
          const th = Math.atan2(across / (c.ancho / 2), along / (c.largo / 2));
          const medio = 0.9 / (c.largo / 2) / 2;
          if (Math.abs(th - Math.PI / 2) > medio * 0.9) return true;
        }
      }
      return false;
    }

    function colocarCamara() {
      camera.position.set(p.x, sueloEn(p.x, p.y) + OJOS, -p.y);
      const d = new THREE.Vector3(Math.sin(p.yaw) * Math.cos(p.pitch), Math.sin(p.pitch), -Math.cos(p.yaw) * Math.cos(p.pitch));
      camera.lookAt(camera.position.clone().add(d));
    }

    ctx.alternarPaseo = function (activar) {
      const nuevo = activar === undefined ? !p.activo : activar;
      if (nuevo === p.activo) return;
      p.activo = nuevo;
      if (nuevo) {
        // Empieza donde mira la órbita, de cara a esa dirección
        const dir = oc.target.clone().sub(camera.position); dir.y = 0;
        if (dir.lengthSq() < 1e-4) dir.set(0, 0, -1);
        dir.normalize();
        p.yaw = Math.atan2(dir.x, -dir.z);
        p.pitch = -0.05;
        const ini = oc.target.clone().addScaledVector(dir, -6);
        p.x = ini.x; p.y = -ini.z;
        oc.enabled = false;
        camera.fov = 65; camera.updateProjectionMatrix();
        colocarCamara();
      } else {
        oc.enabled = true;
        camera.fov = 50; camera.updateProjectionMatrix();
        const fr = new THREE.Vector3(Math.sin(p.yaw), 0, -Math.cos(p.yaw));
        oc.target.set(p.x, sueloEn(p.x, p.y), -p.y).addScaledVector(fr, 4);
        camera.position.set(p.x, sueloEn(p.x, p.y) + 9, -p.y).addScaledVector(fr, -10);
        oc.update();
      }
      ctx.alCambiarModo && ctx.alCambiarModo(nuevo);
      ctx.pedirRender();
    };

    window.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input, textarea, select, dialog[open]')) return;
      teclas[e.code] = true;
      if (p.activo && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { teclas[e.code] = false; });
    window.addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });

    // Mirar arrastrando (ratón o dedo) en modo paseo
    lienzo.addEventListener('pointerdown', e => {
      if (!p.activo) return;
      mirando = { id: e.pointerId, x: e.clientX, y: e.clientY };
      lienzo.setPointerCapture(e.pointerId);
    });
    lienzo.addEventListener('pointermove', e => {
      if (!p.activo || !mirando || e.pointerId !== mirando.id) return;
      const k = e.pointerType === 'touch' ? 0.006 : 0.004;
      p.yaw += (e.clientX - mirando.x) * k;
      p.pitch = Math.max(-1.2, Math.min(1.0, p.pitch - (e.clientY - mirando.y) * k));
      mirando.x = e.clientX; mirando.y = e.clientY;
      colocarCamara(); ctx.pedirRender();
    });
    const soltar = e => { if (mirando && e.pointerId === mirando.id) mirando = null; };
    lienzo.addEventListener('pointerup', soltar);
    lienzo.addEventListener('pointercancel', soltar);
    lienzo.addEventListener('wheel', e => {   // la rueda avanza o retrocede en modo paseo
      if (!p.activo) return;
      e.preventDefault();
      mover(0, -Math.sign(e.deltaY) * 0.8);
    }, { passive: false });

    // Mando táctil
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
      if (choca(p.x, p.y, nx, ny)) {
        // deslizar: probar cada eje por separado
        if (!choca(p.x, p.y, nx, p.y)) p.x = nx; else if (!choca(p.x, p.y, p.x, ny)) p.y = ny; else return false;
      } else { p.x = nx; p.y = ny; }
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
      if (!ad && !la && !giro) return false;
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
      vuelo = { t: 0, dur: ctx.vueloInstantaneo ? 0.001 : (dur || Math.min(4, Math.max(1.4, lejos / 700))), c0: camera.position.clone(), o0: oc.target.clone(), c1: cam.clone(), o1: obj.clone() };
      ctx.pedirRender();
    };
    // Vista en coordenadas del plano: [x, y, altura, tx, ty, taltura]
    ctx.volarAVista = function (v, dur) {
      const cam = new THREE.Vector3(v[0], sueloEn(v[0], v[1]) + v[2], -v[1]);
      const obj = new THREE.Vector3(v[3], sueloEn(v[3], v[4]) + v[5], -v[4]);
      ctx.volarA(cam, obj, dur);
    };
    ctx.animadores.push(dt => {
      if (!vuelo) return false;
      vuelo.t += dt / vuelo.dur;
      const t = Math.min(1, vuelo.t), k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      // Arco suave: sube un poco a mitad de camino para no atravesar objetos
      const arco = Math.sin(Math.PI * t) * Math.min(260, vuelo.c0.distanceTo(vuelo.c1) * 0.25);
      camera.position.lerpVectors(vuelo.c0, vuelo.c1, k); camera.position.y += arco;
      oc.target.lerpVectors(vuelo.o0, vuelo.o1, k);
      oc.update();
      if (t >= 1) vuelo = null;
      return true;
    });

    ctx.controles = { orbita: oc, paseo: p };
  };
})(window.VALDE);
