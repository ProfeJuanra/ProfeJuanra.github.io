// Fase c: cabañas. Planta de la 31 documentada (10,56 × 2,59 m, sin agujeros de poste).
// Paredes de ramas manteadas con barro (deducido). Postes, altura, cubierta y puerta (hipótesis).
// H1-H3: cabañas enteramente hipotéticas con la forma de la 31.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const ALTO_PARED = 1.2, ALTO_CABALLETE = 1.7, ALERO = 0.35, PUERTA = 0.9;

  let texPared, texPaja;
  function texturas() {
    if (texPared) return;
    texPared = V.texturaCanvas(256, 128, (g, w, h) => {
      g.fillStyle = '#a68a68'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 1400; i++) {           // manteado de barro irregular
        const c = 120 + Math.random() * 40 | 0;
        g.fillStyle = `rgba(${c},${c * 0.78 | 0},${c * 0.56 | 0},0.35)`;
        g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 3 + Math.random() * 7, 2 + Math.random() * 4, 0, 0, 7); g.fill();
      }
      g.strokeStyle = 'rgba(70,52,35,0.14)'; g.lineWidth = 1;   // improntas del entramado
      for (let y = 10; y < h; y += 16) { g.beginPath(); g.moveTo(0, y + Math.random() * 3); g.lineTo(w, y + Math.random() * 3); g.stroke(); }
    }, [1, 1]);
    texPared.wrapS = texPared.wrapT = THREE.RepeatWrapping;
    texPaja = V.texturaCanvas(128, 256, (g, w, h) => {
      g.fillStyle = '#a58e5c'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * w, y = Math.random() * h, l = 10 + Math.random() * 26;
        const c = 120 + Math.random() * 70 | 0;
        g.strokeStyle = `rgba(${c},${c * 0.85 | 0},${c * 0.52 | 0},0.6)`;
        g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 3, y + l); g.stroke();
      }
      g.fillStyle = 'rgba(60,45,25,0.25)';
      for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 3);       // hiladas de la cubierta
    }, [1, 1]);
    texPaja.wrapS = texPaja.wrapT = THREE.RepeatWrapping;
  }

  // Punto del contorno: theta 0 = extremo norte del eje largo; theta PI/2 = lado largo oriental
  function contorno(c, theta, margen) {
    const g = c.giro * Math.PI / 180;
    const a = c.largo / 2 + margen, b = c.ancho / 2 + margen;
    const along = a * Math.cos(theta), across = b * Math.sin(theta);
    return { x: c.x + along * Math.sin(g) + across * Math.cos(g), y: c.y + along * Math.cos(g) - across * Math.sin(g), along, across };
  }
  function ejePunto(c, along) {
    const g = c.giro * Math.PI / 180;
    return { x: c.x + along * Math.sin(g), y: c.y + along * Math.cos(g) };
  }

  function cabana(ctx, c) {
    texturas();
    const grupo = new THREE.Group();
    grupo.name = 'cabana-' + c.id;
    const nv = c.nivel === N.DOC ? null : N.HIP;     // las hipotéticas: todo nivel 3
    const n = 56;
    // Altura del suelo exterior: la más baja del contorno (para que la pared no flote)
    let hBase = Infinity;
    for (let i = 0; i < n; i++) { const p = contorno(c, i / n * Math.PI * 2, 0.1); hBase = Math.min(hBase, V.altura(p.x, p.y)); }
    const hSuelo = hBase - V.REBAJE_CABANA;
    const hAlero = hBase + ALTO_PARED;
    const hCab = hAlero + ALTO_CABALLETE;
    const medioPuerta = PUERTA / (c.largo / 2) / 2;   // semiancho angular de la puerta

    // --- Paredes de ramas manteadas con barro (deducido) ---
    const pos = [], uv = [], idx = [];
    let longitud = 0, previo = null;
    for (let i = 0; i <= n; i++) {
      const th = i / n * Math.PI * 2;
      const p = contorno(c, th, 0.1);
      if (previo) longitud += Math.hypot(p.x - previo.x, p.y - previo.y);
      previo = p;
      pos.push(p.x, hSuelo, -p.y, p.x, hAlero + 0.05, -p.y);
      uv.push(longitud / 2, 0, longitud / 2, (hAlero - hSuelo) / 1.2);
      if (i > 0) {
        const thm = (i - 0.5) / n * Math.PI * 2;
        if (Math.abs(thm - Math.PI / 2) < medioPuerta) continue;   // hueco de la puerta
        const a = (i - 1) * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const gPared = new THREE.BufferGeometry();
    gPared.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gPared.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    gPared.setIndex(idx);
    gPared.computeVertexNormals();
    const pared = new THREE.Mesh(gPared, new THREE.MeshLambertMaterial({ map: texPared, side: THREE.DoubleSide }));
    pared.castShadow = true; pared.receiveShadow = true;
    grupo.add(V.marcar(pared, nv || N.DED, 'Paredes de ramas y barro'));

    // --- Postes perimetrales y del caballete (hipótesis: no se hallaron agujeros de poste) ---
    const madera = V.mat(0x5a4330, { flatShading: true });
    const postes = [];
    for (let i = 0; i < n; i += 4) {
      const th = i / n * Math.PI * 2;
      if (Math.abs(th - Math.PI / 2) < medioPuerta + 0.05) continue;
      const p = contorno(c, th, 0.16);
      postes.push([p.x, p.y, hSuelo, hAlero + 0.12, 0.07]);
    }
    const Lr = c.largo * 0.56;
    [-Lr / 2, 0, Lr / 2].forEach(al => { const p = ejePunto(c, al); postes.push([p.x, p.y, hSuelo, hCab, 0.09]); });
    // Jambas y dintel de la puerta
    const pj1 = contorno(c, Math.PI / 2 - medioPuerta, 0.12), pj2 = contorno(c, Math.PI / 2 + medioPuerta, 0.12);
    postes.push([pj1.x, pj1.y, hSuelo, hAlero, 0.08], [pj2.x, pj2.y, hSuelo, hAlero, 0.08]);
    const gPoste = new THREE.CylinderGeometry(1, 1, 1, 6);
    const imP = new THREE.InstancedMesh(gPoste, madera, postes.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    postes.forEach((pp, i) => {
      m4.compose(p.set(pp[0], (pp[2] + pp[3]) / 2, -pp[1]), q, s.set(pp[4], pp[3] - pp[2], pp[4]));
      imP.setMatrixAt(i, m4);
    });
    imP.castShadow = true;
    grupo.add(V.marcar(imP, nv || N.HIP, 'Postes de madera'));
    // Dintel y viga del caballete
    function viga(a, b, r, etiqueta) {
      const va = new THREE.Vector3(a.x, a.h, -a.y), vb = new THREE.Vector3(b.x, b.h, -b.y);
      const l = va.distanceTo(vb);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 6), madera);
      m.position.copy(va).add(vb).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
      m.castShadow = true;
      grupo.add(V.marcar(m, nv || N.HIP, etiqueta));
    }
    viga({ x: pj1.x, y: pj1.y, h: hAlero }, { x: pj2.x, y: pj2.y, h: hAlero }, 0.07, 'Dintel de la puerta');
    const r1 = ejePunto(c, -Lr / 2 - 0.3), r2 = ejePunto(c, Lr / 2 + 0.3);
    viga({ x: r1.x, y: r1.y, h: hCab + 0.05 }, { x: r2.x, y: r2.y, h: hCab + 0.05 }, 0.09, 'Viga del caballete');

    // --- Cubierta vegetal con caballete; los extremos curvos forman faldones (hipótesis) ---
    const rp = [], ru = [], ri = [];
    let lon = 0; previo = null;
    for (let i = 0; i <= n; i++) {
      const th = i / n * Math.PI * 2;
      const e = contorno(c, th, 0.1 + ALERO);
      const al = Math.max(-Lr / 2, Math.min(Lr / 2, e.along / (c.largo / 2 + 0.1 + ALERO) * Lr / 2 * 1.15));
      const k = ejePunto(c, al);
      if (previo) lon += Math.hypot(e.x - previo.x, e.y - previo.y);
      previo = e;
      rp.push(e.x, hAlero - 0.12, -e.y, k.x, hCab + 0.12, -k.y);
      ru.push(lon / 1.5, 0, lon / 1.5, 2.2);
      if (i > 0) { const a = (i - 1) * 2; ri.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const gTecho = new THREE.BufferGeometry();
    gTecho.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
    gTecho.setAttribute('uv', new THREE.Float32BufferAttribute(ru, 2));
    gTecho.setIndex(ri);
    gTecho.computeVertexNormals();
    const techo = new THREE.Mesh(gTecho, new THREE.MeshLambertMaterial({ map: texPaja, side: THREE.DoubleSide }));
    techo.castShadow = true; techo.receiveShadow = true;
    techo.name = 'techo-' + c.id;
    grupo.add(V.marcar(techo, nv || N.HIP, 'Cubierta vegetal'));
    ctx.techos = (ctx.techos || []).concat(techo);

    ctx.scene.add(grupo);
    const puerta = contorno(c, Math.PI / 2, 1.2);
    ctx.cabanas = (ctx.cabanas || []).concat({ id: c.id, c, hSuelo, hBase, puerta, grupo });
  }

  V.construirCabanas = function (ctx) {
    for (const c of V.plano.cabanas) cabana(ctx, c);
  };
})(window.VALDE);
