// Fase d: vida cotidiana. Figuras humanas (escenografía: NO es una estimación de población),
// animales documentados (vacas, ovejas) y deducidos (cabras, cerdos, perro), y objetos documentados.
// Excluidos: caballo, gallina, gato y cualquier objeto de metal.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const D2R = Math.PI / 180;

  function cil(r1, r2, h, color, seg) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 6), V.mat(color, { flatShading: true }));
    m.castShadow = true;
    return m;
  }
  function caja(x, y, z, color) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), V.mat(color, { flatShading: true }));
    m.castShadow = true;
    return m;
  }
  function bola(r, color, det) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, det || 1), V.mat(color, { flatShading: true }));
    m.castShadow = true;
    return m;
  }

  // Coloca un objeto sobre el suelo en coordenadas del plano, mirando hacia (tx, ty)
  function situar(obj, x, y, tx, ty, dy) {
    obj.position.set(x, V.alturaSitioOGeneral(x, y) + (dy || 0), -y);
    if (tx !== undefined) obj.rotation.y = Math.atan2(tx - x, -(ty - y)) ;
    return obj;
  }

  // ---------- Personas ----------
  // Figuras con volumen y articulaciones (hombro, codo, cadera, rodilla). Ropa de lana y lino
  // sin teñir (deducido: hay pesas de telar y ovejas). Sin pieles ni adornos de metal.
  const PIELES = [0xb7865f, 0xa5764f, 0x93633f, 0xbf9068, 0xab7b55];
  const ROPAS = [0x8c7a5e, 0xb8a888, 0x6e5f4a, 0x9a8c74, 0xd0c4a4, 0x7b6a55, 0xa59479];
  const PELOS = [0x2b2018, 0x3a2a1c, 0x1f1a16, 0x4a3524, 0x2f241b];

  const matCache = {};
  function matPersona(clave, crear) { return matCache[clave] || (matCache[clave] = crear()); }
  let texTela;
  function texturaTela() {
    if (texTela) return texTela;
    texTela = V.texturaCanvas(64, 64, (g, w, h) => {      // tejido: trama y urdimbre
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.06})`; g.fillRect(0, y, w, 1); }
      for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.05})`; g.fillRect(x, 0, 1, h); }
      for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(Math.random() * w, Math.random() * h, 3, 1); }
    }, [3, 3]);
    texTela.wrapS = texTela.wrapT = THREE.RepeatWrapping;
    return texTela;
  }
  let texPelo, texPiel;
  function texturasCuerpo() {
    if (texPelo) return;
    texPelo = V.texturaCanvas(64, 128, (g, w, h) => {      // mechones
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        const x = Math.random() * w, v = 120 + Math.random() * 135 | 0;
        g.strokeStyle = `rgb(${v},${v},${v})`; g.lineWidth = 1 + Math.random();
        g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 4, h * 0.3, x - 4, h * 0.6, x + (Math.random() - 0.5) * 8, h); g.stroke();
      }
    }, [3, 1]);
    texPelo.wrapS = texPelo.wrapT = THREE.RepeatWrapping;
    texPiel = V.texturaCanvas(64, 64, (g, w, h) => {       // ligera variación de la piel (evita el aspecto de plástico)
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 500; i++) { const v = 236 + Math.random() * 19 | 0; g.fillStyle = `rgb(${v},${v * 0.97 | 0},${v * 0.95 | 0})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    }, [2, 2]);
    texPiel.wrapS = texPiel.wrapT = THREE.RepeatWrapping;
  }
  const mPiel = c => matPersona('p' + c, () => { texturasCuerpo(); return new THREE.MeshStandardMaterial({ color: c, roughness: 0.68, map: texPiel }); });
  const mRopa = c => matPersona('r' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, map: texturaTela() }));
  const mPelo = c => matPersona('h' + c, () => { texturasCuerpo(); return new THREE.MeshStandardMaterial({ color: new THREE.Color(c).multiplyScalar(1.5), roughness: 0.6, map: texPelo }); });
  const mCuero = () => matPersona('cuero', () => new THREE.MeshStandardMaterial({ color: 0x4a3423, roughness: 0.8 }));
  const mOjo = () => matPersona('ojo', () => new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.3 }));

  // Cápsula que cuelga del origen hacia -Y (brazos, piernas)
  function capsula(r0, r1, largo, mat) {
    const pts = [];
    for (let a = 0; a <= 4; a++) { const t = a / 4 * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0.001, Math.sin(t) * r1), -largo + r1 - Math.cos(t) * r1)); }
    for (let a = 4; a >= 0; a--) { const t = a / 4 * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0.001, Math.sin(t) * r0), -r0 + Math.cos(t) * r0)); }
    const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 9), mat);
    m.castShadow = true;
    return m;
  }
  function perfil(puntos, mat, seg) {
    const m = new THREE.Mesh(new THREE.LatheGeometry(puntos.map(([r, y]) => new THREE.Vector2(r, y)), seg || 12), mat);
    m.castShadow = true;
    return m;
  }

  // Medidas de la cabeza del cuerpo base (para ajustar pelo y barba)
  let MED = null;
  function medidas() {
    if (MED) return MED;
    const C = V.cuerpo, hb = C.huesos, cab = hb.find(h => h.n === 'head').p;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (let i = 0; i < C.zona.length; i++) {
      if (C.zona[i] !== 0) continue;
      const x = C.pos[i * 3], y = C.pos[i * 3 + 1], z = C.pos[i * 3 + 2];
      if (y < cab[1] - 0.02) continue;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z);
    }
    const g = (n) => hb.find(h => h.n === n).p;
    // Mentón: el punto más bajo de la cara, en la línea central y por delante
    let menton = 1e9, frente = -1e9;
    for (let i = 0; i < C.zona.length; i++) {
      const x = C.pos[i * 3], y = C.pos[i * 3 + 1], z = C.pos[i * 3 + 2];
      if (C.zona[i] === 0 && Math.abs(x) < 0.015 && z > cab[2] + 0.05) { menton = Math.min(menton, y); frente = Math.max(frente, z); }
    }
    MED = {
      menton: menton - cab[1], frenteZ: frente - cab[2],
      cab, alto: y1,
      centro: [(x0 + x1) / 2 - cab[0], (y0 + y1) / 2 - cab[1] + 0.02, (z0 + z1) / 2 - cab[2]],
      radio: [(x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2],
      cintura: g('spine_01')[1], pelvis: g('pelvis'), muslo: g('thigh_l')[1],
    };
    return MED;
  }

  // Persona de unos 1,6 m mirando hacia +Z local. Cuerpo base de MakeHuman (CC0) con esqueleto.
  function persona(alto, i, opciones) {
    const o = opciones || {};
    const M = medidas();
    const k = alto / M.alto;
    const estilo = o.estilo || 'tunica';   // tunica | sinMangas | faldellin (torso descubierto)
    const colPiel = PIELES[i % PIELES.length], colRopa = o.color || ROPAS[i % ROPAS.length];
    const colPelo = o.canas ? 0x8a847c : PELOS[i % PELOS.length];
    const raiz = new THREE.Group();
    const cuerpo = new THREE.Group(); cuerpo.scale.setScalar(k); raiz.add(cuerpo);
    const malla = V.crearCuerpo({
      piel: colPiel, ropa: colRopa, calzado: !o.descalzo,
      vestido: { tronco: estilo !== 'faldellin', brazo: estilo === 'tunica' ? (o.mangaLarga ? 1 : 0.45) : 0, muslo: estilo === 'faldellin' ? 0.25 : 0.5 },
    });
    cuerpo.add(malla);
    const H = malla.userData.huesos, a = malla.userData.angA;
    H.upperarm_l.rotation.z = -a; H.upperarm_r.rotation.z = a;   // brazos junto al cuerpo
    H.thigh_l.rotation.z = 0.05; H.thigh_r.rotation.z = -0.05;   // piernas algo más juntas
    if (o.nino) H.head.scale.setScalar(1.14);                    // cabeza proporcionalmente mayor
    const ropa = mRopa(colRopa), pelo = mPelo(colPelo);
    // Falda de la túnica o faldellín: cuelga de la pelvis, siempre vertical
    const pel = H.pelvis, base = M.pelvis;
    const yCint = M.cintura - base[1] + 0.03;
    const largo = estilo === 'faldellin' ? 0.3 : (o.tunicaLarga ? 0.72 : 0.5);
    const falda = perfil([[0.145, yCint], [0.17, yCint - 0.1], [0.19, yCint - 0.25], [0.22, yCint - largo + 0.02], [0.225, yCint - largo]], ropa, 18);
    const pf = falda.geometry.attributes.position;
    for (let v = 0; v < pf.count; v++) {
      if (pf.getY(v) < yCint - largo + 0.03) pf.setY(v, pf.getY(v) + 0.035 * Math.abs(Math.sin(v * 2.3 + i)) - 0.01);   // bajo gastado
      pf.setZ(v, pf.getZ(v) * 0.82 + 0.01);                                                                       // sección ovalada
    }
    falda.geometry.computeVertexNormals();
    falda.material = falda.material.clone(); falda.material.side = THREE.DoubleSide;
    pel.add(falda);
    const cinto = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.014, 5, 18), mCuero());
    cinto.rotation.x = Math.PI / 2; cinto.scale.set(1, 0.84, 1); cinto.position.set(0, yCint - 0.01, 0.01); pel.add(cinto);
    // Pelo, sujeto al hueso de la cabeza
    const cab = H.head, c = M.centro, r = M.radio;
    const gCab = new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.56);
    const pc = gCab.attributes.position;
    for (let v = 0; v < pc.count; v++) {
      const x = pc.getX(v), y = pc.getY(v), z = pc.getZ(v);
      pc.setXYZ(v, x * (1 + 0.04 * Math.sin(i + x * 9)), y + 0.05 * Math.sin(x * 14 + i) * (z > 0 ? 1 : 0.3), z);
    }
    gCab.computeVertexNormals();
    const cabello = new THREE.Mesh(gCab, pelo);
    cabello.scale.set(r[0] * 1.16, r[1] * 1.08, r[2] * 1.16);
    cabello.position.set(c[0], c[1] + r[1] * 0.16, c[2] - r[2] * 0.05);
    cabello.rotation.x = -0.25;   // el flequillo queda en la frente, por encima de los ojos
    cabello.castShadow = true; cab.add(cabello);
    if (o.peloLargo) {
      const melena = perfil([[0.001, 0.02], [r[0] * 0.95, 0.0], [r[0] * 0.9, -0.16], [r[0] * 0.55, -0.32], [0.001, -0.36]], pelo, 12);
      melena.scale.set(1.05, 1, 0.5); melena.position.set(c[0], c[1] + r[1] * 0.35, c[2] - r[2] * 0.55); cab.add(melena);
    }
    if (o.recogido) {
      const mono = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), pelo);
      mono.position.set(c[0], c[1] + r[1] * 0.1, c[2] - r[2] * 1.05); cab.add(mono);
    }
    if (o.barba) {
      // Barba: casquete inferior y delantero, apoyado en el mentón
      const rb = r[0] * 0.92;
      const barba = new THREE.Mesh(new THREE.SphereGeometry(rb, 14, 8, Math.PI * 0.1, Math.PI * 0.8, Math.PI * 0.42, Math.PI * 0.42), pelo);
      barba.scale.set(1.02, 1.0, 1.12);
      barba.position.set(c[0], M.menton + rb * 1.02, c[2] + r[2] * 0.16); cab.add(barba);
    }
    raiz.userData.art = {
      cuerpo, k, H,
      tronco: H.spine_02, cabeza: H.head,
      brazos: [H.upperarm_l, H.upperarm_r], codos: [H.lowerarm_l, H.lowerarm_r], manos: [H.hand_l, H.hand_r],
      piernas: [H.thigh_l, H.thigh_r], rodillas: [H.calf_l, H.calf_r],
      cabezaArriba: new THREE.Vector3(c[0], c[1] + r[1] * 1.1, c[2]),
    };
    return raiz;
  }

  // Posturas (grados). Brazos y muslos: negativo = hacia delante. Codos: negativo = flexión.
  // Rodillas: positivo = flexión. bajar: descenso de la cadera (m).
  const POSTURAS = {
    pie: { tronco: 0, brazos: [4, -4], codos: [-10, -10], piernas: [0, 0], rodillas: [3, 3], bajar: 0 },
    moler: { tronco: 42, brazos: [-58, -58], codos: [-25, -25], piernas: [-8, -8], rodillas: [98, 98], bajar: 0.49 },   // de rodillas
    sentado: { tronco: 18, brazos: [-50, -30], codos: [-55, -60], piernas: [-125, -112], rodillas: [108, 98], bajar: 0.8 },
    tejer: { tronco: 0, brazos: [-95, -85], codos: [-45, -40], piernas: [0, 6], rodillas: [4, 6], bajar: 0 },
    segar: { tronco: 58, brazos: [-75, -45], codos: [-20, -45], piernas: [-22, 12], rodillas: [28, 12], bajar: 0.07 },
    vara: { tronco: 4, brazos: [-18, 6], codos: [-62, -12], piernas: [4, -6], rodillas: [4, 6], bajar: 0 },
    agachado: { tronco: 48, brazos: [-70, -60], codos: [-30, -35], piernas: [-100, -95], rodillas: [122, 118], bajar: 0.5 },
    hachar: { tronco: 12, brazos: [-150, -140], codos: [-20, -25], piernas: [-14, 12], rodillas: [14, 6], bajar: 0.02 },
    cargar: { tronco: 0, brazos: [-165, -165], codos: [-55, -55], piernas: [8, -8], rodillas: [5, 10], bajar: 0 },   // cesta sobre la cabeza
  };
  function posar(p, nombre) {
    const a = p.userData.art, s = POSTURAS[nombre], H = a.H;
    const t = s.tronco * D2R;                     // la inclinación se reparte por la columna
    H.spine_01.rotation.x = t * 0.4; H.spine_02.rotation.x = t * 0.35; H.spine_03.rotation.x = t * 0.25;
    H.head.rotation.x = -Math.min(35, s.tronco * 0.5) * D2R;
    for (let i = 0; i < 2; i++) {
      a.brazos[i].rotation.x = s.brazos[i] * D2R;
      a.codos[i].rotation.x = s.codos[i] * D2R;
      a.piernas[i].rotation.x = s.piernas[i] * D2R;
      a.rodillas[i].rotation.x = s.rodillas[i] * D2R;
    }
    a.cuerpo.position.y = -s.bajar * a.k;
    p.userData.postura = nombre;
  }

  // ---------- Objetos documentados ----------
  function molino() {   // molino de mano de granito con moleta de cuarcita
    const g = new THREE.Group();
    const base = caja(0.55, 0.12, 0.32, 0x9a958c); base.position.y = 0.06; g.add(base);
    const moleta = bola(0.09, 0xcbbfa6, 0); moleta.scale.set(1.6, 0.6, 1); moleta.position.set(0, 0.16, 0); g.add(moleta);
    g.userData.moleta = moleta;
    return g;
  }
  // Cerámica a mano: cuenco, plato, olla, vaso. Colores de cocción oxidante, reductora y almagra.
  const COLORES_CER = [0x8a5a3a, 0x9c6b45, 0x7a4a30, 0x2e2a28, 0x4a4542, 0x9b3b26];
  function vasija(tipo, color) {
    const perfiles = {
      cuenco: [[0.02, 0], [0.09, 0.02], [0.12, 0.07], [0.13, 0.09]],
      plato: [[0.02, 0], [0.13, 0.02], [0.17, 0.04]],
      olla: [[0.03, 0], [0.12, 0.05], [0.15, 0.14], [0.12, 0.23], [0.11, 0.26]],
      vaso: [[0.03, 0], [0.06, 0.02], [0.07, 0.12], [0.075, 0.16]],
    };
    const pts = perfiles[tipo].map(([r, y]) => new THREE.Vector2(r, y));
    const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 12), V.mat(color, { side: THREE.DoubleSide, flatShading: true }));
    m.castShadow = true;
    return m;
  }
  function hoz() {      // mango de madera con dientes de sílex (láminas documentadas; mango deducido)
    const g = new THREE.Group();
    const mango = cil(0.018, 0.018, 0.45, 0x6b4f33); mango.rotation.z = Math.PI / 2; g.add(mango);
    for (let i = 0; i < 4; i++) { const d = caja(0.05, 0.012, 0.02, 0xd9d2c3); d.position.set(0.05 + i * 0.045, -0.025, 0); g.add(d); }
    return g;
  }
  function hacha() {    // hacha pulimentada de gabro enmangada en madera
    const g = new THREE.Group();
    const mango = cil(0.02, 0.022, 0.6, 0x6b4f33); mango.position.y = 0.3; g.add(mango);
    const hoja = caja(0.05, 0.13, 0.08, 0x3d4441); hoja.position.set(0, 0.55, 0.06); g.add(hoja);
    return g;
  }
  function cesta(r) { const c = cil(r, r * 0.8, r * 1.1, 0x9b7f4e, 8); c.position.y = r * 0.55; return c; }

  function telar() {    // telar vertical con pesas de placa de barro de dos perforaciones
    const g = new THREE.Group();
    const madera = 0x6b4f33;
    [-0.6, 0.6].forEach(x => { const p = cil(0.04, 0.05, 1.9, madera); p.position.set(x, 0.95, 0); p.rotation.x = -0.12; g.add(p); });
    const travesano = cil(0.035, 0.035, 1.35, madera); travesano.rotation.z = Math.PI / 2; travesano.position.set(0, 1.78, -0.1); g.add(travesano);
    // Tejido ya hecho arriba y urdimbre
    const tela = caja(1.1, 0.5, 0.02, 0xc9bb98); tela.position.set(0, 1.5, -0.06); tela.rotation.x = -0.12; g.add(tela);
    const urd = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.9), new THREE.MeshLambertMaterial({ color: 0xd8ccae, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    urd.position.set(0, 0.85, 0.02); urd.rotation.x = -0.12; g.add(urd);
    for (let i = 0; i < 8; i++) {
      const pesa = caja(0.11, 0.08, 0.025, 0x8e6a48);
      pesa.position.set(-0.47 + i * 0.135, 0.33, 0.1); pesa.rotation.x = -0.12; g.add(pesa);
    }
    return g;
  }

  // ---------- Animales ----------
  function patas(g, ancho, largo, alto, color, r) {
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      const p = cil(r, r * 0.8, alto, color, 5); p.position.set(sx * ancho / 2, alto / 2, sz * largo / 2); g.add(p);
    });
  }
  function vaca(color) {
    const g = new THREE.Group();
    const c = caja(0.55, 0.6, 1.4, color); c.position.y = 0.95; g.add(c);
    patas(g, 0.38, 1.0, 0.68, color, 0.06);
    const cab = caja(0.3, 0.32, 0.45, color); cab.position.set(0, 1.05, 0.85); cab.rotation.x = 0.35; g.add(cab);
    [-1, 1].forEach(s => { const cu = cil(0.015, 0.03, 0.25, 0xd8ceb8, 5); cu.position.set(s * 0.2, 1.24, 0.82); cu.rotation.z = s * -1.1; g.add(cu); });
    return g;
  }
  function oveja(color) {
    const g = new THREE.Group();
    const c = bola(0.36, color, 0); c.scale.set(0.8, 0.75, 1.2); c.position.y = 0.55; g.add(c);
    patas(g, 0.2, 0.45, 0.35, 0x3a3029, 0.025);
    const cab = caja(0.14, 0.16, 0.24, 0x3a3029); cab.position.set(0, 0.68, 0.45); g.add(cab);
    return g;
  }
  function cabra() {
    const g = new THREE.Group();
    const c = caja(0.28, 0.32, 0.7, 0x6d5338); c.position.y = 0.6; g.add(c);
    patas(g, 0.18, 0.5, 0.45, 0x5a4430, 0.025);
    const cab = caja(0.13, 0.16, 0.25, 0x5a4430); cab.position.set(0, 0.85, 0.42); g.add(cab);
    [-1, 1].forEach(s => { const cu = cil(0.01, 0.025, 0.22, 0x8a7a62, 4); cu.position.set(s * 0.05, 1.0, 0.36); cu.rotation.x = -0.7; g.add(cu); });
    return g;
  }
  function cerdo() {
    const g = new THREE.Group();
    const c = bola(0.3, 0x3f3229, 0); c.scale.set(0.85, 0.85, 1.45); c.position.y = 0.42; g.add(c);
    patas(g, 0.22, 0.5, 0.22, 0x2f261f, 0.035);
    const h = cil(0.05, 0.09, 0.2, 0x3f3229, 6); h.rotation.x = Math.PI / 2; h.position.set(0, 0.4, 0.5); g.add(h);
    return g;
  }
  function perro() {
    const g = new THREE.Group();
    const c = caja(0.2, 0.22, 0.55, 0x9a7a52); c.position.y = 0.42; g.add(c);
    patas(g, 0.13, 0.38, 0.32, 0x8a6a45, 0.025);
    const cab = caja(0.14, 0.15, 0.22, 0x9a7a52); cab.position.set(0, 0.56, 0.34); g.add(cab);
    const cola = cil(0.015, 0.025, 0.25, 0x8a6a45, 4); cola.position.set(0, 0.5, -0.33); cola.rotation.x = -0.8; g.add(cola);
    return g;
  }

  V.construirVida = function (ctx) {
    const scene = ctx.scene;
    const anim = [];
    function añadir(obj, nivel, etiqueta) { scene.add(V.marcar(obj, nivel, etiqueta)); return obj; }
    let np = 0;
    function gente(x, y, tx, ty, postura, alto, opts) {
      const p = persona(alto || 1.6, np++, opts);
      posar(p, postura);
      situar(p, x, y, tx, ty);
      return añadir(p, N.HIP, 'Persona (escenografía, no estimación de población)');
    }
    const hg = ctx.hogar;   // hogar 11/4

    // 1. Junto al hogar: molienda (documentada: molinos junto al hogar) y una olla al fuego
    const mol = situar(molino(), hg.x - 1.6, hg.y - 0.9, hg.x, hg.y);
    añadir(mol, N.DOC, 'Molino de mano de granito y moleta de cuarcita');
    const moledora = gente(hg.x - 1.6, hg.y - 1.55, hg.x - 1.6, hg.y - 0.9, 'moler', 1.56, { peloLargo: true, tunicaLarga: true, mangaLarga: true });
    anim.push(t => { moledora.userData.art.brazos.forEach(b => { b.rotation.x = (-60 + 14 * Math.sin(t * 2.4)) * D2R; }); mol.userData.moleta.position.z = 0.07 * Math.sin(t * 2.4); });
    const olla = vasija('olla', 0x2e2a28); situar(olla, hg.x, hg.y, undefined, undefined, 0.08);
    añadir(olla, N.DOC, 'Olla de cocción reductora');
    // Fuego pequeño (que esté encendido es hipótesis)
    const fuego = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const l = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 5), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffa53a : 0xff7a1a }));
      l.position.set(Math.cos(i * 1.6) * 0.14, 0.15, Math.sin(i * 1.6) * 0.14); fuego.add(l);
    }
    situar(fuego, hg.x, hg.y, undefined, undefined, 0.02);
    añadir(fuego, N.HIP, 'Fuego encendido');
    anim.push(t => { fuego.children.forEach((l, i) => { l.scale.y = 0.75 + 0.35 * Math.abs(Math.sin(t * 6 + i * 1.7)); }); });
    // Vajilla alrededor del hogar
    [['cuenco', 0], ['plato', 1], ['cuenco', 5], ['vaso', 3], ['cuenco', 2]].forEach(([tp, c], i) => {
      const a = 2.2 + i * 0.5, r = 1.25;
      añadir(situar(vasija(tp, COLORES_CER[c]), hg.x + Math.cos(a) * r, hg.y + Math.sin(a) * r, undefined, undefined, 0.01), N.DOC, 'Cerámica a mano: ' + tp);
    });
    gente(hg.x + 1.3, hg.y + 0.6, hg.x, hg.y, 'sentado', 1.25, { estilo: 'sinMangas', descalzo: true, nino: true });   // niño o niña junto al fuego

    // 2. Taller de sílex (PDI 6): talla sentada, núcleos y lascas; trabajo de la madera con hacha de gabro
    const tx = -6, ty = -4;
    const tallador = gente(tx, ty, tx + 1, ty + 0.3, 'sentado', 1.62, { barba: true, peloLargo: true, estilo: 'sinMangas', descalzo: true });
    anim.push(t => { tallador.userData.art.brazos[0].rotation.x = (-55 + 22 * Math.max(0, Math.sin(t * 3.2))) * D2R; });
    for (let i = 0; i < 26; i++) {
      const a = V.azar() * 6.28, r = 0.3 + V.azar() * 0.7;
      const l = new THREE.Mesh(new THREE.TetrahedronGeometry(0.025 + V.azar() * 0.03, 0), V.mat(i % 3 ? 0xcfc6b3 : 0xa89f8c, { flatShading: true }));
      añadir(situar(l, tx + 0.6 + Math.cos(a) * r, ty + 0.2 + Math.sin(a) * r, undefined, undefined, 0.02), N.DOC, 'Lascas y núcleos de sílex');
    }
    const tronco = cil(0.16, 0.18, 1.6, 0x6e5640, 7); tronco.rotation.z = Math.PI / 2;
    const leño = new THREE.Group(); leño.add(tronco);
    añadir(situar(leño, -9, -7, -8, -7, 0.16), N.DED, 'Tronco para trabajar');
    const hachero = gente(-9, -6.1, -9, -7, 'hachar', 1.66, { barba: true, estilo: 'sinMangas' });
    const hx = hacha(); hx.position.set(0, 0.06, 0.1); hx.rotation.x = Math.PI;
    hachero.userData.art.manos[1].add(hx); hx.position.set(0, -0.02, 0); hx.rotation.x = Math.PI;
    añadir(hachero, N.HIP, 'Persona');
    anim.push(t => { const v = -150 + 85 * Math.max(0, Math.sin(t * 2)); hachero.userData.art.brazos.forEach(b => { b.rotation.x = v * D2R; }); });

    // 3. Telar (PDI 7) junto a la cabaña 31
    const tel = situar(telar(), -16.6, 4.6, -14, 4.4);
    añadir(tel, N.DED, 'Telar vertical con pesas de placa (pesas documentadas)');
    const t2 = new THREE.Vector3(0, 0, 0.75).applyEuler(tel.rotation);
    gente(-16.6 + t2.x, 4.6 - t2.z, -16.6, 4.6, 'tejer', 1.58, { recogido: true, tunicaLarga: true, mangaLarga: true, color: 0xc2a86f });

    // 4. Cerrar un silo (silo 24) con barro traído en cesta
    gente(14.5 - 0.9, 8.5 - 0.2, 14.5, 8.5, 'agachado', 1.64, { estilo: 'sinMangas', descalzo: true });
    añadir(situar(cesta(0.22), 13.4, 9.3), N.DED, 'Cesta con barro');
    // 5. Llevar grano al silo abierto 22
    const portador = gente(19.6, 9.6, 18.1, 7.9, 'cargar', 1.6, { peloLargo: true, mangaLarga: true });
    const cs = cesta(0.2); cs.position.copy(portador.userData.art.cabezaArriba); portador.userData.art.cabeza.add(cs);
    // 6. Limpiar la zanja (trabajo colectivo de mantenimiento)
    gente(3.3, -11.5, 3.6, -12.5, 'agachado', 1.62, { estilo: 'sinMangas', descalzo: true, peloLargo: true });
    gente(4.6, -9.6, 3.4, -11, 'pie', 1.7, { barba: true, canas: true });
    añadir(situar(cesta(0.24), 4.2, -10.4), N.DED, 'Cesta para sacar tierra');

    // 7. Siega del trigo con hoces de sílex en el campo norte, con gavillas
    for (let i = 0; i < 3; i++) {
      const sx = -22 + i * 5, sy = 57.5;
      const seg = gente(sx, sy, sx + 0.2, sy + 2, 'segar', 1.6 + i * 0.04, [{ estilo: 'sinMangas' }, { peloLargo: true, recogido: true, tunicaLarga: true }, { estilo: 'sinMangas', barba: true }][i]);
      const h = hoz(); h.position.set(0, -0.05, 0.03); seg.userData.art.manos[0].add(h);
      anim.push(t => { seg.userData.art.brazos[0].rotation.y = 0.5 * Math.sin(t * 1.8 + i); });
    }
    for (let i = 0; i < 7; i++) {
      const g = cil(0.13, 0.17, 0.75, 0xc9a65a, 7);
      g.rotation.z = (V.azar() - 0.5) * 0.3;
      añadir(situar(g, -26 + i * 3.1, 55 - V.azar() * 1.5, undefined, undefined, 0.37), N.DED, 'Gavilla de trigo');
    }
    // Rastrojo: franja ya segada en el borde sur del campo de trigo
    const rastrojo = new THREE.Mesh(new THREE.PlaneGeometry(44, 3.5), V.mat(0xb59a5e, { polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    rastrojo.rotation.x = -Math.PI / 2; rastrojo.rotation.z = 0.08;
    situar(rastrojo, -10.2, 57.2, undefined, undefined, 0.07);
    añadir(rastrojo, N.HIP, 'Rastrojo');

    // 8. Ganado: ovejas y cabras con pastor y perro al oeste; vacas al sureste; cerdos en el encinar
    const px = -70, py = 25;
    for (let i = 0; i < 12; i++) {
      const a = V.azar() * 6.28, r = 2 + V.azar() * 9;
      const o = oveja(i % 4 ? 0xd9cfb8 : 0x8f826c);
      añadir(situar(o, px + Math.cos(a) * r, py + Math.sin(a) * r, px + 20 * V.azar(), py + 20 * V.azar()), N.DOC, 'Oveja');
    }
    for (let i = 0; i < 5; i++) {
      const a = V.azar() * 6.28, r = 4 + V.azar() * 8;
      añadir(situar(cabra(), px + Math.cos(a) * r, py + Math.sin(a) * r, px - 20, py + 10 * V.azar()), N.DED, 'Cabra');
    }
    const pastor = gente(px + 9, py - 3, px, py, 'vara', 1.64, { barba: true, tunicaLarga: true, mangaLarga: true });
    const vara = cil(0.02, 0.02, 1.7, 0x6b4f33); vara.position.set(0, -0.05, 0); vara.rotation.x = -1.0; pastor.userData.art.manos[0].add(vara);
    añadir(situar(perro(), px + 7.5, py - 4.5, px, py), N.DED, 'Perro');
    [[48, -34], [53, -30], [50, -41], [58, -37]].forEach(([x, y], i) => {
      añadir(situar(vaca([0x5a4030, 0x7a5a3d, 0x3a2e25, 0x8a6a4a][i]), x, y, x + (i - 1.5) * 5, y + 6), N.DOC, 'Vaca (bóvido documentado)');
    });
    [[-92, -48], [-88, -52], [-95, -54]].forEach(([x, y]) => añadir(situar(cerdo(), x, y, x + 3, y - 2), N.DED, 'Cerdo'));

    // Animación suave (solo en calidad alta)
    if (ctx.calidad !== 'baja') {
      let t = 0;
      ctx.animando = true;
      ctx.animadores.push(dt => {
        if (!ctx.animando) return false;
        t += dt;
        anim.forEach(f => f(t));
        return true;
      });
    }
  };
})(window.VALDE);
