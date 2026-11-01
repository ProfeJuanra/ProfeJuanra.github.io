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
  const PIELES = [0xc89f7c, 0xb98a63, 0xa8774f, 0xd2a986];
  const ROPAS = [0x8c7a5e, 0xb8a888, 0x6e5f4a, 0x9a8c74, 0xd0c4a4, 0x7b6a55]; // lana y lino sin teñir
  const PELOS = [0x2b2018, 0x3a2a1c, 0x1f1a16, 0x4a3524];

  // Figura de unos 1,6 m, mirando hacia +Z local. Devuelve el grupo con articulaciones.
  function persona(alto, i, opciones) {
    const o = opciones || {};
    const k = alto / 1.6;
    const raiz = new THREE.Group();
    const cuerpo = new THREE.Group(); cuerpo.scale.setScalar(k); raiz.add(cuerpo);
    const piel = PIELES[i % PIELES.length], ropa = ROPAS[i % ROPAS.length], pelo = PELOS[i % PELOS.length];
    // Piernas (pivote en la cadera)
    const piernas = [];
    [-0.08, 0.08].forEach(x => {
      const p = new THREE.Group(); p.position.set(x, 0.82, 0);
      const m = cil(0.055, 0.045, 0.82, piel); m.position.y = -0.41; p.add(m);
      cuerpo.add(p); piernas.push(p);
    });
    // Tronco (pivote en la cadera): túnica, brazos y cabeza
    const tronco = new THREE.Group(); tronco.position.y = 0.82; cuerpo.add(tronco);
    const tunica = cil(0.16, 0.25, 0.85, ropa, 7); tunica.position.y = 0.12; tronco.add(tunica);
    const cinto = cil(0.2, 0.2, 0.05, 0x4b3a2a, 7); cinto.position.y = 0.1; tronco.add(cinto);
    const cabeza = bola(0.11, piel); cabeza.position.y = 0.68; tronco.add(cabeza);
    const cab = bola(0.118, pelo); cab.scale.set(1, 0.75, 1); cab.position.set(0, 0.72, -0.02); tronco.add(cab);
    if (o.peloLargo) { const pl = caja(0.2, 0.28, 0.08, pelo); pl.position.set(0, 0.55, -0.1); tronco.add(pl); }
    const brazos = [];
    [-0.21, 0.21].forEach(x => {
      const b = new THREE.Group(); b.position.set(x, 0.5, 0);
      const m = cil(0.045, 0.04, 0.62, ropa === 0xd0c4a4 ? piel : piel); m.position.y = -0.31; b.add(m);
      const manga = cil(0.06, 0.055, 0.22, ropa); manga.position.y = -0.1; b.add(manga);
      tronco.add(b); brazos.push(b);
    });
    raiz.userData.art = { cuerpo, tronco, brazos, piernas, k };
    return raiz;
  }

  // Posturas: inclinación del tronco, brazos y piernas (grados) y descenso de la cadera (m).
  // Brazos y piernas: negativo = hacia delante; positivo = hacia atrás.
  const POSTURAS = {
    pie: { tronco: 0, brazos: [0, 0], piernas: [0, 0], bajar: 0 },
    moler: { tronco: 45, brazos: [-60, -60], piernas: [12, 12], bajar: 0.42 },       // de rodillas: las espinillas quedan bajo el suelo       // de rodillas ante el molino
    sentado: { tronco: 15, brazos: [-55, -35], piernas: [-85, -80], bajar: 0.7 },        // tallando sílex en el suelo
    tejer: { tronco: 0, brazos: [-110, -95], piernas: [0, 5], bajar: 0 },
    segar: { tronco: 60, brazos: [-80, -40], piernas: [-10, 15], bajar: 0.08 },
    vara: { tronco: 5, brazos: [-25, 5], piernas: [5, -5], bajar: 0 },
    agachado: { tronco: 70, brazos: [-80, -75], piernas: [-20, 25], bajar: 0.18 },
    hachar: { tronco: 15, brazos: [-150, -140], piernas: [-12, 12], bajar: 0 },
    cargar: { tronco: 0, brazos: [-170, -170], piernas: [8, -8], bajar: 0 },            // cesta sobre la cabeza
  };
  function posar(p, nombre) {
    const a = p.userData.art, s = POSTURAS[nombre];
    a.tronco.rotation.x = s.tronco * D2R;
    a.brazos[0].rotation.x = s.brazos[0] * D2R; a.brazos[1].rotation.x = s.brazos[1] * D2R;
    a.piernas[0].rotation.x = s.piernas[0] * D2R; a.piernas[1].rotation.x = s.piernas[1] * D2R;
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
    const moledora = gente(hg.x - 1.6, hg.y - 1.55, hg.x - 1.6, hg.y - 0.9, 'moler', 1.56, { peloLargo: true });
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
    gente(hg.x + 1.3, hg.y + 0.6, hg.x, hg.y, 'sentado', 1.25, {});   // niño o niña junto al fuego

    // 2. Taller de sílex (PDI 6): talla sentada, núcleos y lascas; trabajo de la madera con hacha de gabro
    const tx = -6, ty = -4;
    const tallador = gente(tx, ty, tx + 1, ty + 0.3, 'sentado', 1.62);
    anim.push(t => { tallador.userData.art.brazos[0].rotation.x = (-55 + 22 * Math.max(0, Math.sin(t * 3.2))) * D2R; });
    for (let i = 0; i < 26; i++) {
      const a = V.azar() * 6.28, r = 0.3 + V.azar() * 0.7;
      const l = new THREE.Mesh(new THREE.TetrahedronGeometry(0.025 + V.azar() * 0.03, 0), V.mat(i % 3 ? 0xcfc6b3 : 0xa89f8c, { flatShading: true }));
      añadir(situar(l, tx + 0.6 + Math.cos(a) * r, ty + 0.2 + Math.sin(a) * r, undefined, undefined, 0.02), N.DOC, 'Lascas y núcleos de sílex');
    }
    const tronco = cil(0.16, 0.18, 1.6, 0x6e5640, 7); tronco.rotation.z = Math.PI / 2;
    const leño = new THREE.Group(); leño.add(tronco);
    añadir(situar(leño, -9, -7, -8, -7, 0.16), N.DED, 'Tronco para trabajar');
    const hachero = gente(-9, -6.1, -9, -7, 'hachar', 1.66);
    const hx = hacha(); hx.position.set(0, 0.06, 0.1); hx.rotation.x = Math.PI;
    hachero.userData.art.brazos[1].add(hx); hx.position.set(0, -0.6, 0); hx.rotation.x = 0;
    añadir(hachero, N.HIP, 'Persona');
    anim.push(t => { const v = -150 + 85 * Math.max(0, Math.sin(t * 2)); hachero.userData.art.brazos.forEach(b => { b.rotation.x = v * D2R; }); });

    // 3. Telar (PDI 7) junto a la cabaña 31
    const tel = situar(telar(), -16.6, 4.6, -14, 4.4);
    añadir(tel, N.DED, 'Telar vertical con pesas de placa (pesas documentadas)');
    const t2 = new THREE.Vector3(0, 0, 0.75).applyEuler(tel.rotation);
    gente(-16.6 + t2.x, 4.6 - t2.z, -16.6, 4.6, 'tejer', 1.58, { peloLargo: true });

    // 4. Cerrar un silo (silo 24) con barro traído en cesta
    gente(14.5 - 0.9, 8.5 - 0.2, 14.5, 8.5, 'agachado', 1.64);
    añadir(situar(cesta(0.22), 13.4, 9.3), N.DED, 'Cesta con barro');
    // 5. Llevar grano al silo abierto 22
    const portador = gente(19.6, 9.6, 18.1, 7.9, 'cargar', 1.6, { peloLargo: true });
    const cs = cesta(0.2); cs.position.set(0, 0.9, 0); portador.userData.art.tronco.add(cs);
    // 6. Limpiar la zanja (trabajo colectivo de mantenimiento)
    gente(3.3, -11.5, 3.6, -12.5, 'agachado', 1.62);
    gente(4.6, -9.6, 3.4, -11, 'pie', 1.7);
    añadir(situar(cesta(0.24), 4.2, -10.4), N.DED, 'Cesta para sacar tierra');

    // 7. Siega del trigo con hoces de sílex en el campo norte, con gavillas
    for (let i = 0; i < 3; i++) {
      const sx = -22 + i * 5, sy = 57.5;
      const seg = gente(sx, sy, sx + 0.2, sy + 2, 'segar', 1.6 + i * 0.04, { peloLargo: i === 1 });
      const h = hoz(); h.position.set(0, -0.62, 0.05); seg.userData.art.brazos[0].add(h);
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
    const pastor = gente(px + 9, py - 3, px, py, 'vara', 1.64);
    const vara = cil(0.02, 0.02, 1.7, 0x6b4f33); vara.position.set(0, -0.3, 0.05); pastor.userData.art.brazos[0].add(vara);
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
