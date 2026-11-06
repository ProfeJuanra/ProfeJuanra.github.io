// Datos del dolmen tomados del informe de excavación de 2012 (aportado por J. R. Marcos).
// Coordenadas del plano en metros: x hacia el este, y hacia el norte; origen en el centro de la cámara.
// Rumbo: grados desde el norte en el sentido de las agujas del reloj.
// [DOC] = dato del informe · [DED] = deducido · [HIP] = hipótesis de este proyecto.
window.MOINA = window.MOINA || {};
MOINA.datos = {
  // Corredor y vestíbulo «orientados hacia el Sureste» [DOC]; el rumbo exacto (122°) se mide en el croquis del informe [DED]
  rumboAcceso: 122,

  tumulo: {
    // «unos 24 m de NW a SE y 31,98 m de NE a SW», alzado de 3 a 4 m [DOC]
    ejeLargo: 31.98, ejeCorto: 24, rumboEjeLargo: 45, altura: 3.7,
    // La cámara no está en el centro del túmulo: el acceso queda más cerca del borde sureste [DED, croquis]
    desplazamiento: 3.0,
  },

  camara: {
    // Poligonal de tendencia circular, 13 ortostatos de granito, 3,90 m de diámetro,
    // alzado medio 1,68 m (algunos superan 1,80 m) [DOC]
    diametro: 3.9, radioLosas: 2.08, grueso: 0.32,
    // Cada ortostato: id (U.E. del informe o letra si no está catalogado), rumbo, anchura y altura (m).
    // Las medidas de las U.E. grabadas son las de sus fichas [DOC]; los rumbos se leen en los croquis de las fichas [DED];
    // las losas sin ficha (a-d) usan el alzado medio [DED].
    losas: [
      { id: 'a', rumbo: 148, ancho: 0.95, alto: 1.80 },
      { id: 'b', rumbo: 170, ancho: 0.80, alto: 1.74 },
      { id: '21', rumbo: 190, ancho: 0.59, alto: 1.14 },
      { id: 'c', rumbo: 214, ancho: 0.90, alto: 1.82 },
      { id: '19', rumbo: 240, ancho: 1.08, alto: 1.46 },
      { id: '13', rumbo: 270, ancho: 0.975, alto: 1.47 },
      { id: '12', rumbo: 302, ancho: 1.03, alto: 1.63 },
      { id: '11', rumbo: 333, ancho: 1.076, alto: 1.49 },
      { id: '10', rumbo: 2, ancho: 0.88, alto: 1.68 },
      { id: '9', rumbo: 30, ancho: 1.117, alto: 1.19 },
      { id: 'd', rumbo: 55, ancho: 0.85, alto: 1.80 },
      { id: '8', rumbo: 80, ancho: 0.96, alto: 1.295 },
      { id: '6', rumbo: 104, ancho: 0.609, alto: 1.284 },
    ],
  },

  corredor: {
    // Corto y cubierto; 9 ortostatos más pequeños que los de la cámara, más largos que altos,
    // con altura decreciente hacia fuera; cubierto por losas planas de granito [DOC].
    // Longitud y anchura: medidas en el croquis del informe [DED].
    desde: 2.2, hasta: 5.3, ancho: 0.95, altoInicio: 1.12, altoFin: 0.82,
    norte: 5, sur: 4,
  },

  vestibulo: {
    // Espacio abierto abocinado, 11 ortostatos de granito con altura decreciente hacia fuera [DOC].
    // Longitud y abertura: medidas en el croquis del informe [DED].
    desde: 5.45, hasta: 8.9, anchoInicio: 1.0, anchoFin: 3.2, altoInicio: 0.85, altoFin: 0.38,
    norte: 5, sur: 6,
  },

  // Cronología propuesta en el informe a falta de datación absoluta [DOC]:
  // transición Neolítico/Calcolítico, segunda mitad del IV milenio y primeros siglos del III milenio a. C. (cal.)
  cronologia: 'segunda mitad del IV milenio y primeros siglos del III milenio a. C.',
};

