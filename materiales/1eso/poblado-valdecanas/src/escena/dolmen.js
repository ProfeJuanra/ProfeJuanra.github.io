// Dolmen de Guadalperal, a unos 2,5 km al oeste-suroeste del centro de la isla (OpenStreetMap; aproximado).
// Documentado (BOE, RD 371/2022; Leisner y Leisner 1960, vía Wikipedia):
//   cámara de unos 5 m de diámetro con 12-13 losas de granito; corredor de casi 10 m × 1,50 m;
//   triple línea de ortostatos concéntricos; menhir decorado de unos 2 m a la entrada de la cámara;
//   túmulo de bolos de piedra (vaciado por Obermaier en 1925-1927).
// Hipótesis: orientación del corredor (este), tamaño del túmulo, cubierta de la cámara y del corredor.
// El túmulo se muestra con un corte didáctico para ver el interior.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  // Posición en coordenadas del plano (m): ~2,5 km al oeste y ~0,6 km al sur [VERIFICAR]
  V.DOLMEN = { x: -2500, y: -600 };
  const R_TUM = 12.5, H_TUM = 3.2;   // túmulo: hipótesis

  let texGranito, texTumulo, texMenhir;
  function texturas() {
    if (texGranito) return;
    texGranito = V.texturaCanvas(128, 128, (g, w, h) => {
      g.fillStyle = '#a39d92'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 2200; i++) {
        const c = Math.random();
        g.fillStyle = c < 0.5 ? 'rgba(60,58,55,0.55)' : c < 0.8 ? 'rgba(220,214,204,0.6)' : 'rgba(140,110,85,0.5)';
        g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }
    }, [1, 1]);
    texGranito.wrapS = texGranito.wrapT = THREE.RepeatWrapping;
    texTumulo = V.texturaCanvas(256, 256, (g, w, h) => {          // tierra con bolos de cuarcita
      g.fillStyle = '#8a7656'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 520; i++) {
        const x = Math.random() * w, y = Math.random() * h, r = 3 + Math.random() * 7;
        const c = 170 + Math.random() * 50 | 0;
        g.fillStyle = `rgb(${c},${c - 8},${c - 22})`;
        g.beginPath(); g.ellipse(x, y, r, r * 0.75, Math.random() * 3, 0, 7); g.fill();
        g.fillStyle = 'rgba(40,30,20,0.25)';
        g.beginPath(); g.ellipse(x + 1.5, y + 2, r, r * 0.4, 0, 0, Math.PI); g.fill();
      }
    }, [4, 4]);
    texTumulo.wrapS = texTumulo.wrapT = THREE.RepeatWrapping;
    texMenhir = V.texturaCanvas(128, 256, (g, w, h) => {            // grabado: línea ondulada (motivo esquemático)
      g.drawImage(texGranito.image, 0, 0, w, h / 2); g.drawImage(texGranito.image, 0, h / 2, w, h / 2);
      g.strokeStyle = 'rgba(45,40,36,0.7)'; g.lineWidth = 4; g.beginPath();
      for (let y = 30; y < h - 30; y += 4) g.lineTo(w / 2 + 26 * Math.sin(y / 18), y);
      g.stroke();
      g.fillStyle = 'rgba(45,40,36,0.7)';
      for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(30 + (i % 2) * 70, 50 + i * 30, 5, 0, 7); g.fill(); }
    });
  }

  // Losa irregular de granito
  function losa(ancho, alto, grueso, semilla) {
    const g = new THREE.BoxGeometry(ancho, alto, grueso, 2, 3, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const k = V.fbm(x * 2 + semilla, y * 2 - semilla) * 0.12;
      const estrecha = 1 - 0.25 * Math.max(0, y / (alto / 2));          // más estrecha arriba
      p.setXYZ(i, x * estrecha + k, y + (y > 0 ? V.fbm(x * 3, semilla) * 0.18 : 0), z * (1 + k));
    }
    g.computeVertexNormals();
    g.translate(0, alto / 2, 0);
    return g;
  }

  function alturaLocal(lx, ly) {   // relieve suave alrededor del dolmen, junto al antiguo cauce del Tajo (al sur)
    const r = Math.hypot(lx, ly);
    let h = -12 + 0.6 * V.fbm(lx / 30, ly / 30) + 1.2 * (1 - V.paso(0, 60, r));
    h -= 3 * (1 - V.paso(16, 30, Math.abs(ly + 75 + 6 * Math.sin(lx / 25))));   // cauce
    return h * V.paso(150, 110, r) + -12 * (1 - V.paso(150, 110, r));
  }

  V.construirDolmen = function (ctx) {
    texturas();
    const D = V.DOLMEN;
    const grupo = new THREE.Group();
    grupo.name = 'dolmen-guadalperal';
    const h0 = alturaLocal(0, 0);
    grupo.position.set(D.x, h0, -D.y);
    ctx.scene.add(grupo);
    V.alturaDolmen = h0;
    const r = V.azar;
    const matGranito = new THREE.MeshLambertMaterial({ map: texGranito });

    // --- Terreno local con el antiguo cauce del Tajo ---
    const N_ = 70, L = 300;
    const gT = new THREE.PlaneGeometry(L, L, N_, N_); gT.rotateX(-Math.PI / 2);
    const pt = gT.attributes.position, ct = new Float32Array(pt.count * 3), c = new THREE.Color();
    for (let i = 0; i < pt.count; i++) {
      const lx = pt.getX(i), ly = -pt.getZ(i);
      pt.setY(i, alturaLocal(lx, ly) - h0);
      const cauce = 1 - V.paso(18, 34, Math.abs(ly + 75 + 6 * Math.sin(lx / 25)));
      c.setRGB(0.6 - 0.15 * cauce, 0.56 - 0.05 * cauce, 0.34 - 0.04 * cauce).multiplyScalar(0.92 + 0.1 * V.fbm(lx / 8, ly / 8)).convertSRGBToLinear();
      ct[i * 3] = c.r; ct[i * 3 + 1] = c.g; ct[i * 3 + 2] = c.b;
    }
    gT.setAttribute('color', new THREE.BufferAttribute(ct, 3));
    gT.computeVertexNormals();
    const suelo = new THREE.Mesh(gT, new THREE.MeshLambertMaterial({ vertexColors: true }));
    suelo.receiveShadow = true; suelo.position.y = -0.02;
    grupo.add(V.marcar(suelo, N.HIP, 'Entorno del dolmen (esquemático)'));
    const agua = new THREE.Mesh(new THREE.PlaneGeometry(L, 26), new THREE.MeshPhongMaterial({ color: 0x5b7f86, shininess: 60, transparent: true, opacity: 0.9 }));
    agua.rotation.x = -Math.PI / 2; agua.position.set(0, -12 - h0 - 1.6, 75);
    grupo.add(V.marcar(agua, N.DED, 'Antiguo cauce del Tajo junto al dolmen'));

    // --- Cámara: 13 losas en óvalo de unos 5 m, abierta al este hacia el corredor ---
    const piedras = [];
    for (let i = 0; i < 13; i++) {
      const a = 0.42 + (i / 12) * (Math.PI * 2 - 0.84);      // hueco de la entrada en a = 0 (este)
      const x = Math.cos(a) * 2.55, z = -Math.sin(a) * 2.3;
      const m = new THREE.Mesh(losa(1.15 + r() * 0.35, 2.3 + r() * 0.6, 0.38, i), matGranito);
      m.position.set(x, -0.1, z);
      m.rotation.y = a + Math.PI / 2;
      m.rotation.x = -0.08;                                   // ligeramente inclinadas hacia dentro
      piedras.push(m);
      grupo.add(V.marcar(m, N.DOC, 'Losa de la cámara (granito)'));
    }
    // --- Corredor: casi 10 m × 1,5 m, orientado al este (orientación: hipótesis) ---
    for (let k = 0; k < 9; k++) {
      [-0.95, 0.95].forEach((z, s) => {
        const alto = 1.55 - k * 0.05 + r() * 0.2;
        const m = new THREE.Mesh(losa(1.0 + r() * 0.2, alto, 0.32, 20 + k * 2 + s), matGranito);
        m.position.set(3.1 + k * 1.1, -0.1, z);
        m.rotation.y = (r() - 0.5) * 0.08;
        m.rotation.x = z > 0 ? 0.06 : -0.06;
        grupo.add(V.marcar(m, N.DOC, 'Losa del corredor'));
      });
      if (k % 2 === 0) {                                      // dinteles de cubierta: hipótesis
        const dintel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 2.5), matGranito);
        dintel.position.set(3.3 + k * 1.1, 1.62 - k * 0.05, 0);
        dintel.rotation.y = (r() - 0.5) * 0.1;
        dintel.castShadow = true;
        grupo.add(V.marcar(dintel, N.HIP, 'Dintel del corredor'));
      }
    }
    // --- Menhir decorado de unos 2 m a la entrada de la cámara ---
    const menhir = new THREE.Mesh(losa(0.6, 2.05, 0.45, 77), new THREE.MeshLambertMaterial({ map: texMenhir }));
    menhir.position.set(2.45, -0.1, -1.25);
    menhir.rotation.y = 0.3;
    grupo.add(V.marcar(menhir, N.DOC, 'Menhir decorado (motivo del grabado esquemático)'));
    // --- Dos anillos más de ortostatos concéntricos (triple línea con la cámara) ---
    [4.1, 5.6].forEach((rad, j) => {
      const n = Math.round(rad * 2 * Math.PI / 0.95);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.3) continue;   // paso del corredor
        const m = new THREE.Mesh(losa(0.8 + r() * 0.3, 1.0 + r() * 0.5 - j * 0.15, 0.3, 100 + i + j * 50), matGranito);
        m.position.set(Math.cos(a) * rad, -0.1, -Math.sin(a) * rad);
        m.rotation.y = a + Math.PI / 2;
        grupo.add(V.marcar(m, N.DOC, 'Anillo de ortostatos'));
      }
    });
    // --- Cubierta de la cámara: gran losa (hipótesis) ---
    const tapa = new THREE.Mesh(losa(5.6, 0.45, 5.0, 300), matGranito);
    tapa.position.set(0, 2.55, 0);
    grupo.add(V.marcar(tapa, N.HIP, 'Losa de cubierta de la cámara'));

    // --- Túmulo de tierra y bolos de piedra, con corte didáctico al sureste ---
    const ABRE0 = THREE.MathUtils.degToRad(80), ABRE1 = THREE.MathUtils.degToRad(200);
    const gTum = new THREE.SphereGeometry(R_TUM, 40, 10, ABRE1, Math.PI * 2 - (ABRE1 - ABRE0), 0, Math.PI / 2);
    gTum.scale(1, H_TUM / R_TUM, 1);
    const matTum = new THREE.MeshLambertMaterial({ map: texTumulo, side: THREE.DoubleSide });
    const tum = new THREE.Mesh(gTum, matTum);
    tum.receiveShadow = true; tum.castShadow = true; tum.position.y = -0.15;
    grupo.add(V.marcar(tum, N.DOC, 'Túmulo de bolos de piedra (tamaño hipotético)'));
    // Caras del corte
    [ABRE0, ABRE1].forEach(phi => {
      const dx = -Math.cos(phi), dz = Math.sin(phi);
      const pos = [];
      const n = 16;
      for (let i = 0; i < n; i++) {
        const r0 = (i / n) * R_TUM, r1 = ((i + 1) / n) * R_TUM;
        const h0_ = H_TUM * Math.sqrt(Math.max(0, 1 - (r0 / R_TUM) ** 2)), h1 = H_TUM * Math.sqrt(Math.max(0, 1 - (r1 / R_TUM) ** 2));
        pos.push(dx * r0, 0, dz * r0, dx * r1, 0, dz * r1, dx * r0, h0_, dz * r0);
        pos.push(dx * r1, 0, dz * r1, dx * r1, h1, dz * r1, dx * r0, h0_, dz * r0);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      const cara = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: 0x7a6548, side: THREE.DoubleSide }));
      cara.position.y = -0.15;
      grupo.add(V.marcar(cara, N.HIP, 'Corte didáctico del túmulo'));
    });
    grupo.traverse(o => { if (o.isMesh && o !== suelo && o !== agua) { o.castShadow = true; o.receiveShadow = true; } });

    // --- Encinas y ribera alrededor ---
    const gC = new THREE.IcosahedronGeometry(1, 1), gTr = new THREE.CylinderGeometry(0.22, 0.3, 2, 6);
    gTr.translate(0, 1, 0);
    const pts = [];
    for (let i = 0; i < 160 && pts.length < 70; i++) {
      const lx = (r() - 0.5) * 280, ly = (r() - 0.5) * 280;
      const rr = Math.hypot(lx, ly);
      if (rr < 24 || Math.abs(ly + 75) < 16) continue;
      pts.push([lx, ly, 0.8 + r() * 0.5, Math.abs(ly + 75) < 40]);
    }
    const imC = new THREE.InstancedMesh(gC, V.mat(0xffffff), pts.length), imT = new THREE.InstancedMesh(gTr, V.mat(0x6a5642), pts.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
    pts.forEach(([lx, ly, k, rib], i) => {
      const hy = alturaLocal(lx, ly) - h0;
      m4.compose(p.set(lx, hy, -ly), q, s.setScalar(k)); imT.setMatrixAt(i, m4);
      m4.compose(p.set(lx, hy + 2 * k + 1.6 * k, -ly), q, rib ? s.set(2.2 * k, 3.6 * k, 2.2 * k) : s.set(3.2 * k, 2.3 * k, 3.2 * k)); imC.setMatrixAt(i, m4);
      imC.setColorAt(i, col.set(rib ? 0x7f9a4c : 0x66773f));
    });
    [imC, imT].forEach(m => { m.castShadow = true; grupo.add(V.marcar(m, N.DED, 'Encinar y ribera junto al dolmen')); });
    ctx.dolmen = grupo;
  };
})(window.VALDE);
