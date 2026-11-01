// Cuerpo humano articulado a partir del cuerpo base de MakeHuman (CC0), simplificado
// por herramientas/convertir_makehuman.py. Crea un SkinnedMesh con su esqueleto y
// colorea por zonas la piel y la ropa (la ropa se deforma con el cuerpo).
(function (V) {
  'use strict';
  const ZONAS = { CABEZA: 0, TRONCO: 1, BRAZO: 2, ANTEBRAZO: 3, MANO: 4, MUSLO: 5, PIERNA: 6, PIE: 7 };
  V.ZONAS = ZONAS;
  let geoBase = null, angA = null;

  function geometriaBase() {
    if (geoBase) return geoBase;
    const C = V.cuerpo;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(C.pos, 3));
    g.setIndex(C.idx);
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(C.skinI, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(C.skinW, 4));
    g.computeVertexNormals();
    geoBase = g;
    // Ángulo de los brazos en la postura de reposo (en «A»), para bajarlos junto al cuerpo
    const H = C.huesos, ix = n => H.findIndex(h => h.n === n);
    const a = H[ix('upperarm_l')].p, b = H[ix('lowerarm_l')].p;
    angA = Math.atan2(b[0] - a[0], a[1] - b[1]);
    return g;
  }

  // opciones: colores { piel, ropa, ropa2 }, y qué zonas van vestidas
  //   vestido: { tronco, brazo (manga corta = 0.5 / larga = 1), muslo (0..1 de la longitud cubierta) }
  V.crearCuerpo = function (op) {
    const C = V.cuerpo, g0 = geometriaBase();
    const g = g0.clone();
    const n = C.zona.length, col = new Float32Array(n * 3);
    const piel = new THREE.Color(op.piel), ropa = new THREE.Color(op.ropa), cuero = new THREE.Color(0x4a3423);
    const hb = C.huesos;
    const y = i => C.pos[i * 3 + 1];
    const hombro = hb.find(h => h.n === 'upperarm_l').p, codo = hb.find(h => h.n === 'lowerarm_l').p;
    const cadera = hb.find(h => h.n === 'thigh_l').p, rodilla = hb.find(h => h.n === 'calf_l').p;
    const v = op.vestido || {};
    for (let i = 0; i < n; i++) {
      const z = C.zona[i];
      let c = piel;
      if (z === ZONAS.TRONCO && v.tronco !== false) c = ropa;
      if (z === ZONAS.BRAZO && v.brazo) {
        // fracción del brazo desde el hombro hasta el codo (por distancia al hombro)
        const dx = C.pos[i * 3] - Math.sign(C.pos[i * 3]) * hombro[0], dy = y(i) - hombro[1];
        const largo = Math.hypot(codo[0] - hombro[0], codo[1] - hombro[1]);
        if (Math.hypot(dx, dy) / largo < v.brazo) c = ropa;
      }
      if (z === ZONAS.ANTEBRAZO && v.brazo >= 1) c = ropa;
      if (z === ZONAS.MUSLO && v.muslo) {
        const f = (cadera[1] - y(i)) / (cadera[1] - rodilla[1]);
        if (f < v.muslo) c = ropa;
      }
      if (z === ZONAS.PIE && op.calzado) c = cuero;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // Huesos
    const huesos = hb.map(h => { const b = new THREE.Bone(); b.name = h.n; return b; });
    hb.forEach((h, i) => {
      if (h.padre < 0) huesos[i].position.set(h.p[0], h.p[1], h.p[2]);
      else {
        const p = hb[h.padre].p;
        huesos[i].position.set(h.p[0] - p[0], h.p[1] - p[1], h.p[2] - p[2]);
        huesos[h.padre].add(huesos[i]);
      }
    });
    const esqueleto = new THREE.Skeleton(huesos);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, map: op.textura || null });
    const malla = new THREE.SkinnedMesh(g, mat);
    malla.add(huesos[0]);
    malla.bind(esqueleto);
    malla.castShadow = true; malla.receiveShadow = true;
    malla.frustumCulled = false;
    const H = {};
    huesos.forEach(b => { H[b.name] = b; });
    malla.userData.huesos = H;
    malla.userData.angA = angA;
    return malla;
  };

  // Altura de los ojos y de la coronilla en reposo (para colocar pelo y cabeza)
  V.medidasCuerpo = function () {
    geometriaBase();
    const C = V.cuerpo;
    let max = 0;
    for (let i = 1; i < C.pos.length; i += 3) max = Math.max(max, C.pos[i]);
    const cab = C.huesos.find(h => h.n === 'head').p;
    return { alto: max, cabeza: cab };
  };
})(window.VALDE);
