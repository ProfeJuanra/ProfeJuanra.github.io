// Fases b y c: zanja de drenaje, silos, hoyos y hogar.
// Medidas y posiciones de src/datos/estructuras.js (informe de 2008 y plano CAD).
(function (V) {
  'use strict';
  const N = V.NIVEL;
  const EROSION = 0.3;   // suelo perdido por erosión (hipótesis común a todas las estructuras)

  const q = new THREE.Quaternion(), m4 = new THREE.Matrix4(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3(), e3 = new THREE.Euler();

  // ---------- Fase b: zanja ----------
  function construirZanja(ctx) {
    const z = V.plano.zanja;
    // Cantos rodados en el fondo de la zanja (concentraciones documentadas, en parte intencionadas)
    const n = ctx.calidad === 'baja' ? 160 : 320;
    const g = new THREE.DodecahedronGeometry(0.11, 0);
    const im = new THREE.InstancedMesh(g, V.mat(0xffffff, { flatShading: true }), n);
    const col = new THREE.Color();
    const r = V.azar;
    for (let i = 0; i < n; i++) {
      // punto a lo largo del eje, con preferencia por el tramo sur (estr. 32)
      const t = Math.pow(r(), 0.7);
      const seg = t * (z.eje.length - 1);
      const k = Math.min(z.eje.length - 2, Math.floor(seg)), u = seg - k;
      const [ax, ay] = z.eje[k], [bx, by] = z.eje[k + 1];
      const nx = -(by - ay), ny = bx - ax, nl = Math.hypot(nx, ny);
      const off = (r() - 0.5) * z.ancho * 0.55;
      const x = ax + (bx - ax) * u + nx / nl * off, y = ay + (by - ay) * u + ny / nl * off;
      const esc = 0.6 + r() * 1.1;
      q.setFromEuler(e3.set(r() * 3, r() * 3, r() * 3));
      m4.compose(p3.set(x, V.alturaSitio(x, y) + 0.04, -y), q, s3.set(esc, esc * 0.7, esc));
      im.setMatrixAt(i, m4);
      im.setColorAt(i, col.setHSL(0.09, 0.08 + r() * 0.1, 0.45 + r() * 0.2));
    }
    im.castShadow = true;
    im.name = 'cantos-zanja';
    ctx.scene.add(V.marcar(im, N.DOC, 'Cantos rodados de la zanja'));
  }

  // ---------- Fase c: silos, hoyos y hogar ----------
  const MAT = {
    arcilla: 0x9c7b55, arcillaOsc: 0x6e5238, interior: 0x8a6a4a, relleno: 0x5b4734,
    pizarra: 0x5d6168, canto: 0x9a9182, adobe: 0x8e6a48, ceniza: 0x4a4440,
    vasija: 0x8a5a3a,           // cocción oxidante (70 % de la cerámica)
  };

  function mallaMarcada(ctx, geo, color, nivel, etiqueta, opts) {
    const m = new THREE.Mesh(geo, V.mat(color, Object.assign({ flatShading: true }, opts || {})));
    m.castShadow = true; m.receiveShadow = true;
    ctx.scene.add(V.marcar(m, nivel, etiqueta));
    return m;
  }

  function radioBoca(D) { return Math.min(0.42, Math.max(0.24, D * 0.3)); }

  // Silo en uso, cerrado: boca sellada con barro, una laja y cantos (cierre deducido)
  function siloCerrado(ctx, e) {
    const h = V.alturaSitio(e.x, e.y);
    const rb = radioBoca(e.diametro);
    const anillo = mallaMarcada(ctx, new THREE.CylinderGeometry(rb + 0.35, rb + 0.45, 0.06, 18), MAT.arcillaOsc, N.DOC, 'Silo ' + e.id + ' (posición y tamaño documentados)');
    anillo.position.set(e.x, h + 0.01, -e.y);
    const tapa = mallaMarcada(ctx, new THREE.SphereGeometry(rb + 0.12, 12, 5, 0, Math.PI * 2, 0, Math.PI / 2), MAT.arcilla, N.DED, 'Tapa de barro del silo ' + e.id);
    tapa.scale.y = 0.35;
    tapa.position.set(e.x, h + 0.03, -e.y);
    const r = V.azar;
    const laja = mallaMarcada(ctx, new THREE.BoxGeometry(rb * 1.5, 0.045, rb * 1.1), MAT.pizarra, N.DED, 'Laja sobre la tapa');
    laja.position.set(e.x + (r() - 0.5) * 0.1, h + 0.03 + (rb + 0.12) * 0.35, -e.y);
    laja.rotation.set((r() - 0.5) * 0.15, r() * 3, (r() - 0.5) * 0.15);
    for (let i = 0; i < 3; i++) {
      const c = mallaMarcada(ctx, new THREE.DodecahedronGeometry(0.07 + r() * 0.05, 0), MAT.canto, N.DED, 'Cantos de sujeción');
      const a = r() * Math.PI * 2;
      c.position.set(e.x + Math.cos(a) * (rb + 0.1), h + 0.08, -e.y + Math.sin(a) * (rb + 0.1));
    }
  }

  // Silo abierto: se ve el interior acampanado con cama de lajas y cantos y una gran vasija (estr. 22 y 33)
  function siloAbierto(ctx, e) {
    const h = V.alturaSitio(e.x, e.y);
    const D = e.diametro, rb = radioBoca(D) + 0.06;
    const prof = (e.profundidad || 1.0) + EROSION;
    const perfil = [
      new THREE.Vector2(0.001, -prof), new THREE.Vector2(D / 2 * 0.95, -prof + 0.03),
      new THREE.Vector2(D / 2, -prof * 0.55), new THREE.Vector2(rb * 1.15, -0.18),
      new THREE.Vector2(rb, 0.01),
    ];
    const gInt = new THREE.LatheGeometry(perfil, 20);
    // Más oscuro cuanto más hondo (sin luz directa dentro del silo)
    const pi = gInt.attributes.position, ci = new Float32Array(pi.count * 3), cc = new THREE.Color();
    for (let i = 0; i < pi.count; i++) {
      const t = Math.min(1, Math.max(0, -pi.getY(i) / prof));
      cc.set(MAT.interior).multiplyScalar(1 - 0.65 * Math.pow(t, 0.7));
      ci[i * 3] = cc.r; ci[i * 3 + 1] = cc.g; ci[i * 3 + 2] = cc.b;
    }
    gInt.setAttribute('color', new THREE.BufferAttribute(ci, 3));
    const interior = new THREE.Mesh(gInt, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }));
    interior.position.set(e.x, h, -e.y);
    interior.renderOrder = -2;
    ctx.scene.add(V.marcar(interior, N.DOC, 'Interior acampanado del silo ' + e.id));
    const grupo = new THREE.Group();
    grupo.position.copy(interior.position);
    ctx.scene.add(grupo);
    const r = V.azar;
    // Cama de lajas de pizarra y cantos rodados en el fondo (documentada)
    for (let i = 0; i < 7; i++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.28 + r() * 0.15, 0.04, 0.2 + r() * 0.12), V.mat(MAT.pizarra, { flatShading: true }));
      const a = r() * Math.PI * 2, d = r() * D * 0.33;
      l.position.set(Math.cos(a) * d, -prof + 0.03, Math.sin(a) * d);
      l.rotation.y = r() * 3;
      l.renderOrder = -2;
      grupo.add(V.marcar(l, N.DOC, 'Lajas del fondo del silo'));
    }
    // Gran vasija de almacén, de tendencia globular, hecha a mano
    const vp = [];
    const H = 0.78, R = Math.min(0.34, D * 0.24);
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const rad = (t < 0.85 ? R * Math.sin(Math.PI * (0.12 + 0.8 * t)) : R * 0.55) + 0.02;
      vp.push(new THREE.Vector2(Math.max(0.05, rad), t * H));
    }
    const vasija = new THREE.Mesh(new THREE.LatheGeometry(vp, 14), V.mat(MAT.vasija, { side: THREE.DoubleSide }));
    vasija.position.set(D * 0.08, -prof + 0.05, 0);
    vasija.renderOrder = -2;
    grupo.add(V.marcar(vasija, N.DOC, 'Gran vasija de almacén'));
    // Máscara invisible: abre el «agujero» en el suelo
    const mascara = new THREE.Mesh(new THREE.CircleGeometry(rb, 24), new THREE.MeshBasicMaterial({ colorWrite: false }));
    mascara.rotation.x = -Math.PI / 2;
    mascara.position.set(e.x, h + 0.012, -e.y);
    mascara.renderOrder = -1;
    ctx.scene.add(mascara);
    ctx.mascaras = (ctx.mascaras || []).concat(mascara);
    // Borde de barro y la tapa apoyada al lado
    const borde = mallaMarcada(ctx, new THREE.RingGeometry(rb, rb + 0.32, 20), MAT.arcillaOsc, N.DOC, 'Boca del silo ' + e.id, { side: THREE.DoubleSide });
    borde.rotation.x = -Math.PI / 2;
    borde.position.set(e.x, h + 0.015, -e.y);
    const tapa = mallaMarcada(ctx, new THREE.CylinderGeometry(rb + 0.02, rb + 0.06, 0.08, 14), MAT.arcilla, N.DED, 'Tapa retirada');
    tapa.rotation.z = 0.25;
    tapa.position.set(e.x + rb + 0.75, h + 0.12, -e.y);
    ctx.silosAbiertos = (ctx.silosAbiertos || []).concat({ id: e.id, x: e.x, y: e.y });
  }

  // Hoyo ya relleno (basurero colmatado): mancha de tierra oscura algo abombada
  function hoyoRelleno(ctx, e) {
    const h = V.alturaSitio(e.x, e.y);
    const m = mallaMarcada(ctx, new THREE.SphereGeometry(e.diametro / 2, 14, 4, 0, Math.PI * 2, 0, Math.PI / 2), MAT.relleno, N.DOC, 'Hoyo ' + e.id + ' ya relleno');
    m.scale.y = 0.08;
    m.position.set(e.x, h - 0.01, -e.y);
    m.castShadow = false;
  }

  // Hogar 11/4: círculo de adobes al aire libre (documentado), con cenizas (deducidas)
  function hogar(ctx, e) {
    const h = V.alturaSitio(e.x, e.y);
    const R = e.diametro / 2 - 0.12;
    const n = 16;
    const g = new THREE.BoxGeometry(0.34, 0.12, 0.2);
    const im = new THREE.InstancedMesh(g, V.mat(MAT.adobe, { flatShading: true }), n);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a + Math.PI / 2);
      m4.compose(p3.set(e.x + Math.cos(a) * R, h + 0.03, -e.y + Math.sin(a) * R), q, s3.set(1, 1, 1));
      im.setMatrixAt(i, m4);
    }
    im.castShadow = true; im.receiveShadow = true;
    ctx.scene.add(V.marcar(im, N.DOC, 'Hogar de adobes 11/4'));
    const ceniza = mallaMarcada(ctx, new THREE.CircleGeometry(R - 0.1, 20), MAT.ceniza, N.DED, 'Cenizas del hogar');
    ceniza.rotation.x = -Math.PI / 2;
    ceniza.position.set(e.x, h + 0.02, -e.y);
    ctx.hogar = { x: e.x, y: e.y, h: h };
  }

  V.construirSilos = function (ctx) {
    for (const e of V.plano.estructuras) {
      if (e.tipo === 'hogar') hogar(ctx, e);
      else if (e.estado === 'uso' && (e.id === '22' || e.id === '33')) siloAbierto(ctx, e);
      else if (e.estado === 'uso') siloCerrado(ctx, e);
      else hoyoRelleno(ctx, e);
    }
  };

  V.construirEstructuras = function (ctx) {
    construirZanja(ctx);
    V.construirSilos(ctx);
  };
})(window.VALDE);
