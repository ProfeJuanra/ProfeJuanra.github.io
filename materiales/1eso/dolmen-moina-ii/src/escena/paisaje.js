// Paisaje: relieve, berrocal de granito, vegetación (entonces y hoy), sierras del horizonte y valla de la excavación.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const CERCA = 62;        // medio lado de la malla de detalle (m)

  function malla(x0, x1, y0, y1, paso, saltar) {
    const nx = Math.round((x1 - x0) / paso), ny = Math.round((y1 - y0) / paso);
    const pos = new Float32Array((nx + 1) * (ny + 1) * 3);
    const col = new Float32Array(pos.length);
    const xy = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const x = x0 + i * paso, y = y0 + j * paso, k = (j * (nx + 1) + i);
      pos[k * 3] = x; pos[k * 3 + 1] = V.alturaNatural(x, y); pos[k * 3 + 2] = -y;
      xy.push(x, y);
    }
    const idx = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
      if (saltar && saltar(x0 + (i + 0.5) * paso, y0 + (j + 0.5) * paso)) continue;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    g.userData.xy = xy;
    return g;
  }

  // Color del suelo: hierba verde con claros de tierra (entonces) o pasto agostado (hoy)
  const c = new THREE.Color(), c2 = new THREE.Color();
  function colorSuelo(x, y, hoy) {
    const r = Math.hypot(x, y);
    const n = V.fbm(x / 9, y / 9), m = V.fbm(x / 2.5 + 7, y / 2.5);
    if (hoy) {
      c.setRGB(0.74, 0.64, 0.4).lerp(c2.setRGB(0.58, 0.52, 0.34), 0.5 + 0.5 * n);
      if (r < 21) c.lerp(c2.setRGB(0.66, 0.56, 0.42), 0.6 * (1 - V.paso(17, 21, r)));   // tierra pisada de la excavación
    } else {
      c.setRGB(0.42, 0.5, 0.25).lerp(c2.setRGB(0.55, 0.55, 0.3), 0.5 + 0.5 * n);
      if (r < 24) c.lerp(c2.setRGB(0.55, 0.47, 0.34), 0.55 * (1 - V.paso(14, 24, r)));   // explanada desbrozada y pisada
    }
    c.multiplyScalar(0.92 + 0.12 * m);
    return c.convertSRGBToLinear();
  }
  function pintar(g, hoy) {
    const xy = g.userData.xy, col = g.attributes.color.array;
    for (let k = 0; k < xy.length / 2; k++) {
      colorSuelo(xy[k * 2], xy[k * 2 + 1], hoy);
      col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
    }
    g.attributes.color.needsUpdate = true;
  }

  V.construirPaisaje = function (ctx) {
    const { scene } = ctx;
    const r = V.semilla(4401);
    const baja = ctx.calidad === 'baja';

    // --- Relieve ---
    const gCerca = malla(-CERCA, CERCA, -CERCA, CERCA, baja ? 1.2 : 0.8);
    const gLejos = malla(-900, 900, -900, 900, baja ? 24 : 16, (x, y) => Math.abs(x) < CERCA - 1 && Math.abs(y) < CERCA - 1);
    const matSuelo = new THREE.MeshLambertMaterial({ vertexColors: true });
    const cerca = new THREE.Mesh(gCerca, matSuelo), lejos = new THREE.Mesh(gLejos, matSuelo);
    cerca.name = 'relieve-cercano'; lejos.name = 'relieve-general';
    cerca.receiveShadow = true; lejos.receiveShadow = true;
    scene.add(V.marcar(cerca, N.HIP, 'Relieve cercano (forma aproximada)'), V.marcar(lejos, N.HIP, 'Relieve de La Vera (esquemático)'));

    // --- Berrocal: bolos de granito, típicos del batolito [DED] ---
    const gP = V.geoPiedra(3, 1);
    const bolos = [];
    for (let i = 0; i < 900 && bolos.length < (baja ? 70 : 140); i++) {
      const a = r() * Math.PI * 2, d = 26 + Math.pow(r(), 0.7) * 260;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (V.fbm(x / 45, y / 45) < 0.05) continue;              // agrupados en manchas
      bolos.push([x, y, 0.6 + r() * 2.4 * (r() < 0.15 ? 2 : 1), r() * 6]);
    }
    // una lancha de granito aflorando junto al dolmen: posible cantera de las losas [DED]
    for (let i = 0; i < 9; i++) bolos.push([-17 + r() * 7, 13 + r() * 6, 0.5 + r() * 1.1, r() * 6, true]);
    const imB = new THREE.InstancedMesh(gP, new THREE.MeshLambertMaterial({ map: V.texGranito() }), bolos.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), e = new THREE.Euler();
    bolos.forEach(([x, y, k, g, plana], i) => {
      q.setFromEuler(e.set(0, g, 0));
      m4.compose(p.set(x, V.alturaNatural(x, y) + (plana ? 0.05 : 0.25 * k), -y), q, plana ? s.set(k * 1.6, k * 0.35, k * 1.2) : s.set(k, k * 0.9, k * 0.85));
      imB.setMatrixAt(i, m4);
    });
    imB.castShadow = !baja; imB.receiveShadow = true;
    scene.add(V.marcar(imB, N.DED, 'Bolos y lanchas de granito'));

    // --- Árboles: robles melojos y encinas ---
    function arbolGeo(tipo) {
      const copa = tipo === 'roble' ? new THREE.IcosahedronGeometry(1, 1) : new THREE.DodecahedronGeometry(1, 0);
      const p_ = copa.attributes.position;
      for (let i = 0; i < p_.count; i++) {
        const x = p_.getX(i), y = p_.getY(i), z = p_.getZ(i), k = 1 + 0.22 * V.fbm(x * 2 + 1, z * 2 + y);
        p_.setXYZ(i, x * k, y * k, z * k);
      }
      copa.computeVertexNormals();
      return copa;
    }
    const gTronco = new THREE.CylinderGeometry(0.18, 0.32, 1, 6); gTronco.translate(0, 0.5, 0);
    function bosque(lista, nombre, nivel) {
      const grupo = new THREE.Group(); grupo.name = nombre;
      const tipos = { roble: [arbolGeo('roble'), 0x5f7a38], encina: [arbolGeo('encina'), 0x4b5f33] };
      for (const t in tipos) {
        const de = lista.filter(a => a.t === t);
        if (!de.length) continue;
        const copa = new THREE.InstancedMesh(tipos[t][0], V.mat(0xffffff), de.length);
        const tronco = new THREE.InstancedMesh(gTronco, V.mat(0x5a4836), de.length);
        const col = new THREE.Color();
        de.forEach((a, i) => {
          const h = V.alturaNatural(a.x, a.y), alto = a.k * (t === 'roble' ? 3.4 : 2.4);
          m4.compose(p.set(a.x, h - 0.1, -a.y), q.identity(), s.set(a.k, alto, a.k)); tronco.setMatrixAt(i, m4);
          const ancho = a.k * (t === 'roble' ? 2.6 : 3.2);
          m4.compose(p.set(a.x, h + alto + ancho * 0.45, -a.y), q.identity(), s.set(ancho, ancho * (t === 'roble' ? 1.05 : 0.7), ancho)); copa.setMatrixAt(i, m4);
          copa.setColorAt(i, col.set(tipos[t][1]).multiplyScalar(0.85 + 0.3 * V.fbm(a.x, a.y)));
        });
        [copa, tronco].forEach(o => { o.castShadow = !baja; o.receiveShadow = true; grupo.add(o); });
      }
      scene.add(V.marcar(grupo, nivel, nombre === 'bosque-entonces' ? 'Robledal y encinar (vegetación probable de la época)' : 'Árboles dispersos actuales'));
      return grupo;
    }
    const entonces = [], hoy = [];
    for (let i = 0; i < 4000 && entonces.length < (baja ? 260 : 520); i++) {
      const x = (r() - 0.5) * 520, y = (r() - 0.5) * 520, d = Math.hypot(x, y);
      if (d < 30 || (d < 55 && r() < 0.6)) continue;          // claro alrededor del monumento
      entonces.push({ x, y, k: 0.75 + r() * 0.6, t: y > -20 && r() < 0.65 ? 'roble' : 'encina' });
    }
    for (let i = 0; i < 2000 && hoy.length < 46; i++) {
      const x = (r() - 0.5) * 600, y = (r() - 0.5) * 600, d = Math.hypot(x, y);
      if (d < 45 || V.fbm(x / 70, y / 70) < 0.15) continue;
      hoy.push({ x, y, k: 0.7 + r() * 0.5, t: r() < 0.7 ? 'encina' : 'roble' });
    }
    const bEntonces = bosque(entonces, 'bosque-entonces', N.DED);
    const bHoy = bosque(hoy, 'bosque-hoy', N.DOC);

    // --- Valla de la excavación (hoy), como en las fotografías del informe [DOC] ---
    const valla = new THREE.Group(); valla.name = 'valla';
    const gPoste = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 5); gPoste.translate(0, 0.65, 0);
    const pts = [];
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * Math.PI * 2;
      pts.push([Math.cos(a) * 21.5 + 2.6, Math.sin(a) * 19 - 1.5]);
    }
    const imP = new THREE.InstancedMesh(gPoste, V.mat(0x8a8d90), pts.length);
    pts.forEach(([x, y], i) => { m4.compose(p.set(x, V.alturaNatural(x, y), -y), q.identity(), s.set(1, 1, 1)); imP.setMatrixAt(i, m4); });
    valla.add(imP);
    const malla_ = [];
    for (const hh of [0.35, 0.75, 1.15]) for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
      malla_.push(x0, V.alturaNatural(x0, y0) + hh, -y0, x1, V.alturaNatural(x1, y1) + hh, -y1);
    }
    const gM = new THREE.BufferGeometry(); gM.setAttribute('position', new THREE.Float32BufferAttribute(malla_, 3));
    valla.add(new THREE.LineSegments(gM, new THREE.LineBasicMaterial({ color: 0x6f7377 })));
    scene.add(V.marcar(valla, N.DOC, 'Valla de protección de la excavación'));

    // --- Horizonte: Gredos muy cerca al norte; el valle del Tiétar y sierras bajas al sur [DOC, geografía] ---
    const R = 5200, n = 220, pos = [], col = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const norte = Math.cos(a), sur = -Math.cos(a);
      let h = 30 + 20 * V.fbm(i / 6, 2);
      h += Math.max(0, norte) ** 1.5 * (520 + 220 * V.fbm(i / 3.5, 7));     // sierra de Gredos (Almanzor, ~2.590 m)
      h += Math.max(0, sur) ** 3 * (70 + 40 * V.fbm(i / 5, 11));            // sierras al sur del Tiétar
      const x = Math.sin(a) * R, z = -Math.cos(a) * R;
      pos.push(x, -40, z, x, h, z);
      const tono = norte > 0.3 ? [0.52, 0.57, 0.66] : [0.62, 0.64, 0.66];
      col.push(...tono, ...tono.map(v => v * 0.9));
    }
    const idx = [];
    for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const gS = new THREE.BufferGeometry();
    gS.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gS.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    gS.setIndex(idx);
    const sierras = new THREE.Mesh(gS, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide }));
    sierras.name = 'sierras';
    scene.add(V.marcar(sierras, N.DOC, 'Sierra de Gredos al norte'));
    ctx.sierras = sierras;
    const anillo = new THREE.RingGeometry(880, R, 64, 1); anillo.rotateX(-Math.PI / 2); anillo.translate(0, -14, 0);
    const llano = new THREE.Mesh(anillo, new THREE.MeshBasicMaterial({ color: 0x7f8456 }));
    llano.name = 'llanura-lejana';
    scene.add(V.marcar(llano, N.HIP, 'Valle del Tiétar (esquemático)'));

    ctx.paisaje = {
      fijarMomento(m) {
        const esHoy = m === 'hoy';
        pintar(gCerca, esHoy); pintar(gLejos, esHoy);
        bEntonces.visible = !esHoy; bHoy.visible = esHoy; valla.visible = esHoy;
        llano.material.color.set(esHoy ? 0x9c9161 : 0x6f7d4c);
      },
    };
  };
})(window.MOINA);
