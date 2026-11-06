// El dolmen de La Moína II: túmulo, cámara, cubierta, corredor, vestíbulo, ajuar y clausura,
// en cuatro momentos: construcción, uso, clausura (hoguera y relleno) y hoy.
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const D = V.datos;
  const CO = D.corredor, VE = D.vestibulo, CA = D.camara, TU = D.tumulo;

  // ---------- Geometría del túmulo ----------
  const centroT = () => V.desdeEje(-TU.desplazamiento, 0);   // la cámara queda al sureste del centro del túmulo
  function eTumulo(x, y) {
    const c = centroT(), dx = x - c.x, dy = y - c.y;
    const a = TU.rumboEjeLargo * Math.PI / 180;
    const largo = dx * Math.sin(a) + dy * Math.cos(a), corto = dx * Math.cos(a) - dy * Math.sin(a);
    return Math.hypot(largo / (TU.ejeLargo / 2), corto / (TU.ejeCorto / 2)) + 0.025 * V.fbm(x / 4, y / 4);
  }
  function hLleno(x, y) {
    const e = eTumulo(x, y);
    if (e >= 1) return null;
    return TU.altura * Math.pow(1 - e * e, 0.72) + 0.07 * V.fbm(x / 1.6, y / 1.6) * V.paso(1, 0.85, e);
  }
  const semiVest = s => VE.anchoInicio / 2 + (VE.anchoFin - VE.anchoInicio) / 2 * Math.min(1, Math.max(0, (s - VE.desde) / (VE.hasta - VE.desde)));
  const altoCorr = s => CO.altoInicio + (CO.altoFin - CO.altoInicio) * Math.min(1, Math.max(0, (s - CO.desde) / (CO.hasta - CO.desde)));
  // ¿Dentro del hueco abierto del vestíbulo (y su salida hasta el borde del túmulo)?
  const enVestibulo = (s, t, margen) => s > CO.hasta - 0.05 && s < 12 && Math.abs(t) < semiVest(s) + (margen || 0);

  // Altura de la superficie del túmulo en cada momento (null = no hay túmulo).
  function hMomento(x, y, m) {
    const h = hLleno(x, y);
    if (h === null) return null;
    const { s, t } = V.enEje(x, y), r = Math.hypot(x, y);
    if (m === 'construccion') {
      // Se levanta por anillos: el interior hasta ~1,25 m y el anillo exterior, más bajo [HIP]
      const e = eTumulo(x, y);
      let hc = Math.min(h, e < 0.56 ? 1.25 : 0.45 + 0.8 * V.paso(0.62, 0.56, e));
      if (r < CA.radioLosas + 0.1) hc = Math.min(hc, -0.05 + 1.3 * V.paso(1.95, 2.45, r));
      if (s > 1.6 && s < CO.hasta + 0.1 && Math.abs(t) < 0.5) hc = -0.05;
      if (enVestibulo(s, t, 0.2)) hc = -0.05;
      return hc;
    }
    if (m === 'hoy') {
      // Túmulo rebajado y excavado: cámara abierta, corredor vaciado bajo sus losas, vestíbulo vacío [DOC, fotos]
      let hh = 0.6 * h;
      const crater = 0.95 + (hh - 0.95) * V.paso(3.0, 5.5, r);
      if (r < 5.5) hh = Math.min(hh, crater);
      if (r < CA.radioLosas + 0.2) hh = Math.min(hh, -0.05 + 1.0 * V.paso(1.9, 2.5, r));
      if (s > 1.6 && s < CO.hasta + 0.3) {
        const lat = Math.abs(t);
        if (lat < 2.6) hh = Math.min(hh, lat < 0.5 ? -0.05 : 0.75 + 0.6 * V.paso(0.9, 2.6, lat));
      }
      if (enVestibulo(s, t, 0.25)) hh = -0.05;
      else if (s > CO.hasta && Math.abs(t) < semiVest(s) + 1.6) hh = Math.min(hh, 0.3 + 0.5 * V.paso(semiVest(s) + 0.25, semiVest(s) + 1.6, Math.abs(t)));
      return hh;
    }
    return h;   // uso y clausura: túmulo completo (el hueco del vestíbulo se recorta aparte)
  }
  const vestibuloAbierto = m => m === 'uso' || m === 'sellado-fuego';

  V.construirDolmen = function (ctx) {
    const { scene } = ctx;
    const r = V.semilla(812);
    const baja = ctx.calidad === 'baja';
    const raiz = new THREE.Group(); raiz.name = 'dolmen';
    scene.add(raiz);
    const corte = [new THREE.Plane(new THREE.Vector3(), 0)];
    { const d = V.dir(D.rumboAcceso); corte[0].normal.set(d.y, 0, d.x); }   // deja la mitad suroeste
    const materialesCorte = [];
    function mat(m) { materialesCorte.push(m); return m; }
    const grupos = {};
    function grupo(nombre, nivel, etiqueta) {
      const g = new THREE.Group(); g.name = nombre; raiz.add(g); grupos[nombre] = g;
      if (nivel) V.marcar(g, nivel, etiqueta);
      return g;
    }
    const pos = (x, y, h) => new THREE.Vector3(x, h, -y);
    const sombra = o => { o.traverse(c => { if (c.isMesh) { c.castShadow = !baja; c.receiveShadow = true; } }); return o; };

    // ---------- Materiales ----------
    const matGranito = mat(new THREE.MeshLambertMaterial({ map: V.texGranito(), side: THREE.DoubleSide }));
    const matMonzo = mat(new THREE.MeshLambertMaterial({ map: V.texturaCanvas(128, 128, (g, w, h) => V.pintarGranito(g, w, h, '#b3a294', 5)), side: THREE.DoubleSide }));
    const texTumulo = V.texturaCanvas(512, 512, (g, w, h) => {   // piedras de granito (90 %), cuarcita rojiza y cuarzo blanco con tierra gris y anaranjada [DOC]
      const q = V.semilla(61);
      g.fillStyle = '#6f604c'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { g.fillStyle = q() < 0.5 ? 'rgba(150,110,70,0.35)' : 'rgba(110,104,98,0.35)'; g.beginPath(); g.ellipse(q() * w, q() * h, 20 + q() * 40, 14 + q() * 30, q() * 3, 0, 7); g.fill(); }
      for (let i = 0; i < 1100; i++) {
        const x = q() * w, y = q() * h, rr = 4 + q() * 12, c = q();
        const b = 104 + q() * 58;
        const col = c < 0.9 ? [b + 4, b, b - 8] : c < 0.95 ? [128 + q() * 16, 82, 66] : [206, 202, 194];
        g.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`;
        g.beginPath(); g.ellipse(x, y, rr, rr * (0.6 + q() * 0.3), q() * 3, 0, 7); g.fill();
        g.fillStyle = 'rgba(40,32,24,0.28)'; g.beginPath(); g.ellipse(x + rr * 0.25, y + rr * 0.35, rr, rr * 0.4, 0, 0, Math.PI); g.fill();
      }
    });
    texTumulo.wrapS = texTumulo.wrapT = THREE.RepeatWrapping;
    const matTumulo = mat(new THREE.MeshLambertMaterial({ map: texTumulo, vertexColors: true, side: THREE.DoubleSide }));

    // ---------- Superficie del túmulo (una malla que cambia con el momento) ----------
    const P0 = baja ? 0.5 : 0.3, X0 = -20, X1 = 16, Y0 = -16, Y1 = 20;
    const nx = Math.round((X1 - X0) / P0), ny = Math.round((Y1 - Y0) / P0);
    const gT = new THREE.BufferGeometry();
    const posT = new Float32Array((nx + 1) * (ny + 1) * 3), colT = new Float32Array(posT.length), uvT = new Float32Array((nx + 1) * (ny + 1) * 2);
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const k = j * (nx + 1) + i, x = X0 + i * P0, y = Y0 + j * P0;
      posT[k * 3] = x; posT[k * 3 + 2] = -y; uvT[k * 2] = x / 5; uvT[k * 2 + 1] = y / 5;
    }
    gT.setAttribute('position', new THREE.BufferAttribute(posT, 3));
    gT.setAttribute('color', new THREE.BufferAttribute(colT, 3));
    gT.setAttribute('uv', new THREE.BufferAttribute(uvT, 2));
    const tumulo = new THREE.Mesh(gT, matTumulo);
    tumulo.name = 'tumulo'; tumulo.receiveShadow = true; tumulo.castShadow = !baja;
    const gTum = grupo('tumulo', N.DOC, 'Túmulo de piedras y tierra (forma y medidas del informe)');
    gTum.add(tumulo);
    const indicesTumulo = (m) => {
      const idx = [];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
        const x = X0 + (i + 0.5) * P0, y = Y0 + (j + 0.5) * P0;
        if (eTumulo(x, y) > 1.04) continue;
        if (vestibuloAbierto(m)) { const { s, t } = V.enEje(x, y); if (enVestibulo(s, t, 0.1)) continue; }
        idx.push(a, b, c, b, d, c);
      }
      return idx;
    };

    // Paredes del hueco del vestíbulo (relleno de piedra detrás de los ortostatos), solo cuando está abierto
    const gParedes = grupo('paredes-vestibulo', N.DED, 'Paredes de piedra del hueco del vestíbulo');
    {
      const pts = [], uvs = [];
      const quad = (a, b, c, d, ua, ub) => { pts.push(...a, ...b, ...c, ...b, ...d, ...c); uvs.push(ua, 0, ub, 0, ua, 1, ub, 0, ub, 1, ua, 1); };
      for (const lado of [1, -1]) {
        const n = 24;
        for (let i = 0; i < n; i++) {
          const s0 = CO.hasta + (12 - CO.hasta) * i / n, s1 = CO.hasta + (12 - CO.hasta) * (i + 1) / n;
          const p0 = V.desdeEje(s0, lado * (semiVest(s0) + 0.12)), p1 = V.desdeEje(s1, lado * (semiVest(s1) + 0.12));
          const q0 = V.desdeEje(s0, lado * (semiVest(s0) + 0.6)), q1 = V.desdeEje(s1, lado * (semiVest(s1) + 0.6));
          const h0 = hLleno(q0.x, q0.y), h1 = hLleno(q1.x, q1.y);
          if (h0 === null || h1 === null) continue;
          quad([p0.x, -0.05, -p0.y], [p1.x, -0.05, -p1.y], [p0.x, h0, -p0.y], [p1.x, h1, -p1.y], s0 / 2, s1 / 2);
          quad([p0.x, h0, -p0.y], [p1.x, h1, -p1.y], [q0.x, h0, -q0.y], [q1.x, h1, -q1.y], s0 / 2, s1 / 2);   // remate superior
        }
      }
      // Frente sobre la boca del corredor
      for (let i = 0; i < 8; i++) {
        const t0 = -0.85 + 1.7 * i / 8, t1 = -0.85 + 1.7 * (i + 1) / 8;
        const a = V.desdeEje(CO.hasta + 0.05, t0), b = V.desdeEje(CO.hasta + 0.05, t1);
        const ha = hLleno(a.x, a.y), hb = hLleno(b.x, b.y), z0 = altoCorr(CO.hasta) + 0.22;
        quad([a.x, z0, -a.y], [b.x, z0, -b.y], [a.x, ha, -a.y], [b.x, hb, -b.y], t0, t1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      g.computeVertexNormals();
      const m = mat(new THREE.MeshLambertMaterial({ map: texTumulo, side: THREE.DoubleSide }));
      const paredes = new THREE.Mesh(g, m); paredes.receiveShadow = true; paredes.castShadow = !baja;
      gParedes.add(paredes);
    }

    // Tapa de la sección para el modo «ver por dentro»
    const gTapa = new THREE.BufferGeometry();
    const tapa = new THREE.Mesh(gTapa, new THREE.MeshLambertMaterial({ map: texTumulo, color: 0xd8c4a8, side: THREE.DoubleSide }));
    tapa.name = 'tapa-corte'; tapa.visible = false;
    V.marcar(tapa, N.HIP, 'Corte didáctico del túmulo');
    raiz.add(tapa);
    function construirTapa(m) {
      const d = V.dir(D.rumboAcceso);
      const pts = [], uvs = [];
      const cav = s => {   // altura de los huecos (cámara, corredor) en la línea del eje
        const a = Math.abs(s);
        if (s < 2.3 && s > -2.3) return (m === 'uso' || m === 'sellado-fuego' || m === 'sellado-relleno') ? (a < 2.0 ? 1.7 + 0.85 * Math.sqrt(Math.max(0, 1 - (a / 2.05) ** 2)) : 0) : 9;
        if (s >= 2.3 && s <= CO.hasta) return altoCorr(s) + 0.22;
        return 0;
      };
      const n = 160;
      for (let i = 0; i < n; i++) {
        const sa = -16 + 28 * i / n, sb = -16 + 28 * (i + 1) / n;
        const pa = V.desdeEje(sa, 0), pb = V.desdeEje(sb, 0);
        const ha = hMomento(pa.x, pa.y, m), hb = hMomento(pb.x, pb.y, m);
        if (ha === null || hb === null) continue;
        const abierta = vestibuloAbierto(m) && enVestibulo(sa, 0);
        if (abierta) continue;
        const ba = Math.min(ha, cav(sa)), bb = Math.min(hb, cav(sb));
        if (ha - ba < 0.02 && hb - bb < 0.02) continue;
        const A = [d.x * sa, ba, -d.y * sa], B = [d.x * sb, bb, -d.y * sb], C = [d.x * sa, ha, -d.y * sa], Dd = [d.x * sb, hb, -d.y * sb];
        pts.push(...A, ...B, ...C, ...B, ...Dd, ...C);
        uvs.push(sa / 3, ba / 3, sb / 3, bb / 3, sa / 3, ha / 3, sb / 3, bb / 3, sb / 3, hb / 3, sa / 3, ha / 3);
      }
      gTapa.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      gTapa.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      gTapa.computeVertexNormals();
    }

    // ---------- Cámara: 13 ortostatos de granito [DOC] ----------
    const gCam = grupo('camara', N.DOC, 'Ortostato de la cámara (granito)');
    const ortostatos = {};
    const matCaraLisa = matGranito;
    CA.losas.forEach((l, i) => {
      const geo = V.losa(l.ancho, l.alto + 0.25, CA.grueso, i * 3.7 + 1, 0.16);   // 0,25 m hincados en la zanja
      const conGrabado = !!V.grabados[l.id];
      const mats = conGrabado
        ? [matCaraLisa, matCaraLisa, matCaraLisa, matCaraLisa, mat(new THREE.MeshLambertMaterial({ map: V.texturaOrtostato(l.id, l.ancho, l.alto + 0.25, 'fresco') })), matCaraLisa]
        : matCaraLisa;
      const o = new THREE.Mesh(geo, mats);
      const d = V.dir(l.rumbo);
      o.position.set(d.x * CA.radioLosas, -0.25, -d.y * CA.radioLosas);
      o.rotation.order = 'YXZ';
      o.rotation.set(0.05 + 0.03 * (r() - 0.5), -l.rumbo * Math.PI / 180 + (r() - 0.5) * 0.12, (r() - 0.5) * 0.04);
      o.userData.losa = l;
      gCam.add(o);
      ortostatos[l.id] = o;
      if (conGrabado) V.marcar(o, N.DOC, 'Ortostato grabado U.E. ' + l.id);
    });
    // Calzos de granito en la base de los ortostatos [DOC]
    const gCalzos = grupo('calzos', N.DOC, 'Calzos y cuñas de granito');
    {
      const gp = V.geoPiedra(5, 0), lista = [];
      CA.losas.forEach(l => { for (let k = 0; k < 4; k++) { const d = V.dir(l.rumbo + (r() - 0.5) * 12); const rr = CA.radioLosas + 0.28 + r() * 0.25; lista.push([d.x * rr, d.y * rr, 0.12 + r() * 0.12]); } });
      const im = new THREE.InstancedMesh(gp, matGranito, lista.length);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      lista.forEach(([x, y, k], i) => { q.setFromEuler(e.set(r() * 3, r() * 3, r() * 3)); m4.compose(pos(x, y, 0.04), q, new THREE.Vector3(k * 1.3, k, k)); im.setMatrixAt(i, m4); });
      gCalzos.add(im);
    }
    // Suelo de uso anaranjado sobre el relleno blanquecino [DOC]
    const gSuelo = grupo('suelo-camara', N.DOC, 'Superficie de uso anaranjada de la cámara');
    {
      const disco = new THREE.Mesh(new THREE.CircleGeometry(CA.radioLosas - 0.05, 36), mat(new THREE.MeshLambertMaterial({ color: 0xb7774a })));
      disco.rotation.x = -Math.PI / 2; disco.position.y = 0.03; disco.receiveShadow = true;
      gSuelo.add(disco);
      const pts = [];
      const ancho = CO.ancho / 2;
      const a = V.desdeEje(1.8, ancho), b = V.desdeEje(1.8, -ancho), c = V.desdeEje(CO.hasta, ancho), d = V.desdeEje(CO.hasta, -ancho);
      pts.push(a.x, 0.03, -a.y, b.x, 0.03, -b.y, c.x, 0.03, -c.y, b.x, 0.03, -b.y, d.x, 0.03, -d.y, c.x, 0.03, -c.y);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.computeVertexNormals();
      const suelo = new THREE.Mesh(g, mat(new THREE.MeshLambertMaterial({ color: 0xa77250, side: THREE.DoubleSide }))); suelo.receiveShadow = true; suelo.name = 'suelo-corredor';
      gSuelo.add(suelo);
    }

    // ---------- Cubierta de la cámara: falsa cúpula de lajas por aproximación [HIP del equipo de excavación] ----------
    const gCub = grupo('cubierta', N.HIP, 'Falsa cúpula de lajas (propuesta del informe)');
    const hilera = (radio, altura, n, ancho, giro, estado) => {
      for (let i = 0; i < n; i++) {
        const rb = (i / n) * 360 + giro;
        const d = V.dir(rb);
        const laja = new THREE.Mesh(V.losa(ancho, 0.22, 0.95 + r() * 0.3, 50 + i + radio * 10, 0), matGranito);
        laja.rotation.order = 'YXZ';
        laja.rotation.set(0.06, -rb * Math.PI / 180, (r() - 0.5) * 0.08);
        laja.position.set(d.x * radio, altura, -d.y * radio);
        laja.userData.estado = estado;
        gCub.add(laja);
      }
    };
    hilera(1.95, 1.62, 11, 1.25, 8, 0);     // primera hilada, sobre las cabezas de los ortostatos
    hilera(1.6, 1.86, 10, 1.05, 24, 1);
    hilera(1.2, 2.1, 8, 0.95, 4, 2);
    hilera(0.78, 2.32, 6, 0.85, 30, 2);
    const cierre = new THREE.Mesh(V.losa(1.5, 0.24, 1.35, 99, 0), matGranito);
    cierre.position.set(0, 2.42, 0); cierre.userData.estado = 3;
    gCub.add(cierre);

    // ---------- Corredor: 9 ortostatos y losas planas de cubierta [DOC] ----------
    const gCorr = grupo('corredor', N.DOC, 'Ortostato del corredor');
    function linea(lado, n, s0, s1, alto, ancho, nombre, destino, ultimo) {
      const piezas = [];
      for (let i = 0; i < n; i++) {
        const sa = s0 + (s1 - s0) * i / n, sb = s0 + (s1 - s0) * (i + 1) / n, sm = (sa + sb) / 2;
        const tt = lado * (ancho(sm) + 0.13);
        const p = V.desdeEje(sm, tt);
        const pa = V.desdeEje(sa, lado * (ancho(sa) + 0.13)), pb = V.desdeEje(sb, lado * (ancho(sb) + 0.13));
        const largo = Math.hypot(pb.x - pa.x, pb.y - pa.y) + 0.08;
        let h = alto(sm) + (r() - 0.5) * 0.08, l = largo;
        let id = null;
        if (ultimo && i === n - 1) { h = 0.455; l = 0.74; id = 'acceso'; }    // el ortostato del acceso con 3 cazoletas [DOC]
        const geo = V.losa(l, h + 0.2, 0.26, 200 + i * 7 + lado * 3 + s0, 0.1);
        const mats = id ? [matGranito, matGranito, matGranito, matGranito, mat(new THREE.MeshLambertMaterial({ map: V.texturaOrtostato(id, l, h + 0.2, 'fresco') })), matGranito] : matGranito;
        const o = new THREE.Mesh(geo, mats);
        // la cara +z mira al interior del pasillo: normal de la línea que apunta hacia el eje
        const ax = V.dir(D.rumboAcceso), haciaEje = lado > 0 ? { x: ax.y, y: -ax.x } : { x: -ax.y, y: ax.x };
        const Lx = pb.x - pa.x, Ly = pb.y - pa.y, Ll = Math.hypot(Lx, Ly);
        let nX = -Ly / Ll, nY = Lx / Ll;
        if (nX * haciaEje.x + nY * haciaEje.y < 0) { nX = -nX; nY = -nY; }
        o.rotation.order = 'YXZ';
        o.rotation.set(0.04, Math.atan2(nX, -nY), 0);
        o.position.set(p.x, -0.2, -p.y);
        if (id) { o.userData.losa = { id, ancho: l, alto: h + 0.2 }; ortostatos[id] = o; V.marcar(o, N.DOC, 'Ortostato del acceso con cazoletas'); }
        destino.add(o);
        piezas.push(o);
      }
      return piezas;
    }
    const anchoCorr = () => CO.ancho / 2;
    linea(1, CO.norte, CO.desde, CO.hasta, altoCorr, anchoCorr, 'corredor', gCorr);
    linea(-1, CO.sur, CO.desde, CO.hasta, altoCorr, anchoCorr, 'corredor', gCorr);
    const gCubCorr = grupo('cubierta-corredor', N.DOC, 'Losas planas de cubierta del corredor');
    const losasCubCorr = [];
    for (let i = 0; i < 4; i++) {
      const sa = CO.desde - 0.1 + i * (CO.hasta - CO.desde + 0.1) / 4, sm = sa + (CO.hasta - CO.desde + 0.1) / 8;
      const p = V.desdeEje(sm, 0);
      const losa = new THREE.Mesh(V.losa(1.75, 0.2, 0.92, 300 + i, 0), matGranito);
      losa.rotation.order = 'YXZ';
      losa.rotation.set(0, -D.rumboAcceso * Math.PI / 180, 0);
      losa.position.set(p.x, altoCorr(sm) + 0.02, -p.y);
      losa.userData.orden = i;
      gCubCorr.add(losa);
      losasCubCorr.push(losa);
    }
    // Dintel del acceso al corredor
    {
      const p = V.desdeEje(CO.hasta + 0.1, 0);
      const dintel = new THREE.Mesh(V.losa(2.1, 0.24, 0.5, 333, 0), matGranito);
      dintel.rotation.order = 'YXZ'; dintel.rotation.set(0, -D.rumboAcceso * Math.PI / 180, 0);
      dintel.position.set(p.x, altoCorr(CO.hasta) + 0.02, -p.y);
      gCubCorr.add(V.marcar(dintel, N.DOC, 'Dintel del corredor'));
    }

    // ---------- Vestíbulo abocinado: 11 ortostatos [DOC] ----------
    const gVest = grupo('vestibulo', N.DOC, 'Ortostato del vestíbulo');
    const altoVest = s => VE.altoInicio + (VE.altoFin - VE.altoInicio) * Math.min(1, Math.max(0, (s - VE.desde) / (VE.hasta - VE.desde)));
    linea(1, VE.norte, VE.desde, VE.hasta, altoVest, semiVest, 'vestibulo', gVest);
    linea(-1, VE.sur, VE.desde, VE.hasta, altoVest, semiVest, 'vestibulo', gVest, true);

    // ---------- Anillos de piedra del túmulo [DOC: «refuerzos y anillos de piedra»; posición: HIP] ----------
    const gAnillos = grupo('anillos', N.HIP, 'Anillos de contención del túmulo (posición hipotética)');
    {
      const gp = V.geoPiedra(9, 0), lista = [];
      const c = centroT(), a = TU.rumboEjeLargo * Math.PI / 180;
      for (const [e, alto, cuantos] of [[0.56, 1.2, 150], [0.985, 0.45, 260]]) {
        for (let i = 0; i < cuantos; i++) {
          const th = (i / cuantos) * Math.PI * 2;
          const L = Math.cos(th) * TU.ejeLargo / 2 * e, S = Math.sin(th) * TU.ejeCorto / 2 * e;
          const x = c.x + L * Math.sin(a) + S * Math.cos(a), y = c.y + L * Math.cos(a) - S * Math.sin(a);
          const { s, t } = V.enEje(x, y);
          if (enVestibulo(s, t, 0.4)) continue;
          for (let k = 0; k < Math.round(alto / 0.3); k++) lista.push([x + (r() - 0.5) * 0.15, y + (r() - 0.5) * 0.15, 0.12 + k * 0.28, 0.2 + r() * 0.1, e]);
        }
      }
      const im = new THREE.InstancedMesh(gp, matGranito, lista.length);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler();
      lista.forEach(([x, y, h, k], i) => { q.setFromEuler(eu.set(r(), r() * 3, r())); m4.compose(pos(x, y, h), q, new THREE.Vector3(k * 1.5, k, k * 1.2)); im.setMatrixAt(i, m4); });
      im.userData.lista = lista;
      gAnillos.add(im);
      gAnillos.userData.im = im;
    }

    // ---------- Molinos barquiformes reutilizados en el túmulo [DOC] ----------
    const gMol = grupo('molinos', N.DOC, 'Molinos barquiformes reutilizados en el túmulo');
    const molinos = [];
    for (const [s, t] of [[-4, 4.5], [-6.5, -3.2], [1.5, -5.5], [-2, 7.8]]) {
      const g = new THREE.SphereGeometry(1, 14, 6); g.scale(0.32, 0.1, 0.16);
      const p_ = g.attributes.position;
      for (let i = 0; i < p_.count; i++) if (p_.getY(i) > 0.04) p_.setY(i, 0.04 + (p_.getY(i) - 0.04) * 0.2);   // cara de moler cóncava y gastada
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, matGranito);
      const p = V.desdeEje(s, t);
      m.userData.xy = p; m.rotation.y = r() * 3;
      gMol.add(m); molinos.push(m);
    }

    // ---------- Ajuar ----------
    const matSilex = mat(new THREE.MeshLambertMaterial({ color: 0xc9b9a0 }));
    const matCalcedonia = mat(new THREE.MeshLambertMaterial({ color: 0xd8cfc0 }));
    const matPulido = mat(new THREE.MeshPhongMaterial({ color: 0x4f5a52, shininess: 40 }));
    const matVariscita = mat(new THREE.MeshPhongMaterial({ color: 0x3fae86, shininess: 60 }));
    const matCuenta2 = mat(new THREE.MeshPhongMaterial({ color: 0x9ec7a8, shininess: 40 }));
    const geoPunta = (() => { const s = new THREE.Shape(); s.moveTo(0, 0.035); s.lineTo(0.014, -0.012); s.lineTo(0.006, -0.02); s.lineTo(0, -0.014); s.lineTo(-0.006, -0.02); s.lineTo(-0.014, -0.012); s.closePath(); return new THREE.ExtrudeGeometry(s, { depth: 0.004, bevelEnabled: false }); })();
    const geoLamina = new THREE.BoxGeometry(0.018, 0.004, 0.11);
    const geoHacha = (() => { const g = new THREE.SphereGeometry(1, 10, 6); g.scale(0.035, 0.018, 0.075); return g; })();
    const geoCuenta = new THREE.TorusGeometry(0.008, 0.004, 5, 10);
    function ofrenda(destino, x, y, h, cuantas, semilla) {
      const q = V.semilla(semilla);
      const tipos = [[geoPunta, matSilex, -Math.PI / 2], [geoLamina, matCalcedonia, 0], [geoHacha, matPulido, 0], [geoCuenta, matVariscita, -Math.PI / 2], [geoCuenta, matCuenta2, -Math.PI / 2]];
      for (let i = 0; i < cuantas; i++) {
        const [g, m, rx] = tipos[i % tipos.length];
        const o = new THREE.Mesh(g, m);
        o.position.set(x + (q() - 0.5) * 0.35, h + 0.012, -(y + (q() - 0.5) * 0.35));
        o.rotation.set(rx, q() * 6, 0);
        destino.add(o);
      }
    }
    // Agrupaciones de piedras con material lítico sobre el suelo de la cámara (U.E. 80, 82, 83, 84 y 124) [DOC; posición: croquis]
    const gAgr = grupo('agrupaciones', N.DOC, 'Agrupaciones de piedras con ofrendas (U.E. 80-84 y 124)');
    {
      const gp = V.geoPiedra(13, 0);
      [[-0.85, 0.9], [0.2, 0.75], [-0.8, -0.6], [0.75, -0.15], [0.1, -0.95]].forEach(([x, y], j) => {
        for (let k = 0; k < 7; k++) {
          const m = new THREE.Mesh(gp, matGranito);
          const a = k / 7 * 6.28, rr = 0.12 + 0.12 * (k % 2);
          m.position.set(x + Math.cos(a) * rr, 0.07, -(y + Math.sin(a) * rr));
          m.scale.set(0.09 + r() * 0.05, 0.07, 0.08 + r() * 0.05);
          gAgr.add(m);
        }
        ofrenda(gAgr, x, y, 0.11, 6, 40 + j);
      });
    }
    // Depósito de cuencos pintados, puntas y cuentas junto al dintel (U.E. 61) [DOC]
    const gCuencos = grupo('cuencos', N.DOC, 'Cuencos con decoración pintada en negro (U.E. 61)');
    {
      const texCuenco = V.texturaCanvas(128, 32, (g, w, h) => {
        g.fillStyle = '#b06a42'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#1e1712'; g.lineWidth = 2.5;
        for (let i = 0; i < 10; i++) { g.beginPath(); g.arc(i * 13 + 6, 4, 6, 0.2, Math.PI - 0.2); g.stroke(); }   // pequeños trazos curvos junto al borde
      });
      const matCuenco = mat(new THREE.MeshLambertMaterial({ map: texCuenco, side: THREE.DoubleSide }));
      const gC = new THREE.SphereGeometry(0.07, 14, 6, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
      for (let i = 0; i < 4; i++) {
        const p = V.desdeEje(CO.hasta + 0.35 + (i % 2) * 0.2, 0.25 + Math.floor(i / 2) * 0.22 - 0.35);
        const c = new THREE.Mesh(gC, matCuenco);
        c.position.set(p.x, 0.075, -p.y);
        gCuencos.add(c);
      }
      const p = V.desdeEje(CO.hasta + 0.45, -0.3);
      ofrenda(gCuencos, p.x, p.y, 0.02, 8, 90);
    }

    // ---------- Clausura: losa de cierre, hoguera en el corredor y cierre de madera ----------
    const gCierre = grupo('losa-cierre', N.DOC, 'Ortostato de cierre de monzogranito (U.E. 77)');
    {
      const g = new THREE.CylinderGeometry(0.5, 0.5, 0.28, 18); g.scale(1, 1, 1);
      g.rotateX(Math.PI / 2); g.scale(1, 1.18, 1);
      const p = V.desdeEje(2.05, 0);
      const losa = new THREE.Mesh(g, matMonzo);
      losa.rotation.y = -D.rumboAcceso * Math.PI / 180;
      losa.position.set(p.x, 0.6, -p.y);
      gCierre.add(losa);
    }
    // Ceniza y carbones bajo la hoguera [DOC]
    const gCeniza = grupo('ceniza', N.DOC, 'Cenizas y carbones de la gran hoguera');
    {
      const pts = [];
      const q = V.semilla(3);
      for (let i = 0; i < 140; i++) { const p = V.desdeEje(2.3 + q() * 2.9, (q() - 0.5) * 0.85); pts.push([p.x, p.y]); }
      // capa de ceniza gris con carbones negros a lo largo del corredor
      const texCeniza = V.texturaCanvas(64, 256, (g, w, h) => {
        g.fillStyle = '#6d6862'; g.fillRect(0, 0, w, h);
        const q2 = V.semilla(8);
        for (let i = 0; i < 260; i++) { g.fillStyle = q2() < 0.55 ? 'rgba(25,22,20,0.85)' : 'rgba(160,155,150,0.5)'; g.fillRect(q2() * w, q2() * h, 1 + q2() * 4, 1 + q2() * 3); }
      });
      const cen = new THREE.Mesh(new THREE.PlaneGeometry(CO.ancho - 0.06, CO.hasta - 2.2), mat(new THREE.MeshLambertMaterial({ map: texCeniza })));
      const pc = V.desdeEje((2.2 + CO.hasta) / 2, 0);
      cen.rotation.order = 'YXZ'; cen.rotation.set(-Math.PI / 2, -D.rumboAcceso * Math.PI / 180, 0);
      cen.position.set(pc.x, 0.045, -pc.y);
      gCeniza.add(cen);
      const p = V.desdeEje(3.0, 0.1);
      ofrenda(gCeniza, p.x, p.y, 0.04, 9, 77);
    }
    // Fuego: llamas animadas, brasas, humo y luz [la hoguera está DOC; su aspecto, HIP]
    const gFuego = grupo('fuego', N.HIP, 'Hoguera ritual (aspecto hipotético)');
    const llamas = [], humos = [];
    {
      const texLlama = V.texturaCanvas(64, 128, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h * 0.7, 2, w / 2, h * 0.62, w * 0.55);
        gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(0.35, 'rgba(255,170,50,0.9)'); gr.addColorStop(1, 'rgba(200,40,0,0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(w / 2, h * 0.62, w * 0.45, h * 0.45, 0, 0, 7); g.fill();
      });
      const texHumo = V.texturaCanvas(64, 64, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
        gr.addColorStop(0, 'rgba(120,115,110,0.55)'); gr.addColorStop(1, 'rgba(120,115,110,0)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      });
      for (let i = 0; i < 16; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texLlama, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        const p = V.desdeEje(2.35 + (i % 8) * 0.32, ((i * 0.37) % 0.6) - 0.3);
        s.userData = { base: new THREE.Vector3(p.x, 0.25, -p.y), fase: i * 1.7, alto: 0.35 + (i % 3) * 0.12 * (1 - (i % 8) / 10) };
        gFuego.add(s); llamas.push(s);
      }
      for (let i = 0; i < 22; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texHumo, depthWrite: false, transparent: true, opacity: 0.7 }));
        s.userData = { fase: i / 22 };
        gFuego.add(s); humos.push(s);
      }
      const luz = new THREE.PointLight(0xff9a3c, 2.4, 9, 1.6);
      const p = V.desdeEje(3.0, 0); luz.position.set(p.x, 0.6, -p.y);
      gFuego.add(luz); gFuego.userData.luz = luz;
    }
    // Cierre de madera de la boca del corredor antes de rellenar el vestíbulo [DED en el informe]
    const gMadera = grupo('cierre-madera', N.DED, 'Cierre de madera de la boca del corredor');
    for (let i = 0; i < 5; i++) {
      const p = V.desdeEje(CO.hasta + 0.02, -0.5 + i * 0.25);
      const tabla = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.0, 0.06), V.mat(0x7a5634));
      tabla.rotation.y = -D.rumboAcceso * Math.PI / 180; tabla.rotation.z = (r() - 0.5) * 0.06;
      tabla.position.set(p.x, 0.48, -p.y);
      gMadera.add(tabla);
    }

    // ---------- Obra en marcha (construcción) [HIP: técnicas deducidas de otros megalitos] ----------
    const gObra = grupo('obra', N.HIP, 'Trineo, rodillos y palancas (técnica hipotética)');
    {
      const madera = V.mat(0x7a5a3a);
      const tronco = (largo, rad) => new THREE.CylinderGeometry(rad, rad * 1.1, largo, 7);
      // Trineo de madera sobre rodillos con una laja de cubierta, junto al vestíbulo
      const base = V.desdeEje(12.8, 2.6);
      const trineo = new THREE.Group();
      for (const t of [-0.45, 0.45]) { const v = new THREE.Mesh(tronco(2.4, 0.08), madera); v.rotation.x = Math.PI / 2; v.position.set(t, 0.32, 0); trineo.add(v); }
      for (let i = 0; i < 5; i++) { const ro = new THREE.Mesh(tronco(1.4, 0.11), madera); ro.rotation.z = Math.PI / 2; ro.position.set(0, 0.11, -1.4 + i * 0.7); trineo.add(ro); }
      const laja = new THREE.Mesh(V.losa(1.3, 0.24, 1.9, 404, 0), matGranito); laja.position.y = 0.4; trineo.add(laja);
      trineo.position.set(base.x, V.alturaNatural(base.x, base.y), -base.y);
      trineo.rotation.y = -D.rumboAcceso * Math.PI / 180;
      gObra.add(trineo);
      // Palancas apoyadas en la cámara y montón de lajas preparadas
      for (const [rb, inc] of [[200, 0.5], [320, 0.6]]) {
        const d = V.dir(rb);
        const pa = new THREE.Mesh(tronco(3, 0.06), madera);
        pa.position.set(d.x * 2.9, 1.0, -d.y * 2.9);
        pa.rotation.order = 'YXZ'; pa.rotation.set(inc, -rb * Math.PI / 180, 0);
        gObra.add(pa);
      }
      const monton = V.desdeEje(-1, -7.5);
      for (let i = 0; i < 5; i++) {
        const l = new THREE.Mesh(V.losa(1.1 + r() * 0.4, 0.2, 1.0 + r() * 0.3, 500 + i, 0), matGranito);
        l.position.set(monton.x + (r() - 0.5) * 0.3, 1.25 + 0.21 * i, -monton.y + (r() - 0.5) * 0.3);
        l.rotation.y = r() * 3;
        gObra.add(l);
      }
      // Bloques recién partidos en la lancha de granito cercana (posible cantera) [DED]
      for (let i = 0; i < 4; i++) {
        const b = new THREE.Mesh(V.losa(1.2, 0.5, 0.6, 600 + i, 0.05), matGranito);
        b.position.set(-15 + i * 1.4, 0.05, -(16 + (i % 2) * 1.2)); b.rotation.set(0, r() * 2, Math.PI / 2 * (i % 2));
        gObra.add(b);
      }
    }
    [raiz].forEach(sombra);

    // ---------- Momentos ----------
    const estado = { momento: 'uso', corte: false, resaltar: false };
    const visibles = {
      construccion: ['tumulo', 'camara', 'calzos', 'suelo-camara', 'cubierta', 'corredor', 'cubierta-corredor', 'vestibulo', 'anillos', 'molinos', 'obra'],
      uso: ['tumulo', 'paredes-vestibulo', 'camara', 'calzos', 'suelo-camara', 'cubierta', 'corredor', 'cubierta-corredor', 'vestibulo', 'agrupaciones'],
      'sellado-fuego': ['tumulo', 'paredes-vestibulo', 'camara', 'calzos', 'suelo-camara', 'cubierta', 'corredor', 'cubierta-corredor', 'vestibulo', 'agrupaciones', 'losa-cierre', 'ceniza', 'fuego', 'cuencos'],
      'sellado-relleno': ['tumulo', 'camara', 'calzos', 'suelo-camara', 'cubierta', 'corredor', 'cubierta-corredor', 'vestibulo', 'agrupaciones', 'losa-cierre', 'ceniza', 'cuencos', 'cierre-madera'],
      hoy: ['tumulo', 'camara', 'calzos', 'suelo-camara', 'corredor', 'cubierta-corredor', 'vestibulo', 'anillos', 'molinos'],
    };

    function actualizarTumulo(m) {
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
        const k = j * (nx + 1) + i, x = X0 + i * P0, y = Y0 + j * P0;
        const h = hMomento(x, y, m);
        posT[k * 3 + 1] = h === null ? V.alturaNatural(x, y) - 0.3 : Math.max(h, V.alturaNatural(x, y) - 0.06);
        // tono: más claro donde está el relleno nuevo del vestíbulo; polvoriento hoy
        let cr = 1, cg = 1, cb = 1;
        const { s, t } = V.enEje(x, y);
        if (m === 'sellado-relleno' && enVestibulo(s, t, 0.3)) { cr = 1.05; cg = 0.9; cb = 0.74; }
        if (m === 'hoy') { cr = 0.95; cg = 0.92; cb = 0.86; }
        if (m === 'construccion' && eTumulo(x, y) > 0.56) { cr = 0.9; cg = 0.88; cb = 0.82; }
        colT[k * 3] = cr; colT[k * 3 + 1] = cg; colT[k * 3 + 2] = cb;
      }
      gT.setIndex(indicesTumulo(m));
      gT.attributes.position.needsUpdate = true; gT.attributes.color.needsUpdate = true;
      gT.computeVertexNormals();
      gT.computeBoundingSphere();
      // molinos sobre la superficie
      molinos.forEach(o => { const h = hMomento(o.userData.xy.x, o.userData.xy.y, m); o.position.set(o.userData.xy.x, (h || 0) + 0.06, -o.userData.xy.y); });
    }

    function texturasGrabados() {
      const modo = estado.resaltar ? 'resaltado' : estado.momento === 'hoy' ? 'gastado' : 'fresco';
      for (const id in ortostatos) {
        const o = ortostatos[id], l = o.userData.losa;
        if (!V.grabados[id]) continue;
        const alto = id === 'acceso' ? l.alto : l.alto + 0.25;
        o.material[4].map = V.texturaOrtostato(id, l.ancho, alto, modo);
        o.material[4].needsUpdate = true;
      }
    }

    function aplicar() {
      const m = estado.momento;
      for (const n in grupos) grupos[n].visible = visibles[m].includes(n);
      // cubierta de la cámara: en construcción solo las dos primeras hiladas; hoy, derrumbada y retirada
      gCub.children.forEach(o => { o.visible = m !== 'construccion' || o.userData.estado <= 1; });
      losasCubCorr.forEach(o => { o.visible = m !== 'construccion' || o.userData.orden < 2; });
      // anillos: en construcción, a la vista; hoy, solo asoma el exterior
      const im = gAnillos.userData.im;
      if (im) {
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p = new THREE.Vector3();
        im.userData.lista.forEach(([x, y, h, k, en], i) => {
          const ver = m === 'construccion' || (m === 'hoy' && en > 0.9 && h < 0.4);
          const q2 = V.semilla(i + 1);
          q.setFromEuler(e.set(q2(), q2() * 3, q2()));
          m4.compose(p.set(x, (m === 'hoy' ? 0.6 * (hLleno(x, y) || 0) - 0.1 : 0) + h, -y), q, ver ? sc.set(k * 1.5, k, k * 1.2) : sc.set(0, 0, 0));
          im.setMatrixAt(i, m4);
        });
        im.instanceMatrix.needsUpdate = true;
      }
      actualizarTumulo(m);
      if (estado.corte) construirTapa(m);
      tapa.visible = estado.corte;
      texturasGrabados();
      ctx.paisaje && ctx.paisaje.fijarMomento(m);
      ctx.pedirRender();
    }

    ctx.dolmen = {
      fijarMomento(m) { estado.momento = m; aplicar(); },
      momento: () => estado.momento,
      corte(on) {
        estado.corte = on;
        materialesCorte.forEach(mt => { mt.clippingPlanes = on ? corte : null; mt.clipShadows = on; mt.needsUpdate = true; });
        if (on) construirTapa(estado.momento);
        tapa.visible = on;
        ctx.pedirRender();
      },
      resaltarGrabados(on) { estado.resaltar = on; texturasGrabados(); ctx.pedirRender(); },
      grabadoDe: id => ortostatos[id],
    };

    // Animación del fuego (solo si se ve)
    let tiempo = 0;
    ctx.animadores.push(dt => {
      if (!gFuego.visible || ctx.animando === false) return false;
      tiempo += dt;
      llamas.forEach(s => {
        const u = s.userData, f = 0.75 + 0.25 * Math.sin(tiempo * 9 + u.fase) * Math.sin(tiempo * 5.3 + u.fase * 2);
        s.position.copy(u.base); s.position.y = 0.06 + u.alto * f * 0.5;
        s.scale.set(0.34 * f, u.alto * 1.6 * f, 1);
      });
      humos.forEach(s => {
        const ph = (s.userData.fase + tiempo * 0.12) % 1;
        // el humo sale por el corredor y sube desde el vestíbulo
        const sx = 3 + ph * 5.5, p = V.desdeEje(sx, Math.sin(ph * 9 + s.userData.fase * 20) * 0.3);
        const alto = ph < 0.4 ? 0.85 : 0.85 + (ph - 0.4) * 9;
        s.position.set(p.x, alto, -p.y);
        const k = 0.5 + ph * 2.6; s.scale.set(k, k, 1);
        s.material.opacity = 0.6 * (1 - ph) * V.paso(0, 0.1, ph);
      });
      gFuego.userData.luz.intensity = 2.0 + 0.7 * Math.sin(tiempo * 13) * Math.sin(tiempo * 7.1);
      return true;
    });

    // ---------- Paseo: suelo, zonas y altura de los ojos ----------
    function zona(x, y) {
      const m = estado.momento, { s, t } = V.enEje(x, y), rr = Math.hypot(x, y);
      const camaraAbierta = m !== 'sellado-fuego' && m !== 'sellado-relleno';
      const corredorAbierto = m === 'uso' || m === 'hoy' || m === 'construccion';
      const vestAbierto = m !== 'sellado-relleno';
      if (camaraAbierta && rr < 1.72) return 'camara';
      if (corredorAbierto && s > 1.55 && s < CO.hasta + 0.1 && Math.abs(t) < 0.34) return 'corredor';
      if (vestAbierto && s > CO.hasta - 0.05 && s < 12 && Math.abs(t) < semiVest(s) - 0.12 && eTumulo(x, y) < 1) return 'vestibulo';
      if (eTumulo(x, y) < 1) return 'tumulo';
      return 'fuera';
    }
    const INTERIOR = ['camara', 'corredor', 'vestibulo'];
    V.puedePasar = function (x0, y0, x1, y1) {
      const a = zona(x0, y0), b = zona(x1, y1);
      if (a === b) return true;
      const ia = INTERIOR.includes(a), ib = INTERIOR.includes(b);
      if (ia && ib) return !((a === 'camara' && b === 'vestibulo') || (a === 'vestibulo' && b === 'camara'));
      if (ia || ib) return (a === 'vestibulo' && b === 'fuera') || (a === 'fuera' && b === 'vestibulo');
      return true;
    };
    V.sueloPaseo = function (x, y) {
      const z = zona(x, y);
      if (INTERIOR.includes(z)) return 0.03;
      if (z === 'tumulo') { const h = hMomento(x, y, estado.momento); return h === null ? V.alturaNatural(x, y) : Math.max(h, 0); }
      return V.alturaNatural(x, y);
    };
    V.ojosPaseo = function (x, y) {
      const z = zona(x, y), m = estado.momento, { s } = V.enEje(x, y);
      if (z === 'corredor') return Math.min(1.6, altoCorr(s) - 0.16);
      if (z === 'camara' && (m === 'uso')) return 1.45;
      return 1.6;
    };
    V.cubierto = function (x, y) {   // ¿bajo techo de piedra? (para la antorcha)
      const z = zona(x, y), m = estado.momento;
      return (z === 'camara' && m === 'uso') || (z === 'corredor' && m !== 'construccion');
    };

    aplicar();
  };
})(window.MOINA);
