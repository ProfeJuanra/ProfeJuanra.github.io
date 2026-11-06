// Fase a: vegetación del Calcolítico, deducida por paralelos regionales.
// Encinar y alcornocal aclarados, matorral de jara y retama, y bosque de ribera.
// Excluidos por anacronismo: eucalipto, pino de repoblación y especies americanas.
(function (V) {
  'use strict';
  const N = V.NIVEL;

  function enCampo(ctx, x, y, margen) {
    for (const c of ctx.campos) {
      const dx = x - c.cx, dy = y - c.cy;
      const ca = Math.cos(-c.giro), sa = Math.sin(-c.giro);
      const lx = dx * ca - dy * sa, ly = dx * sa + dy * ca;
      if (Math.abs(lx) < c.ancho / 2 + margen && Math.abs(ly) < c.largo / 2 + margen) return true;
    }
    return false;
  }

  // Coloca instancias según una regla de aceptación
  // zona: null = entorno cercano (900 m); 'lejos' = resto del relieve del IGN
  function sembrar(ctx, cantidad, intentos, acepta, zona) {
    const r = V.azar, lista = [], L = V.LIMITES;
    for (let i = 0; i < intentos && lista.length < cantidad; i++) {
      let x, y;
      if (zona === 'lejos') {
        x = L.x0 + 150 + r() * (L.x1 - L.x0 - 300); y = L.y0 + 150 + r() * (L.y1 - L.y0 - 300);
        if (x > -430 && x < 430 && y > -470 && y < 410) continue;
      } else { x = (r() * 2 - 1) * 430; y = -470 + r() * 880; }
      if (enCampo(ctx, x, y, 4)) continue;
      if (V.distRio(x, y) < 12) continue;                          // nunca dentro del cauce
      if (V.DOLMEN && Math.hypot(x - V.DOLMEN.x, y - V.DOLMEN.y) < 50) continue;   // claro del dolmen
      const p = acepta(x, y, r());
      if (p) lista.push({ x, y, s: p });
    }
    return lista;
  }

  // Árbol low-poly: tronco + copa, como dos InstancedMesh con la misma colocación
  function arboleda(ctx, puntos, def) {
    const gTronco = new THREE.CylinderGeometry(def.tronco[0] * 0.7, def.tronco[0], def.tronco[1], 5, 1, true);
    gTronco.translate(0, def.tronco[1] / 2, 0);
    // Copa formada por tres volúmenes irregulares (silueta más natural que una sola esfera)
    const gCopa = (function () {
      const partes = [[0, 0, 0, 1], [0.45, -0.15, 0.25, 0.7], [-0.4, -0.1, -0.3, 0.72]];
      const pos = [];
      partes.forEach(([dx, dy, dz, s], n) => {
        const g = new THREE.IcosahedronGeometry(1, 0).toNonIndexed();
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          const k = 1 + 0.12 * Math.sin(x * 5 + n) * Math.cos(z * 4 - n);
          pos.push(dx + x * s * k, dy + y * s * k * 0.9, dz + z * s * k);
        }
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      return g;
    })();
    const mT = new THREE.InstancedMesh(gTronco, V.mat(def.colorTronco, { flatShading: true }), puntos.length);
    const mC = new THREE.InstancedMesh(gCopa, V.mat(0xffffff, { flatShading: true }), puntos.length);  // el color va en cada instancia
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const col = new THREE.Color();
    puntos.forEach((pt, i) => {
      const h = V.alturaSuelo(pt.x, pt.y);
      const k = pt.s;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (pt.x * 7 + pt.y * 3) % 6.28);
      m4.compose(p.set(pt.x, h - 0.1, -pt.y), q, s.set(k, k, k));
      mT.setMatrixAt(i, m4);
      const [rx, ry, rz] = def.copa;
      m4.compose(p.set(pt.x, h + def.tronco[1] * k + ry * k * 0.55, -pt.y), q, s.set(rx * k, ry * k, rz * k));
      mC.setMatrixAt(i, m4);
      col.set(def.colorCopa).offsetHSL(0, 0, (V.fbm(pt.x / 5, pt.y / 5)) * 0.06);
      mC.setColorAt(i, col);
    });
    [mT, mC].forEach(m => { m.castShadow = true; m.receiveShadow = false; ctx.scene.add(V.marcar(m, N.DED, def.etiqueta)); });
    return [mT, mC];
  }

  V.construirVegetacion = function (ctx) {
    const f = ctx.calidad === 'baja' ? 0.5 : 1;
    const P = V.paso;

    // Encinas: dominan lejos del poblado; claros abiertos alrededor
    const encinas = sembrar(ctx, Math.round(560 * f), 40000, (x, y, r) => {
      const d = Math.hypot(x, y - 10);
      if (V.distRio(x, y) < 40 || d < 70) return 0;
      const dens = 0.15 + 0.7 * P(90, 260, d) + 0.25 * V.fbm(x / 60, y / 60);
      return r < dens ? 0.8 + 0.5 * V.azar() : 0;
    });
    arboleda(ctx, encinas, { tronco: [0.28, 1.8], copa: [3.2, 2.4, 3.2], colorTronco: 0x6a5642, colorCopa: 0x66773f, etiqueta: 'Encinar' });

    // Alcornoques: mezclados, algo más abiertos
    const alcornoques = sembrar(ctx, Math.round(220 * f), 30000, (x, y, r) => {
      const d = Math.hypot(x, y - 10);
      if (V.distRio(x, y) < 45 || d < 85) return 0;
      return r < 0.25 + 0.4 * P(110, 300, d) ? 0.9 + 0.4 * V.azar() : 0;
    });
    arboleda(ctx, alcornoques, { tronco: [0.33, 2.2], copa: [3.6, 2.6, 3.6], colorTronco: 0x5a4532, colorCopa: 0x75854a, etiqueta: 'Alcornocal' });

    // Bosque de ribera: fresnos, alisos, sauces y álamos blancos junto al río y en la vaguada
    const ribera = sembrar(ctx, Math.round(420 * f), 40000, (x, y, r) => {
      const ok = y < -40 && y > -160 && Math.abs(x - V.ejeVaguada(y)) < 9;   // vaguada
      return ok && r < 0.85 ? 0.8 + 0.6 * V.azar() : 0;
    });
    arboleda(ctx, ribera, { tronco: [0.25, 3.6], copa: [2.4, 4.2, 2.4], colorTronco: 0x6b6252, colorCopa: 0x7f9a4c, etiqueta: 'Bosque de ribera' });

    // Lejos del poblado (relieve del IGN): ribera a lo largo del Tajo y encinar disperso en el valle
    const riberaTajo = sembrar(ctx, Math.round(450 * f), 60000, (x, y, r) => {
      const dr = V.distRio(x, y);
      return dr > 12 && dr < 80 && r < 0.9 ? 0.9 + 0.6 * V.azar() : 0;
    }, 'lejos');
    arboleda(ctx, riberaTajo, { tronco: [0.25, 3.6], copa: [2.4, 4.2, 2.4], colorTronco: 0x6b6252, colorCopa: 0x7f9a4c, etiqueta: 'Bosque de ribera del Tajo' });
    const encinasLejos = sembrar(ctx, Math.round(380 * f), 60000, (x, y, r) => {
      if (V.distRio(x, y) < 70) return 0;
      return r < 0.12 + 0.35 * (0.5 + 0.5 * V.fbm(x / 150, y / 150)) ? 0.9 + 0.5 * V.azar() : 0;
    }, 'lejos');
    arboleda(ctx, encinasLejos, { tronco: [0.28, 1.8], copa: [3.2, 2.4, 3.2], colorTronco: 0x6a5642, colorCopa: 0x66773f, etiqueta: 'Encinar' });

    // Matorral de jara y retama en los bordes de los claros
    const mato = sembrar(ctx, Math.round(650 * f), 40000, (x, y, r) => {
      const d = Math.hypot(x, y - 10);
      if (V.distRio(x, y) < 30 || d < 48) return 0;
      return r < 0.2 + 0.5 * (1 - Math.abs(P(70, 200, d) - 0.5) * 2) ? 0.5 + 0.6 * V.azar() : 0;
    });
    const gMato = new THREE.IcosahedronGeometry(0.9, 0);
    gMato.scale(1, 0.6, 1);
    const mMato = new THREE.InstancedMesh(gMato, V.mat(0xffffff, { flatShading: true }), mato.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const col = new THREE.Color();
    mato.forEach((pt, i) => {
      m4.compose(p.set(pt.x, V.alturaSuelo(pt.x, pt.y) + 0.3 * pt.s, -pt.y), q, s.setScalar(pt.s));
      mMato.setMatrixAt(i, m4);
      col.set(i % 3 ? 0x6f7a4a : 0x9a9850);   // jara (verde oscuro) y retama (verde amarillento)
      mMato.setColorAt(i, col);
    });
    ctx.scene.add(V.marcar(mMato, N.DED, 'Matorral de jara y retama'));

    // Una encina aislada que da sombra cerca del poblado: hipótesis (manchas 4 y 9 = posibles huellas de árbol)
    arboleda(ctx, [{ x: -30, y: 33, s: 1.1 }], { tronco: [0.32, 2.0], copa: [3.4, 2.5, 3.4], colorTronco: 0x6a5642, colorCopa: 0x66773f, etiqueta: 'Encina aislada' })
      .forEach(m => { m.userData.nivel = N.HIP; });
  };
})(window.VALDE);