// Motivos grabados de cada ortostato, según las fichas de catalogación de arte del informe [DOC].
// Posición (u, v) en fracciones de la cara: u de izquierda a derecha, v de arriba abajo.
// La colocación exacta dentro de cada piedra es aproximada [DED]: se ha leído en los calcos.
// Tamaños en centímetros.
MOINA.grabados = {
  '6': { tecnica: 'piqueteado', motivos: [
    { t: 'puntos', u: 0.5, v: 0.16, w: 51, h: 45, filas: 8 },
    { t: 'antropomorfo', u: 0.3, v: 0.45, w: 18, h: 34, brazos: 'curvo' },
    { t: 'circulo', u: 0.62, v: 0.4, w: 2.6, h: 2.6 },
    { t: 'antropomorfo', u: 0.7, v: 0.52, w: 12, h: 23, brazos: 'cruz' },
    { t: 'indeterminado', u: 0.5, v: 0.62, w: 30, h: 20 },
    { t: 'circulos', u: 0.35, v: 0.75, w: 22, h: 32, n: 5 },
    { t: 'manchas', u: 0.68, v: 0.78, w: 24, h: 17, n: 5 },
    { t: 'lineasPuntos', u: 0.75, v: 0.92, w: 12, h: 9, n: 3 },
    { t: 'antropomorfoRect', u: 0.22, v: 0.92, w: 16, h: 27 },
  ] },
  '8': { tecnica: 'piqueteado y abrasión', motivos: [
    { t: 'cazoleta', u: 0.68, v: 0.14, w: 7.5 }, { t: 'cazoleta', u: 0.76, v: 0.22, w: 11 }, { t: 'cazoleta', u: 0.84, v: 0.3, w: 8 },
  ] },
  '9': { tecnica: 'piqueteado, abrasión e incisión', motivos: [
    { t: 'trazo', u: 0.2, v: 0.28, w: 2, h: 21 },
    { t: 'rectangulo', u: 0.33, v: 0.5, w: 27, h: 61 },
    { t: 'ramiforme', u: 0.66, v: 0.4, w: 29, h: 42, izq: 10, der: 14, curvo: true },
    { t: 'cazoleta', u: 0.52, v: 0.22, w: 2.8 }, { t: 'cazoleta', u: 0.56, v: 0.26, w: 3.2 },
    { t: 'cazoleta', u: 0.82, v: 0.62, w: 2.2 }, { t: 'cazoleta', u: 0.86, v: 0.66, w: 2 }, { t: 'cazoleta', u: 0.78, v: 0.7, w: 3 },
  ] },
  '10': { tecnica: 'piqueteado y abrasión', motivos: [
    { t: 'trazo', u: 0.32, v: 0.3, w: 4.8, h: 21, sinuoso: true },
    { t: 'ondulado', u: 0.55, v: 0.52, w: 16, h: 112, curvas: 4 },
  ] },
  '11': { tecnica: 'raspado y abrasión', motivos: [
    { t: 'filasCirculos', u: 0.5, v: 0.2, w: 70, h: 32, filas: 4, n: 16 },
    { t: 'circulo', u: 0.72, v: 0.38, w: 4.8, h: 6 },
    { t: 'ce', u: 0.28, v: 0.38, w: 4.3, h: 6.9 },
  ] },
  '12': { tecnica: 'raspado, abrasión e incisión', motivos: [
    { t: 'rectangulo', u: 0.3, v: 0.32, w: 17, h: 43, abierto: true, interior: true },
    { t: 'rectangulo', u: 0.55, v: 0.25, w: 17, h: 25 },
    { t: 'ramiforme', u: 0.65, v: 0.55, w: 26, h: 40, izq: 8, der: 8, giro: 25 },
  ] },
  '13': { tecnica: 'raspado y abrasión', motivos: [
    { t: 'rectangulo', u: 0.3, v: 0.2, w: 17, h: 24, dividido: true },
    { t: 'circuloAbierto', u: 0.47, v: 0.24, w: 16.6, h: 16 },
    { t: 'u', u: 0.3, v: 0.33, w: 20, h: 10.6 },
    { t: 'cazoleta', u: 0.62, v: 0.2, w: 6.2 }, { t: 'cazoleta', u: 0.71, v: 0.21, w: 4.2 },
  ] },
  '19': { tecnica: 'piqueteado, abrasión e incisión', motivos: [
    { t: 'ramiforme', u: 0.35, v: 0.28, w: 13, h: 25, izq: 7, der: 7 },
    { t: 'ramiforme', u: 0.62, v: 0.14, w: 10, h: 14, izq: 6, der: 6 },
    { t: 'ramiforme', u: 0.25, v: 0.4, w: 14, h: 18, izq: 5, der: 5 },
    { t: 'angulo', u: 0.42, v: 0.47, w: 23, h: 36 },
    { t: 'trazo', u: 0.5, v: 0.55, w: 2, h: 36, giro: 50 },
    { t: 'trazo', u: 0.58, v: 0.45, w: 2, h: 12, giro: -20 },
    { t: 'trazo', u: 0.62, v: 0.43, w: 2, h: 9 },
    { t: 'u', u: 0.66, v: 0.4, w: 8.4, h: 6.7 },
    { t: 'trazo', u: 0.58, v: 0.62, w: 3, h: 18, giro: 60 },
    { t: 'cazoleta', u: 0.66, v: 0.66, w: 5.6 },
  ] },
  '21': { tecnica: 'abrasión', motivos: [
    { t: 'ondulado', u: 0.5, v: 0.5, w: 14.5, h: 64, curvas: 4, base: true },
  ] },
  'acceso': { tecnica: 'piqueteado y abrasión', motivos: [
    { t: 'cazoleta', u: 0.3, v: 0.25, w: 3.3 }, { t: 'cazoleta', u: 0.48, v: 0.2, w: 3.6 }, { t: 'cazoleta', u: 0.66, v: 0.28, w: 3.7 },
  ] },
};
