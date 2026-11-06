// Luz solar para unos 40,1° N el 21 de junio (cálculo astronómico simplificado), cielo y niebla.
(function (V) {
  'use strict';
  const LAT = 40.06 * Math.PI / 180;   // Jaraíz de la Vera
  const DECL = 23.44 * Math.PI / 180;   // declinación solar en el solsticio de verano

  // Hora solar (6-21) → altura y acimut del sol (acimut desde el norte, hacia el este)
  V.posicionSol = function (hora) {
    const H = (hora - 12) * 15 * Math.PI / 180;
    const sinAlt = Math.sin(LAT) * Math.sin(DECL) + Math.cos(LAT) * Math.cos(DECL) * Math.cos(H);
    const alt = Math.asin(sinAlt);
    let az = Math.atan2(-Math.sin(H), Math.tan(DECL) * Math.cos(LAT) - Math.sin(LAT) * Math.cos(H));
    if (az < 0) az += Math.PI * 2;
    return { alt, az };
  };

  function mezclaColor(a, b, t) { return new THREE.Color(a).lerp(new THREE.Color(b), Math.min(1, Math.max(0, t))); }

  V.construirLuz = function (ctx) {
    const { scene } = ctx;
    const hemi = new THREE.HemisphereLight(0xcfe3f2, 0x6b5b3e, 0.55);
    scene.add(hemi);
    ctx.hemi = hemi;
    const sol = new THREE.DirectionalLight(0xfff1d6, 1.0);
    sol.castShadow = ctx.calidad !== 'baja';
    sol.shadow.mapSize.set(2048, 2048);
    const sc = sol.shadow.camera;
    sc.left = -38; sc.right = 38; sc.top = 38; sc.bottom = -38; sc.near = 10; sc.far = 400;
    sol.shadow.bias = -0.0006;
    sol.shadow.radius = 3;
    sol.shadow.normalBias = 0.04;
    scene.add(sol, sol.target);

    // Cúpula de cielo con degradado
    const gCielo = new THREE.SphereGeometry(7000, 24, 12);
    const colCielo = new Float32Array(gCielo.attributes.position.count * 3);
    gCielo.setAttribute('color', new THREE.BufferAttribute(colCielo, 3));
    const cielo = new THREE.Mesh(gCielo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
    cielo.renderOrder = -10;
    cielo.name = 'cielo';
    scene.add(cielo);
    scene.fog = new THREE.Fog(0xd9e2e6, 300, 2600);

    const dirSol = new THREE.Vector3(), centro = new THREE.Vector3(), ultimo = new THREE.Vector3(1e9, 0, 0);
    function colocarSol(forzar) {
      if (ctx.paseo && ctx.paseo.activo) centro.copy(ctx.camera.position);
      else if (ctx.orbita) centro.copy(ctx.orbita.target);
      if (!forzar && centro.distanceToSquared(ultimo) < 16) return;
      ultimo.copy(centro);
      sol.target.position.copy(centro);
      sol.position.copy(centro).add(dirSol);
      sol.target.updateMatrixWorld();
      ctx.pedirRender && ctx.pedirRender();
    }
    ctx.fijarHora = function (hora) {
      const { alt, az } = V.posicionSol(hora);
      const d = 220;
      const ca = Math.cos(alt);
      // Dirección hacia el sol: este = +X, norte = -Z
      dirSol.set(Math.sin(az) * ca, Math.max(Math.sin(alt), 0.02), -Math.cos(az) * ca).multiplyScalar(d);
      colocarSol(true);
      const altG = alt * 180 / Math.PI;
      const tarde = 1 - V.paso(4, 25, altG);       // 1 al amanecer o atardecer
      sol.color.copy(mezclaColor(0xfff3dc, 0xff9a52, tarde));
      sol.intensity = 0.3 + 1.35 * V.paso(-2, 30, altG);
      hemi.intensity = (0.3 + 0.55 * V.paso(-4, 35, altG)) * (ctx.factorInterior || 1);
      ctx.hemiBase = 0.3 + 0.55 * V.paso(-4, 35, altG);
      const cenit = mezclaColor(0x5d8fc4, 0x34507a, tarde);
      const horizonte = mezclaColor(0xdfe8ec, 0xf2b07a, tarde);
      if (altG < 0) { cenit.lerp(new THREE.Color(0x1d2840), 0.6); horizonte.lerp(new THREE.Color(0x6a5a6a), 0.5); }
      const p = gCielo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const t = Math.max(0, p.getY(i) / 7000);
        const c = horizonte.clone().lerp(cenit, Math.pow(t, 0.6));
        colCielo[i * 3] = c.r; colCielo[i * 3 + 1] = c.g; colCielo[i * 3 + 2] = c.b;
      }
      gCielo.attributes.color.needsUpdate = true;
      scene.fog.color.copy(horizonte);
      if (ctx.sierras) ctx.sierras.material.color.copy(new THREE.Color(0.9, 0.92, 0.96).lerp(horizonte, 0.35).multiplyScalar(0.55 + 0.4 * V.paso(-4, 25, altG)));
      ctx.horaActual = hora;
      ctx.pedirRender && ctx.pedirRender();
    };
    ctx.sol = sol;
    // La zona de sombras sigue a la cámara (así también hay sombras junto al dolmen)
    ctx.animadores.push(() => { colocarSol(false); return false; });
    ctx.fijarHora(ctx.horaInicial || 10.5);
  };
})(window.MOINA);
