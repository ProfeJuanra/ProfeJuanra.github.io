/*
  ESCENA 3D DE LA GRAN PIRÁMIDE (modelo procedural, sin modelos descargados)
  Medidas en metros (ver egipto/piramide-datos.js):
  · lado de la base 230,33 m · altura original 146,6 m · altura actual ≈ 138,5 m
  Origen en el centro de la base. x = este, y = altura, z = sur (norte = -z).
  Las posiciones interiores son un ESQUEMA aproximado (Petrie 1883; Lehner 1997).

  Contexto de Giza (medidas y posiciones APROXIMADAS, Lehner 1997; PBS NOVA):
  · Kefrén: base ≈ 215 m, altura original 143,5 m, hoy ≈ 136,4 m; conserva revestimiento arriba.
  · Micerino: base ≈ 105 m, altura original ≈ 65 m, hoy ≈ 61 m; hiladas bajas de granito rojo.
  · Pirámides de las reinas (G1-a, G1-b, G1-c): bases de 46-50 m y unos 30 m de altura.
  Kefrén y Micerino se construyeron DESPUÉS de Keops: solo aparecen en la vista «Hoy».
*/
(function () {
  'use strict';
  const LADO = 230.33, A = LADO / 2, H = 146.6, H_HOY = 138.5;
  const TAN = H / A;                      // pendiente de las caras (≈ 51,84°)
  const EJE_PASILLOS = 7.3;               // los pasillos están 7,3 m al este del eje
  const GROSOR = 2.5;                     // los pasillos se dibujan 2,5 veces más anchos para que se vean
  const LATITUD = 29.98 * Math.PI / 180;  // latitud de Giza, para la posición del Sol

  window.MEDIDAS = { LADO, A, H, H_HOY, TAN, EJE_PASILLOS, GROSOR };

  // Números pseudoaleatorios repetibles (el modelo sale igual en todos los equipos)
  function azar(semilla) {
    let s = semilla >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  // ---------- Texturas generadas en un lienzo (sin imágenes externas) ----------
  function lienzo(n, dibujar) {
    const c = document.createElement('canvas'); c.width = c.height = n;
    dibujar(c.getContext('2d'), n);
    return c;
  }
  function textura(canvas, color) {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
    if (color) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function moteado(g, n, colores, cantidad, alfa, tam) {
    for (let i = 0; i < cantidad; i++) {
      g.fillStyle = colores[i % colores.length]; g.globalAlpha = Math.random() * alfa;
      const s = tam * (0.4 + Math.random());
      g.fillRect(Math.random() * n, Math.random() * n, s, s);
    }
    g.globalAlpha = 1;
  }

  // Bloques del núcleo: 4 hiladas por textura; bloques de anchura variable, juntas oscuras.
  // Se generan a la vez la textura de color y la de relieve (gris: claro = saliente).
  function texturasBloques() {
    const N = 512, filas = 4, alto = N / filas, rnd = azar(7);
    const col = document.createElement('canvas'); col.width = col.height = N;
    const rel = document.createElement('canvas'); rel.width = rel.height = N;
    const gc = col.getContext('2d'), gr = rel.getContext('2d');
    gr.fillStyle = '#202020'; gr.fillRect(0, 0, N, N);
    const tonos = ['#c9a56c', '#d4b47e', '#bf9a60', '#d9bd8b', '#b88f58', '#cfae74', '#c4a067'];
    for (let f = 0; f < filas; f++) {
      let x = -rnd() * 60;
      while (x < N) {
        const w = 38 + rnd() * 70, y = f * alto;
        const ex = 2 + rnd() * 3;                       // juntas irregulares
        gc.fillStyle = tonos[Math.floor(rnd() * tonos.length)];
        gc.fillRect(x + ex, y + ex, w - 2 * ex, alto - 2 * ex);
        // Borde gastado: el bloque es más oscuro y bajo cerca de las juntas
        const gradR = gr.createLinearGradient(0, y, 0, y + alto);
        gradR.addColorStop(0, '#7a7a7a'); gradR.addColorStop(0.15, '#d0d0d0'); gradR.addColorStop(0.85, '#c0c0c0'); gradR.addColorStop(1, '#606060');
        gr.fillStyle = gradR; gr.fillRect(x + ex, y + ex, w - 2 * ex, alto - 2 * ex);
        // Desconchones
        for (let k = 0; k < 3; k++) {
          const cx = x + rnd() * w, cy = y + rnd() * alto, r = 3 + rnd() * 9;
          gc.fillStyle = 'rgba(120,90,50,.35)'; gc.beginPath(); gc.arc(cx, cy, r, 0, 7); gc.fill();
          gr.fillStyle = 'rgba(40,40,40,.55)'; gr.beginPath(); gr.arc(cx, cy, r, 0, 7); gr.fill();
        }
        x += w;
      }
      // Sombra de la junta horizontal
      gc.fillStyle = 'rgba(70,50,25,.55)'; gc.fillRect(0, f * alto, N, 4);
    }
    moteado(gc, N, ['#ffffff', '#8a6a3a', '#e8d2a4', '#9c7a48'], 9000, 0.25, 2.2);
    moteado(gr, N, ['#ffffff', '#000000'], 6000, 0.18, 2);
    return { mapa: textura(col, true), relieve: textura(rel, false) };
  }

  // Revestimiento: caliza casi blanca, juntas finísimas (hiladas y bloques)
  function texturasCaliza() {
    const N = 512, rnd = azar(11);
    const col = lienzo(N, (g) => {
      g.fillStyle = '#efe9da'; g.fillRect(0, 0, N, N);
      // Cada bloque del revestimiento con un tono ligeramente distinto
      const tonos = ['#f3eee2', '#ece5d4', '#f6f2e8', '#e8e0cc', '#f0eadb'];
      for (let y = 0; y < N; y += 64) { let x = -rnd() * 80; while (x < N) { const w = 90 + rnd() * 110; g.fillStyle = tonos[Math.floor(rnd() * tonos.length)]; g.fillRect(x, y, w, 64); x += w; } }
      moteado(g, N, ['#ffffff', '#ddd5c2', '#e9e1cf'], 7000, 0.22, 2.5);
      g.strokeStyle = 'rgba(140,122,90,.45)'; g.lineWidth = 1.4;
      for (let y = 0; y <= N; y += 64) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(N, y + .5); g.stroke(); }
      const r2 = azar(11); r2();
      for (let y = 0; y < N; y += 64) { let x = -r2() * 80; while (x < N) { const w = 90 + r2() * 110; g.beginPath(); g.moveTo(x + .5, y); g.lineTo(x + .5, y + 64); g.stroke(); x += w; } }
    });
    const rel = lienzo(N, (g) => {
      g.fillStyle = '#c8c8c8'; g.fillRect(0, 0, N, N);
      moteado(g, N, ['#ffffff', '#909090'], 5000, 0.2, 2);
      g.strokeStyle = '#6a6a6a'; g.lineWidth = 2;
      for (let y = 0; y <= N; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(N, y); g.stroke(); }
    });
    return { mapa: textura(col, true), relieve: textura(rel, false) };
  }

  // Suelo de la meseta: arena y roca con manchas a dos escalas
  function texturaSuelo() {
    const N = 512;
    return textura(lienzo(N, (g) => {
      g.fillStyle = '#d9bf8c'; g.fillRect(0, 0, N, N);
      for (let i = 0; i < 160; i++) {
        const x = Math.random() * N, y = Math.random() * N, r = 15 + Math.random() * 60;
        const gr = g.createRadialGradient(x, y, 0, x, y, r);
        const c = Math.random() < 0.5 ? '200,170,120' : '232,212,170';
        gr.addColorStop(0, `rgba(${c},.35)`); gr.addColorStop(1, `rgba(${c},0)`);
        g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
      }
      moteado(g, N, ['#a9884f', '#f0dcb2', '#8f6f40', '#c9a96f'], 14000, 0.3, 1.8);
    }), true);
  }

  // ---------- Geometrías ----------
  // Pirámide de caras lisas (sin base), con UV en metros para que la textura no se estire
  function geoPiramide(a, h, escalaUV) {
    const k = escalaUV || 1, inclinada = Math.hypot(a, h);
    const caras = [
      [[-a, 0, -a], [a, 0, -a]], [[a, 0, -a], [a, 0, a]], [[a, 0, a], [-a, 0, a]], [[-a, 0, a], [-a, 0, -a]],
    ];
    const v = [], uv = [];
    for (const [p, q] of caras) {
      v.push(...p, 0, h, 0, ...q);
      uv.push(0, 0, a * k, inclinada * k, 2 * a * k, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    return g;
  }

  // Tronco de pirámide (para el revestimiento que conserva Kefrén y el granito de Micerino)
  function geoTronco(a0, a1, y0, y1) {
    const v = [], uv = [];
    const lado = (s, t) => [[-s, -s], [s, -s], [s, s], [-s, s]][t];
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = lado(a0, i), [x1, z1] = lado(a0, (i + 1) % 4);
      const [u0, w0] = lado(a1, i), [u1, w1] = lado(a1, (i + 1) % 4);
      v.push(x0, y0, z0, x1, y0, z1, u1, y1, w1, x0, y0, z0, u1, y1, w1, u0, y1, w0);
      uv.push(0, 0, 2 * a0, 0, 2 * a0, y1 - y0, 0, 0, 2 * a0, y1 - y0, 0, y1 - y0);   // en metros
    }
    // tapa superior
    v.push(-a1, y1, -a1, a1, y1, a1, a1, y1, -a1, -a1, y1, -a1, -a1, y1, a1, a1, y1, a1);
    uv.push(0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    return g;
  }

  /*
    Núcleo escalonado (como está hoy). Cada hilada es un octógono: cuatro caras y cuatro
    aristas desgastadas (chaflanes) de tamaño variable, porque las esquinas son lo que más
    se ha erosionado. Las alturas de las hiladas varían, como en la realidad.
    Devuelve una sola geometría (rápida de dibujar) con UV en metros.
  */
  function geoNucleo(opc) {
    const { a, h, hTotal, hiladas, retranqueo, semilla, desgaste } = opc;
    const rnd = azar(semilla);
    // Alturas de hilada: más altas abajo, variables (se normalizan a la altura total)
    const alt = [];
    for (let i = 0; i < hiladas; i++) alt.push((1.35 - 0.6 * i / hiladas) * (0.75 + rnd() * 0.5));
    const suma = alt.reduce((s, x) => s + x, 0);
    for (let i = 0; i < hiladas; i++) alt[i] *= hTotal / suma;

    const contorno = (y, i) => {
      const m = Math.max(0.6, a * (1 - y / h) - retranqueo);
      const j = () => (rnd() - 0.5) * 0.5;                  // irregularidad de cada cara
      const ch = Math.min(m * 0.45, desgaste * (0.4 + rnd() * 1.6));   // chaflán de la arista
      const e = [m + j(), m + j(), m + j(), m + j()];       // este, sur, oeste, norte
      // 8 vértices, empezando en la cara norte junto a la esquina NE
      return [
        [e[0] - ch, -e[3]], [e[0], -e[3] + ch],              // esquina NE
        [e[0], e[1] - ch], [e[0] - ch, e[1]],                // esquina SE
        [-e[2] + ch, e[1]], [-e[2], e[1] - ch],              // esquina SO
        [-e[2], -e[3] + ch], [-e[2] + ch, -e[3]],            // esquina NO
      ];
    };

    const v = [], uv = [], col = [];
    const quad = (p, q, r, s, uvs, tono) => {
      // orden de vértices para que la cara mire hacia fuera (o hacia arriba en los escalones)
      v.push(...p, ...r, ...q, ...p, ...s, ...r);
      const [a0, a1, a2, a3] = uvs; uv.push(...a0, ...a2, ...a1, ...a0, ...a3, ...a2);
      for (let k = 0; k < 6; k++) col.push(tono, tono, tono);
    };
    let y = 0;
    let ant = null;
    for (let i = 0; i < hiladas; i++) {
      const y1 = y + alt[i], c = contorno(y, i);
      const fila = i % 4, tono = 0.86 + rnd() * 0.22;
      // Paredes verticales de la hilada
      let u = 0;
      for (let k = 0; k < 8; k++) {
        const [x0, z0] = c[k], [x1, z1] = c[(k + 1) % 8];
        const largo = Math.hypot(x1 - x0, z1 - z0);
        const v0 = (3 - fila) / 4, v1 = (4 - fila) / 4;
        quad([x0, y, z0], [x1, y, z1], [x1, y1, z1], [x0, y1, z0],
          [[u / 9, v0], [(u + largo) / 9, v0], [(u + largo) / 9, v1], [u / 9, v1]], tono);
        u += largo;
      }
      // Escalón (huella) entre la hilada anterior y esta
      if (ant) {
        for (let k = 0; k < 8; k++) {
          const p = ant[k], q = ant[(k + 1) % 8], r = c[(k + 1) % 8], s = c[k];
          quad([p[0], y, p[1]], [q[0], y, q[1]], [r[0], y, r[1]], [s[0], y, s[1]],
            [[p[0] / 9, p[1] / 9], [q[0] / 9, q[1] / 9], [r[0] / 9, r[1] / 9], [s[0] / 9, s[1] / 9]], tono * 1.12);
        }
      }
      ant = c.map(([x, z]) => [x, z]);
      ant.y = y1;
      y = y1;
    }
    // Plataforma superior
    const t = ant;
    for (let k = 1; k < 7; k++) {
      const p = t[0], q = t[k + 1], r = t[k];
      v.push(p[0], y, p[1], r[0], y, r[1], q[0], y, q[1]);
      uv.push(p[0] / 9, p[1] / 9, r[0] / 9, r[1] / 9, q[0] / 9, q[1] / 9);
      for (let n = 0; n < 3; n++) col.push(1.1, 1.1, 1.1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    return g;
  }

  // Caja orientada entre dos puntos (para los pasillos inclinados)
  function tramo(p1, p2, ancho, alto, mat) {
    const a = new THREE.Vector3(...p1), b = new THREE.Vector3(...p2);
    const largo = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, largo), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    return m;
  }

  // Tejado a dos aguas: prisma triangular (ancho en x, fondo en z, alto)
  function dosAguas(ancho, fondo, alto, mat) {
    const t = new THREE.Shape();
    t.moveTo(-ancho / 2, 0); t.lineTo(ancho / 2, 0); t.lineTo(0, alto); t.closePath();
    const g = new THREE.ExtrudeGeometry(t, { depth: fondo, bevelEnabled: false });
    g.translate(0, 0, -fondo / 2);
    return new THREE.Mesh(g, mat);
  }

  // ---------- Cielo con degradado y halo del Sol ----------
  function crearCielo() {
    const uniforms = {
      cenit: { value: new THREE.Color('#3f7fc4') }, horizonte: { value: new THREE.Color('#dbe6ec') },
      dirSol: { value: new THREE.Vector3(0, 1, 0) }, colorSol: { value: new THREE.Color('#fff4d6') },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 cenit; uniform vec3 horizonte; uniform vec3 dirSol; uniform vec3 colorSol; varying vec3 vDir;
        void main(){
          float h = max(vDir.y, 0.0);
          vec3 c = mix(horizonte, cenit, pow(h, 0.55));
          float s = max(dot(normalize(vDir), normalize(dirSol)), 0.0);
          c += colorSol * (pow(s, 600.0) * 1.6 + pow(s, 12.0) * 0.25);
          if (vDir.y < 0.0) c = horizonte;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    const cielo = new THREE.Mesh(new THREE.SphereGeometry(5000, 32, 16), mat);
    cielo.renderOrder = -10;
    return { cielo, uniforms };
  }

  window.construirEscena = function (ctx) {
    const { scene, calidad, renderer } = ctx;
    const alta = calidad !== 'baja';
    const sombras = alta;

    // ---------- Cielo, luz y suelo ----------
    const { cielo, uniforms: uCielo } = crearCielo();
    scene.add(cielo);
    scene.fog = new THREE.Fog('#dbe6ec', 1400, 4800);
    const hemi = new THREE.HemisphereLight('#dfefff', '#c9a66b', 0.5);
    scene.add(hemi);
    const sol = new THREE.DirectionalLight('#fff3dc', 1.6);
    if (sombras) {
      sol.castShadow = true;
      sol.shadow.mapSize.set(calidad === 'alta' ? 4096 : 2048, calidad === 'alta' ? 4096 : 2048);
      const s = calidad === 'alta' ? 700 : 450;   // zona con sombras alrededor de la pirámide
      Object.assign(sol.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 10, far: 2600 });
      sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.6;
    }
    scene.add(sol, sol.target);

    // Reflejos del cielo en la caliza pulida (mapa de entorno generado a partir del cielo)
    let entorno = null;
    if (renderer && alta) {
      const pm = new THREE.PMREMGenerator(renderer);
      const esc = new THREE.Scene(); const c2 = crearCielo(); c2.uniforms.dirSol.value.set(0.4, 0.8, 0.3);
      esc.add(c2.cielo);
      entorno = pm.fromScene(esc, 0.02).texture;
      pm.dispose();
    }

    const matSuelo = new THREE.MeshStandardMaterial({ map: texturaSuelo(), roughness: 1, transparent: true });
    matSuelo.map.repeat.set(70, 70);
    const suelo = new THREE.Mesh(new THREE.CircleGeometry(5000, 64), matSuelo);
    suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = sombras;
    scene.add(suelo);

    // Flecha del norte dibujada en el suelo
    const flecha = new THREE.Shape();
    flecha.moveTo(0, -22); flecha.lineTo(9, 6); flecha.lineTo(2.5, 2); flecha.lineTo(2.5, 22); flecha.lineTo(-2.5, 22); flecha.lineTo(-2.5, 2); flecha.lineTo(-9, 6); flecha.closePath();
    const norte = new THREE.Mesh(new THREE.ShapeGeometry(flecha), new THREE.MeshBasicMaterial({ color: '#7a1d1d' }));
    norte.rotation.x = -Math.PI / 2; norte.position.set(-150, 0.3, -150);
    scene.add(norte);

    // ---------- Materiales ----------
    const tc = texturasCaliza();
    const matCaliza = new THREE.MeshStandardMaterial({
      color: '#f6f1e4', map: tc.mapa, bumpMap: tc.relieve, bumpScale: 0.3, roughness: 0.3, metalness: 0,
      envMap: entorno, envMapIntensity: 0.55,
    });
    matCaliza.map.repeat.set(1 / 6, 1 / 6); tc.relieve.repeat.set(1 / 6, 1 / 6);
    const tb = texturasBloques();
    const matNucleo = new THREE.MeshStandardMaterial({ color: '#ffffff', map: tb.mapa, bumpMap: tb.relieve, bumpScale: alta ? 0.9 : 0.5, roughness: 0.95, vertexColors: true });
    const matGranitoExt = new THREE.MeshStandardMaterial({ color: '#8e4a3c', roughness: 0.8, map: tc.mapa });
    const matCalizaGastada = matCaliza.clone(); matCalizaGastada.color.set('#dccfae'); matCalizaGastada.roughness = 0.7; matCalizaGastada.envMapIntensity = 0.2;

    // ---------- Pirámide recién terminada ----------
    const completa = new THREE.Group();
    const cuerpo = new THREE.Mesh(geoPiramide(A, H), matCaliza);
    cuerpo.castShadow = sombras; cuerpo.receiveShadow = sombras;
    completa.add(cuerpo);
    const H_PIR = 2.6;                     // piramidión dibujado: tamaño desconocido
    const matPiramidion = new THREE.MeshStandardMaterial({ color: '#efe4c8', roughness: 0.25, envMap: entorno, envMapIntensity: 0.7 });
    const ap = H_PIR / TAN;
    const piramidion = new THREE.Mesh(geoPiramide(ap * 1.04, H_PIR * 1.04), matPiramidion);
    piramidion.position.y = H - H_PIR * 1.04;
    completa.add(piramidion);
    scene.add(completa);

    // ---------- Pirámide hoy: núcleo escalonado y erosionado ----------
    const hoy = new THREE.Group();
    const nucleo = new THREE.Mesh(geoNucleo({ a: A, h: H, hTotal: H_HOY, hiladas: 203, retranqueo: 1.6, semilla: 3, desgaste: 2.2 }), matNucleo);
    nucleo.castShadow = sombras; nucleo.receiveShadow = sombras;
    hoy.add(nucleo);
    // Restos del revestimiento en la base de la cara norte
    const restoGeo = new THREE.BufferGeometry();
    const rx = 14, rh = 2.2, rd = rh / TAN;
    restoGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      -rx, 0, -A, rx, 0, -A, rx, rh, -A + rd, -rx, 0, -A, rx, rh, -A + rd, -rx, rh, -A + rd,
      -rx, rh, -A + rd, rx, rh, -A + rd, rx, rh, -A + rd + 1.5, -rx, rh, -A + rd, rx, rh, -A + rd + 1.5, -rx, rh, -A + rd + 1.5,
    ], 3));
    restoGeo.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(24).fill(0), 2));
    restoGeo.computeVertexNormals();
    const restos = new THREE.Mesh(restoGeo, matCaliza.clone());
    restos.material.side = THREE.DoubleSide;
    hoy.add(restos);
    // Bloques sueltos al pie de las caras (piedras caídas)
    if (alta) {
      const rnd = azar(21), piedras = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#c8a46c', roughness: 1 }), 260);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      for (let i = 0; i < 260; i++) {
        const lado = Math.floor(rnd() * 4), t = (rnd() - 0.5) * 2 * A, d = A + 1 + rnd() * 9;
        const pos = [[t, -d], [d, t], [t, d], [-d, t]][lado];
        e.set(rnd() * 0.5, rnd() * 3, rnd() * 0.5); q.setFromEuler(e);
        const s = 0.6 + rnd() * 1.1;
        m4.compose(new THREE.Vector3(pos[0], s * 0.3, pos[1]), q, new THREE.Vector3(s * 1.4, s * 0.8, s));
        piedras.setMatrixAt(i, m4);
      }
      piedras.castShadow = piedras.receiveShadow = true;
      hoy.add(piedras);
    }
    hoy.visible = false;
    scene.add(hoy);

    // ---------- Contexto de Giza (posiciones aproximadas) ----------
    // Pirámides de las reinas, al este (de Keops, de su época)
    const reinasCompletas = new THREE.Group(), reinasHoy = new THREE.Group();
    [[A + 62, -42, 24.5, 30], [A + 62, 17.5, 25, 30], [A + 60, 76, 23.1, 29.6]].forEach(([x, z, a, h], i) => {
      const c = new THREE.Mesh(geoPiramide(a, h), matCaliza); c.position.set(x, 0, z); c.castShadow = c.receiveShadow = sombras;
      reinasCompletas.add(c);
      const n = new THREE.Mesh(geoNucleo({ a, h, hTotal: h * (0.55 + i * 0.08), hiladas: 34, retranqueo: 0.8, semilla: 40 + i, desgaste: 2.5 }), matNucleo);
      n.position.set(x, 0, z); n.castShadow = n.receiveShadow = sombras;
      reinasHoy.add(n);
    });
    completa.add(reinasCompletas);
    hoy.add(reinasHoy);

    // Kefrén (al suroeste) y Micerino (más al suroeste): construidas después de Keops
    const posteriores = new THREE.Group();
    const AK = 215 / 2, HK = 143.5, HK_HOY = 136.4;
    const kefren = new THREE.Group(); kefren.position.set(-328, 0, 344);
    const kNucleo = new THREE.Mesh(geoNucleo({ a: AK, h: HK, hTotal: 103, hiladas: 120, retranqueo: 1.2, semilla: 55, desgaste: 2 }), matNucleo);
    const aCorte = AK * (1 - 103 / HK), aCima = AK * (1 - HK_HOY / HK);
    const kRevest = new THREE.Mesh(geoTronco(aCorte, aCima, 103, HK_HOY), matCalizaGastada);
    kefren.add(kNucleo, kRevest);
    const AM = 105 / 2, HM = 65, HM_HOY = 61;
    const micerino = new THREE.Group(); micerino.position.set(-589, 0, 743);
    const mNucleo = new THREE.Mesh(geoNucleo({ a: AM, h: HM, hTotal: HM_HOY, hiladas: 70, retranqueo: 0.9, semilla: 66, desgaste: 1.8 }), matNucleo);
    const mGranito = new THREE.Mesh(geoTronco(AM, AM * (1 - 6 / HM), 0, 6), matGranitoExt);
    micerino.add(mNucleo, mGranito);
    posteriores.add(kefren, micerino);
    posteriores.traverse(o => { if (o.isMesh) { o.castShadow = sombras; o.receiveShadow = sombras; } });
    hoy.add(posteriores);

    // ---------- Interior (esquema) ----------
    const interior = new THREE.Group();
    const X = EJE_PASILLOS, G = GROSOR;
    // Colores planos de esquema (sin luces, para que se distingan bien)
    const plano = c => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
    const matPasillo = plano('#1f56b0');
    const matCaliInt = plano('#d08a12');
    const matGranito = plano('#b0302a');
    const matRoca = plano('#6e4f2c');
    const matNuevo = plano('#0f9a6e');

    const ENTRADA = [X, 17, -(A - 17 / TAN)];
    const FONDO = [X, -30, -7.5];
    const CRUCE = [X, 4.5, -76.7];
    const GAL0 = [X, 21.6, -41.7];
    const GAL1 = [X, 42.1, 0.3];
    interior.add(tramo(ENTRADA, FONDO, 1.05 * G, 1.2 * G, matPasillo));            // pasillo descendente
    interior.add(tramo(FONDO, [X, -30, 1.5], 1.0 * G, 0.9 * G, matPasillo));         // pasillo horizontal
    const sub = new THREE.Mesh(new THREE.BoxGeometry(14, 3.5, 8.3), matRoca);        // cámara subterránea
    sub.position.set(1, -28.25, 5.6); interior.add(sub);
    interior.add(tramo(CRUCE, GAL0, 1.05 * G, 1.2 * G, matPasillo));                 // pasillo ascendente
    interior.add(tramo(GAL0, [X, 21.6, -2.6], 1.05 * G, 1.15 * G, matPasillo));      // pasillo de la Cámara de la Reina
    // Cámara de la Reina: paredes y techo a dos aguas
    const reina = new THREE.Group();
    const rCaja = new THREE.Mesh(new THREE.BoxGeometry(5.75, 4.67, 5.23), matCaliInt);
    rCaja.position.y = 4.67 / 2; reina.add(rCaja);
    const tejado = dosAguas(5.23, 5.75, 1.56, matCaliInt);   // la cumbrera va de este a oeste
    tejado.rotation.y = Math.PI / 2; tejado.position.y = 4.67; reina.add(tejado);
    reina.position.set(4.4, 21.6, 0); interior.add(reina);
    // Gran Galería: tramo inclinado alto (8,6 m)
    const gal = tramo(GAL0, GAL1, 2.1 * 1.5, 8.6 * Math.cos(26 * Math.PI / 180), matCaliInt);
    gal.translateY(8.6 * Math.cos(26 * Math.PI / 180) / 2 - 0.6); interior.add(gal);
    interior.add(tramo(GAL1, [X, 43, 5.0], 1.05 * G, 1.1 * G, matPasillo));          // antecámara
    // Cámara del Rey y cámaras de descarga
    const rey = new THREE.Mesh(new THREE.BoxGeometry(10.47, 5.82, 5.23), matGranito);
    rey.position.set(3.1, 43 + 5.82 / 2, 7.6); interior.add(rey);
    for (let i = 0; i < 5; i++) {
      const losa = new THREE.Mesh(new THREE.BoxGeometry(10.47, 0.9, 5.23), matGranito);
      losa.position.set(3.1, 43 + 5.82 + 1.6 + i * 2.4, 7.6); interior.add(losa);
    }
    const remate = dosAguas(7.5, 12, 3.2, matCaliInt);         // techo de grandes bloques a dos aguas
    remate.rotation.y = Math.PI / 2; remate.position.set(3.1, 43 + 5.82 + 1.6 + 4 * 2.4 + 0.6, 7.6);
    interior.add(remate);
    // Corredor de la cara norte (2023): unos 9 m, sección 2 × 2 m
    const corredor = tramo([X, 24, -(A - 24 / TAN) + 3], [X, 24, -(A - 24 / TAN) + 12], 2, 2, matNuevo);
    interior.add(corredor);
    // Gran Vacío (2017): zona APROXIMADA, forma desconocida
    const vacioMat = new THREE.MeshBasicMaterial({ color: '#ff8c2b', transparent: true, opacity: 0.45, depthWrite: false, toneMapped: false });
    const vacio = new THREE.Mesh(new THREE.BoxGeometry(6, 9, 30), vacioMat);
    vacio.position.set(X, 52, -20); interior.add(vacio);
    const bordes = new THREE.LineSegments(new THREE.EdgesGeometry(vacio.geometry), new THREE.LineDashedMaterial({ color: '#c25400', dashSize: 1.5, gapSize: 1.2 }));
    bordes.computeLineDistances(); bordes.position.copy(vacio.position); interior.add(bordes);
    // El interior se dibuja DESPUÉS de la pirámide transparente para que no pierda color
    const contornos = [];
    interior.traverse(o => {
      if (o.isMesh && o.material !== vacioMat) {
        const l = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry), new THREE.LineBasicMaterial({ color: '#1b1206', transparent: true }));
        l.renderOrder = 6; contornos.push([o, l]);
      }
    });
    contornos.forEach(([o, l]) => o.add(l));
    interior.traverse(o => { if (o.material) { o.material.transparent = true; if (!o.renderOrder) o.renderOrder = 5; } });
    interior.visible = false;
    scene.add(interior);

    // Pirámide transparente para la vista interior
    const matFantasma = new THREE.MeshBasicMaterial({ color: '#e8d6ad', transparent: true, opacity: 0.09, depthWrite: false, side: THREE.DoubleSide });
    const fantasma = new THREE.Mesh(geoPiramide(A, H), matFantasma);
    fantasma.visible = false; fantasma.renderOrder = 1; scene.add(fantasma);

    // Silueta de la pirámide en la vista interior
    const silueta = new THREE.LineSegments(new THREE.EdgesGeometry(geoPiramide(A, H)), new THREE.LineBasicMaterial({ color: '#5b4a2a' }));
    silueta.visible = false; scene.add(silueta);

    // ---------- Persona a escala (1,65 m) ----------
    const persona = new THREE.Group();
    const piel = new THREE.MeshStandardMaterial({ color: '#8d5a3b', roughness: 0.8 });
    const lino = new THREE.MeshStandardMaterial({ color: '#f5f1e6', roughness: 0.9 });
    const piernas = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.8, 10), piel); piernas.position.y = 0.4;
    const falda = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.42, 12), lino); falda.position.y = 0.92;
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.18, 0.5, 12), piel); torso.position.y = 1.36;
    const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), piel); cabeza.position.y = 1.53;
    const brazoI = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.6, 8), piel); brazoI.position.set(-0.26, 1.3, 0);
    const brazoD = brazoI.clone(); brazoD.position.x = 0.26;
    const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#1b1410' }));
    pelo.position.y = 1.54;
    persona.add(piernas, falda, torso, cabeza, brazoI, brazoD, pelo);
    persona.traverse(o => { o.castShadow = sombras; });
    persona.position.set(A + 6, 0, -A - 6);
    scene.add(persona);

    // ---------- Hora del día (21 de marzo, equinoccio) ----------
    const cDia = { cenit: new THREE.Color('#3a78c0'), horiz: new THREE.Color('#dbe6ec'), sol: new THREE.Color('#fff6e2') };
    const cTarde = { cenit: new THREE.Color('#4a6fa8'), horiz: new THREE.Color('#f2c590'), sol: new THREE.Color('#ffb36b') };
    function ponerHora(hora) {
      const hAng = (hora - 12) * 15 * Math.PI / 180;               // ángulo horario
      const elev = Math.asin(Math.cos(LATITUD) * Math.cos(hAng));   // declinación 0 (equinoccio)
      const azS = Math.atan2(Math.sin(hAng), Math.cos(hAng) * Math.sin(LATITUD)); // desde el sur, + hacia el oeste
      const dir = new THREE.Vector3(-Math.sin(azS) * Math.cos(elev), Math.sin(elev), Math.cos(azS) * Math.cos(elev)).normalize();
      const k = THREE.MathUtils.clamp(elev / (35 * Math.PI / 180), 0, 1);   // 0 = sol bajo, 1 = sol alto
      sol.position.copy(dir).multiplyScalar(1200); sol.target.position.set(0, 0, 0);
      sol.color.copy(cTarde.sol).lerp(cDia.sol, k);
      sol.intensity = 0.5 + 1.25 * Math.sqrt(Math.max(Math.sin(elev), 0));
      hemi.intensity = 0.28 + 0.3 * k;
      uCielo.cenit.value.copy(cTarde.cenit).lerp(cDia.cenit, k);
      uCielo.horizonte.value.copy(cTarde.horiz).lerp(cDia.horiz, k);
      uCielo.dirSol.value.copy(dir);
      uCielo.colorSol.value.copy(sol.color);
      scene.fog.color.copy(uCielo.horizonte.value);
    }
    ponerHora(10);

    // ---------- Cambios de estado ----------
    return {
      persona,
      ponerHora,
      ponerEstado(estado, dentro) {
        // Por dentro se cambia la pirámide por una versión transparente
        completa.visible = estado === 'completa' && !dentro;
        hoy.visible = estado === 'hoy' && !dentro;
        fantasma.visible = interior.visible = silueta.visible = dentro;
        matSuelo.opacity = dentro ? 0.45 : 1; matSuelo.depthWrite = !dentro;
      },
    };
  };
})();
