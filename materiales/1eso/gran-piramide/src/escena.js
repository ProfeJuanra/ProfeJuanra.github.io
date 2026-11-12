/*
  ESCENA 3D DE LA GRAN PIRÁMIDE (modelo procedural, sin modelos descargados)
  Medidas en metros (ver egipto/piramide-datos.js):
  · lado de la base 230,33 m · altura original 146,6 m · altura actual ≈ 138,5 m
  Origen en el centro de la base. x = este, y = altura, z = sur (norte = -z).
  Las posiciones interiores son un ESQUEMA aproximado (Petrie 1883; Lehner 1997).
*/
(function () {
  'use strict';
  const LADO = 230.33, A = LADO / 2, H = 146.6, H_HOY = 138.5;
  const TAN = H / A;                      // pendiente de las caras (≈ 51,84°)
  const EJE_PASILLOS = 7.3;               // los pasillos están 7,3 m al este del eje
  const GROSOR = 2.5;                     // los pasillos se dibujan 2,5 veces más anchos para que se vean

  window.MEDIDAS = { LADO, A, H, H_HOY, TAN, EJE_PASILLOS, GROSOR };

  // Textura de piedra generada en un lienzo (sin imágenes externas)
  function texturaPiedra(base, vetas, juntas, rep) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = vetas[i % vetas.length];
      g.globalAlpha = Math.random() * 0.18;
      g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    g.globalAlpha = 1;
    if (juntas) {
      g.strokeStyle = juntas; g.lineWidth = 1.2;
      for (let y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
      for (let y = 0; y < 256; y += 32) for (let x = (y / 32) % 2 ? 24 : 0; x < 256; x += 48) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return t;
  }

  // Pirámide de caras lisas (sin base) con normales planas
  function geoPiramide(a, h) {
    const v = [
      // norte (-z), este (+x), sur (+z), oeste (-x)
      -a, 0, -a, 0, h, 0, a, 0, -a,
      a, 0, -a, 0, h, 0, a, 0, a,
      a, 0, a, 0, h, 0, -a, 0, a,
      -a, 0, a, 0, h, 0, -a, 0, -a,
    ];
    const uv = [];
    for (let i = 0; i < 4; i++) uv.push(0, 0, 0.5, 1, 1, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
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

  window.construirEscena = function (ctx) {
    const { scene, calidad } = ctx;
    const sombras = calidad !== 'baja';

    // ---------- Cielo, luz y suelo ----------
    scene.background = new THREE.Color('#bcd7ea');
    scene.fog = new THREE.Fog('#d9e4ea', 900, 2600);
    scene.add(new THREE.HemisphereLight('#dfefff', '#c9a66b', 0.55));
    const sol = new THREE.DirectionalLight('#fff3dc', 1.6);
    sol.position.set(380, 300, 140);      // sol de mañana desde el este: la cara este brilla y la norte queda en penumbra
    if (sombras) {
      sol.castShadow = true;
      sol.shadow.mapSize.set(2048, 2048);
      Object.assign(sol.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 50, far: 1200 });
      sol.shadow.bias = -0.0008;
    }
    scene.add(sol);

    const matSuelo = new THREE.MeshStandardMaterial({ map: texturaPiedra('#d8bf8f', ['#b89a63', '#e9d5ac', '#a8885a'], null, 120), roughness: 1, transparent: true });
    const suelo = new THREE.Mesh(new THREE.CircleGeometry(3000, 64), matSuelo);
    suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = sombras;
    scene.add(suelo);

    // Flecha del norte dibujada en el suelo
    const flecha = new THREE.Shape();
    flecha.moveTo(0, -22); flecha.lineTo(9, 6); flecha.lineTo(2.5, 2); flecha.lineTo(2.5, 22); flecha.lineTo(-2.5, 22); flecha.lineTo(-2.5, 2); flecha.lineTo(-9, 6); flecha.closePath();
    const norte = new THREE.Mesh(new THREE.ShapeGeometry(flecha), new THREE.MeshBasicMaterial({ color: '#7a1d1d' }));
    norte.rotation.x = -Math.PI / 2; norte.position.set(-150, 0.3, -150);
    scene.add(norte);

    // ---------- Pirámide recién terminada ----------
    const completa = new THREE.Group();
    const matCaliza = new THREE.MeshStandardMaterial({ color: '#f4efe2', map: texturaPiedra('#f1ece0', ['#ffffff', '#e2dccb'], 'rgba(160,150,125,.25)', 16), roughness: 0.38, metalness: 0, transparent: true });
    const H_PIR = 2.6;                     // piramidión dibujado: tamaño desconocido
    const cuerpo = new THREE.Mesh(geoPiramide(A, H), matCaliza);
    cuerpo.castShadow = sombras; cuerpo.receiveShadow = sombras;
    completa.add(cuerpo);
    const matPiramidion = new THREE.MeshStandardMaterial({ color: '#efe4c8', roughness: 0.3, transparent: true });
    const ap = H_PIR / TAN;
    const piramidion = new THREE.Mesh(geoPiramide(ap * 1.04, H_PIR * 1.04), matPiramidion);
    piramidion.position.y = H - H_PIR * 1.04;
    completa.add(piramidion);
    scene.add(completa);

    // ---------- Pirámide hoy: núcleo escalonado ----------
    const hoy = new THREE.Group();
    const HILADAS = 203;                   // Petrie contó unas 203 hiladas
    const altoHilada = H_HOY / HILADAS;
    const RETRANQUEO = 1.6;                // grosor aproximado del revestimiento que falta
    const matNucleo = new THREE.MeshStandardMaterial({ color: '#d2b07a', map: texturaPiedra('#cba96f', ['#e3c897', '#a9864f', '#bf9a62'], 'rgba(90,65,30,.35)', 6), roughness: 0.95, transparent: true });
    const caja = new THREE.BoxGeometry(1, 1, 1);
    const nucleo = new THREE.InstancedMesh(caja, matNucleo, HILADAS);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < HILADAS; i++) {
      const y0 = i * altoHilada;
      const lado = 2 * Math.max(0.5, A * (1 - y0 / H) - RETRANQUEO);
      m4.compose(new THREE.Vector3(0, y0 + altoHilada / 2, 0), new THREE.Quaternion(), new THREE.Vector3(lado, altoHilada, lado));
      nucleo.setMatrixAt(i, m4);
    }
    nucleo.castShadow = sombras; nucleo.receiveShadow = sombras;
    hoy.add(nucleo);
    // Restos del revestimiento en la base de la cara norte
    const restos = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), matCaliza);
    const restoGeo = new THREE.BufferGeometry();
    const rx = 14, rh = 2.2, rd = rh / TAN;
    restoGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      -rx, 0, -A, rx, 0, -A, rx, rh, -A + rd, -rx, 0, -A, rx, rh, -A + rd, -rx, rh, -A + rd,
      -rx, rh, -A + rd, rx, rh, -A + rd, rx, rh, -A + rd + 1.5, -rx, rh, -A + rd, rx, rh, -A + rd + 1.5, -rx, rh, -A + rd + 1.5,
    ], 3));
    restoGeo.computeVertexNormals();
    restos.geometry = restoGeo; restos.material = matCaliza.clone(); restos.material.side = THREE.DoubleSide;
    hoy.add(restos);
    hoy.visible = false;
    scene.add(hoy);

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

    // ---------- Cambios de estado ----------
    return {
      persona,
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
