// Fase a: relieve, río, campos, horizonte y cielo.
(function (V) {
  'use strict';
  const N = V.NIVEL;

  // Malla de relieve que sigue una función de altura, con colores por vértice
  const tmp = new THREE.Color();
  function mallaRelieve(x0, x1, y0, y1, paso, fAltura, fColor, bajar) {
    const nx = Math.round((x1 - x0) / paso), ny = Math.round((y1 - y0) / paso);
    const pos = new Float32Array((nx + 1) * (ny + 1) * 3);
    const col = new Float32Array((nx + 1) * (ny + 1) * 3);
    let k = 0;
    for (let j = 0; j <= ny; j++) {
      const y = y1 - (j / ny) * (y1 - y0);
      for (let i = 0; i <= nx; i++) {
        const x = x0 + (i / nx) * (x1 - x0);
        let h = fAltura(x, y);
        if (bajar) h -= bajar(x, y);
        pos[k] = x; pos[k + 1] = h; pos[k + 2] = -y;
        const c = fColor(x, y, h);
        tmp.setRGB(c[0], c[1], c[2]).convertSRGBToLinear();   // colores pensados en sRGB
        col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b;
        k += 3;
      }
    }
    const idx = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const uvs = new Float32Array((nx + 1) * (ny + 1) * 2);
    for (let q = 0, w = 0; q < pos.length; q += 3, w += 2) { uvs[w] = pos[q] / 3; uvs[w + 1] = pos[q + 2] / 3; }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  function mezcla(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  const C = {
    pasto: [0.66, 0.60, 0.36],     // pasto agostado de junio
    verde: [0.40, 0.47, 0.25],     // vegetación húmeda de ribera y vaguada
    tierra: [0.54, 0.42, 0.29],    // tierra pisada del poblado
    arcilla: [0.62, 0.50, 0.36],
    orilla: [0.52, 0.47, 0.37],
    ladera: [0.58, 0.49, 0.36],
  };

  function colorGeneral(x, y, h) {
    let c = mezcla(C.pasto, C.verde, 0.35 + 0.35 * V.fbm(x / 40 + 3, y / 40));
    // Laderas de la meseta: suelo más pobre, con más tierra y piedra a la vista
    const pend = Math.hypot(V.altura(x + 2, y) - V.altura(x - 2, y), V.altura(x, y + 2) - V.altura(x, y - 2)) / 4;
    c = mezcla(c, C.ladera, V.paso(0.08, 0.3, pend) * 0.75);
    const dr = Math.abs(y - V.yRio(x));
    c = mezcla(c, C.verde, 1 - V.paso(40, 90, dr));            // ribera
    if (y < -16) {                                              // fondo de la vaguada
      const dv = Math.abs(x - V.ejeVaguada(y));
      c = mezcla(c, C.verde, (1 - V.paso(3, 14, dv)) * 0.8);
    }
    c = mezcla(c, C.orilla, 1 - V.paso(26, 34, dr));            // playa de cantos
    return c;
  }

  // Tierra pisada alrededor de las estructuras del poblado
  function colorSitio(x, y, h) {
    let c = colorGeneral(x, y, h);
    const P = V.plano;
    let cerca = 0;
    for (const e of P.estructuras) {
      const d = Math.hypot(x - e.x, y - e.y);
      cerca = Math.max(cerca, 1 - V.paso(1.5, 7, d));
    }
    for (const cb of P.cabanas) cerca = Math.max(cerca, 1 - V.paso(1.0, 2.2, V.enCabana(x, y, cb, 0)));
    const z = V.distPolilinea(x, y, P.zanja.eje);
    cerca = Math.max(cerca, 1 - V.paso(1.2, 4, z.d));
    c = mezcla(c, C.tierra, cerca * (0.7 + 0.2 * V.fbm(x / 3, y / 3)));
    c = mezcla(c, C.arcilla, 0.75 * (1 - V.paso(P.zanja.ancho / 2 - 0.5, P.zanja.ancho / 2 + 0.2, z.d)));
    return c;
  }

  V.construirTerreno = function (ctx) {
    const { scene } = ctx;
    const S = V.SITIO;
    // Textura de detalle (hierba seca, tierra y piedrecillas) que se multiplica por los colores del relieve
    const detalle = V.texturaCanvas(256, 256, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 5000; i++) {
        const v = 150 + Math.random() * 105 | 0;
        g.fillStyle = `rgb(${v},${v},${v * 0.92 | 0})`;
        const x = Math.random() * w, y = Math.random() * h;
        if (Math.random() < 0.7) g.fillRect(x, y, 1, 2 + Math.random() * 4); else g.fillRect(x, y, 2, 2);
      }
    }, [1, 1]);
    detalle.wrapS = detalle.wrapT = THREE.RepeatWrapping;
    detalle.encoding = THREE.LinearEncoding;
    const matTierra = new THREE.MeshLambertMaterial({ vertexColors: true, map: detalle });

    // Relieve general: 900 × 900 m
    const segGeneral = ctx.calidad === 'baja' ? 8 : 6.5;
    const dentroSitio = (x, y) => (x > S.x0 + 0.5 && x < S.x1 - 0.5 && y > S.y0 + 0.5 && y < S.y1 - 0.5) ? 2.0 : 0;
    const gGeneral = mallaRelieve(-450, 450, -480, 420, segGeneral, V.altura, colorGeneral, dentroSitio);
    const general = new THREE.Mesh(gGeneral, matTierra);
    general.receiveShadow = true;
    general.name = 'relieve-general';
    scene.add(V.marcar(general, N.HIP, 'Relieve general (sin topografía anterior al embalse)'));

    // Sector excavado con detalle (0,5 m): zanja y suelos rebajados
    const gSitio = mallaRelieve(S.x0, S.x1, S.y0, S.y1, ctx.calidad === 'baja' ? 0.8 : 0.6, V.alturaSitio, colorSitio);  // malla de 0,6 m (0,8 m en calidad baja)
    const sitio = new THREE.Mesh(gSitio, matTierra);
    sitio.receiveShadow = true;
    sitio.name = 'relieve-sitio';
    scene.add(V.marcar(sitio, N.DOC, 'Terraza arcillosa y zanja (planta documentada)'));
    ctx.suelo = [general, sitio];

    // Agua del Tajo
    const gAgua = new THREE.PlaneGeometry(900, 120, 60, 1);
    gAgua.rotateX(-Math.PI / 2);
    const pa = gAgua.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), lado = pa.getZ(i) > 0 ? -1 : 1;
      pa.setZ(i, -(V.yRio(x) + lado * 34));
      pa.setY(i, V.NIVEL_AGUA);
    }
    gAgua.computeVertexNormals();
    const agua = new THREE.Mesh(gAgua, new THREE.MeshPhongMaterial({ color: 0x5b7f86, shininess: 60, specular: 0x667777, transparent: true, opacity: 0.92 }));
    agua.name = 'rio-tajo';
    scene.add(V.marcar(agua, N.HIP, 'Tajo (posición aproximada)'));

    construirCampos(ctx);
    construirHorizonte(ctx);
  };

  // --- Campos de cultivo (trigo documentado; cebada y leguminosas deducidas; situación hipotética) ---
  function texturaCampo(base, raya) {
    return V.texturaCanvas(128, 128, (g, w, h) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 4) {
        g.fillStyle = raya; g.globalAlpha = 0.35 + Math.random() * 0.3;
        g.fillRect(0, y, w, 2);
      }
      g.globalAlpha = 1;
      for (let i = 0; i < 500; i++) {
        g.fillStyle = Math.random() < 0.5 ? raya : base;
        g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
    }, [1, 1]);
  }

  function parcela(ctx, cx, cy, ancho, largo, giro, mat, nivel, etiqueta) {
    // Malla que se adapta al relieve, ligeramente elevada
    const nx = Math.max(2, Math.round(ancho / 8)), ny = Math.max(2, Math.round(largo / 8));
    const g = new THREE.PlaneGeometry(ancho, largo, nx, ny);
    const pa = g.attributes.position;
    const uv = g.attributes.uv;
    const ca = Math.cos(giro), sa = Math.sin(giro);
    for (let i = 0; i < pa.count; i++) {
      const lx = pa.getX(i), ly = pa.getY(i);
      const x = cx + lx * ca - ly * sa, y = cy + lx * sa + ly * ca;
      pa.setXYZ(i, x, V.altura(x, y) + 0.06, -y);
      uv.setXY(i, uv.getX(i) * ancho / 6, uv.getY(i) * largo / 6);
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.receiveShadow = true;
    ctx.scene.add(V.marcar(m, nivel, etiqueta));
    ctx.campos.push({ cx, cy, ancho, largo, giro, tipo: etiqueta });
    return m;
  }

  function construirCampos(ctx) {
    ctx.campos = [];
    const opts = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 };
    const trigo = new THREE.MeshLambertMaterial(Object.assign({ map: texturaCampo('#c9a75a', '#8f7232') }, opts));
    const cebada = new THREE.MeshLambertMaterial(Object.assign({ map: texturaCampo('#d6c082', '#a08c50') }, opts));
    const legum = new THREE.MeshLambertMaterial(Object.assign({ map: texturaCampo('#7d7a3e', '#55522a') }, opts));
    trigo.map.wrapS = trigo.map.wrapT = cebada.map.wrapS = cebada.map.wrapT = legum.map.wrapS = legum.map.wrapT = THREE.RepeatWrapping;
    // Al norte y al este del poblado, fuera del sector excavado
    parcela(ctx, -10, 70, 46, 28, 0.08, trigo, N.DOC, 'Campo de trigo');
    parcela(ctx, 40, 66, 30, 34, -0.05, trigo, N.DOC, 'Campo de trigo');
    parcela(ctx, 58, 18, 26, 40, 0.12, cebada, N.DED, 'Campo de cebada');
    parcela(ctx, -46, 62, 26, 22, 0.2, legum, N.DED, 'Parcela de leguminosas');
    parcela(ctx, 62, -22, 22, 28, 0.04, legum, N.DED, 'Parcela de leguminosas');
    parcela(ctx, 20, 108, 50, 26, -0.1, cebada, N.DED, 'Campo de cebada');
  }

  // --- Horizonte: sierras lejanas (geografía documentada) y dolmen (hipótesis de visibilidad) ---
  function construirHorizonte(ctx) {
    const { scene } = ctx;
    // Anillo de sierras a 5 km. Alturas aparentes: Gredos al norte (~2.000 m a ~40 km),
    // Villuercas y Montes de Toledo al sur, más bajos.
    const R = 5200, n = 180;
    const pos = [], col = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;              // 0 = norte, en sentido horario
      const norte = Math.cos(a), sur = -Math.cos(a);
      let h = 40 + 25 * V.fbm(i / 6, 2);
      h += Math.max(0, norte) ** 2 * (190 + 80 * V.fbm(i / 4, 7));   // Gredos
      h += Math.max(0, sur) ** 3 * (90 + 50 * V.fbm(i / 5, 11));     // sierras del sur
      const x = Math.sin(a) * R, z = -Math.cos(a) * R;
      pos.push(x, -30, z, x, h, z);
      const lejos = norte > 0.5 ? [0.55, 0.6, 0.68] : [0.62, 0.64, 0.66];
      col.push(...lejos, ...lejos.map(c => c * 0.92));
    }
    const idx = [];
    for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    const sierras = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide }));
    sierras.name = 'sierras';
    scene.add(V.marcar(sierras, N.DOC, 'Sierras del horizonte (Gredos al norte)'));
    ctx.sierras = sierras;

    // Llanura intermedia entre el relieve modelado y las sierras
    const anillo = new THREE.RingGeometry(440, R, 64, 1);
    anillo.rotateX(-Math.PI / 2);
    anillo.translate(0, -12, 0);
    const llano = new THREE.Mesh(anillo, new THREE.MeshBasicMaterial({ color: 0x8f8a5c }));
    llano.name = 'llanura-lejana';
    scene.add(V.marcar(llano, N.HIP, 'Llanura del Campo Arañuelo (esquemática)'));

  }
})(window.VALDE);
