/*
  GEOGRAFÍA DEL MAPA (líneas de costa, Nilo, delta, mares y rótulos)
  ==================================================================
  Coordenadas aproximadas [latitud, longitud]. Es un mapa esquemático para
  1.º ESO: no dibuja el lago Nasser ni las fronteras actuales, que no
  existían en la Antigüedad.
*/
window.GEO_EGIPTO = {
  // Límites del mapa
  marco: { latN: 32.0, latS: 21.2, lonO: 28.4, lonE: 35.6 },

  // Mar Mediterráneo: polígono desde la esquina noroeste siguiendo la costa
  mediterraneo: [
    [32.0, 28.4], [30.92, 28.4], [30.83, 28.95], [31.05, 29.55], [31.2, 29.9], [31.32, 30.07],
    [31.47, 30.37], [31.56, 30.7], [31.6, 31.0], [31.52, 31.4], [31.52, 31.84], [31.3, 32.2],
    [31.2, 32.4], [31.1, 32.6], [31.15, 33.2], [31.13, 33.8], [31.3, 34.25], [31.6, 34.5],
    [32.0, 34.75],
  ],

  // Mar Rojo con los golfos de Suez y de Áqaba
  marRojo: [
    [29.97, 32.55], [29.6, 32.35], [29.1, 32.66], [28.6, 32.85], [28.3, 33.1], [27.9, 33.4],
    [27.25, 33.82], [26.7, 33.95], [26.1, 34.28], [25.5, 34.6], [25.0, 34.9], [24.3, 35.3],
    [23.9, 35.5], [23.6, 35.6], [27.6, 35.6], [27.9, 35.2], [28.0, 34.85], [28.4, 34.78],
    [29.0, 34.85], [29.53, 35.0], [29.5, 34.9], [29.0, 34.67], [28.5, 34.52], [28.0, 34.43],
    [27.73, 34.25], [28.2, 33.6], [28.6, 33.2], [29.1, 32.9], [29.5, 32.72], [29.95, 32.58],
  ],

  // Tierras fértiles del delta
  delta: [
    [30.19, 31.12], [30.5, 30.75], [30.9, 30.35], [31.15, 30.08], [31.32, 30.07], [31.47, 30.37],
    [31.56, 30.7], [31.6, 31.0], [31.52, 31.4], [31.52, 31.84], [31.3, 32.2], [30.9, 32.05],
    [30.6, 31.85], [30.4, 31.5], [30.19, 31.12],
  ],

  // Curso del Nilo, de sur a norte, hasta el vértice del delta
  nilo: [
    [21.2, 30.82], [21.5, 30.95], [21.75, 31.25], [21.95, 31.35], [22.2, 31.5], [22.36, 31.66],
    [22.55, 31.9], [22.65, 32.02], [22.75, 32.25], [23.0, 32.6], [23.3, 32.82], [23.65, 32.9],
    [23.97, 32.88], [24.085, 32.89], [24.47, 32.94], [24.98, 32.88], [25.29, 32.55], [25.5, 32.53],
    [25.62, 32.6], [25.66, 32.62], [25.7, 32.63], [25.74, 32.64], [25.8, 32.66], [26.0, 32.75],
    [26.16, 32.72], [26.08, 32.4], [26.05, 32.25], [26.33, 31.9], [26.56, 31.7], [26.85, 31.45],
    [27.18, 31.18], [27.4, 30.95], [27.645, 30.86], [28.1, 30.76], [28.5, 30.82], [29.07, 31.1],
    [29.4, 31.2], [29.75, 31.29], [29.85, 31.275], [29.93, 31.255], [29.98, 31.225], [30.05, 31.23],
    [30.19, 31.12],
  ],

  // Brazos del delta (hoy hay dos; en la Antigüedad había más)
  brazos: [
    [[30.19, 31.12], [30.6, 30.85], [31.0, 30.6], [31.46, 30.37]],
    [[30.19, 31.12], [30.6, 31.3], [31.0, 31.4], [31.52, 31.84]],
  ],

  // Oasis de El Fayum y su lago
  fayum: { centro: [29.3, 30.85], radio: 0.28, lago: [29.47, 30.62] },

  // Cataratas: zonas de rocas que cortan el río
  cataratas: [
    { nombre: '1.ª catarata', pos: [24.0, 32.88] },
    { nombre: '2.ª catarata', pos: [21.62, 31.12] },
  ],

  // Frontera tradicional entre el Alto y el Bajo Egipto (al sur de Menfis)
  frontera: [[29.68, 30.7], [29.68, 31.75]],

  // Rótulos: [lat, lon, texto, clase, giro]
  rotulos: [
    [31.78, 30.4, 'MAR MEDITERRÁNEO', 'mar', 0],
    [26.95, 34.72, 'MAR ROJO', 'mar', -62],
    [29.25, 33.95, 'SINAÍ', 'region', 0],
    [27.3, 29.25, 'DESIERTO OCCIDENTAL', 'desierto', -90],
    [22.85, 34.35, 'DESIERTO ORIENTAL', 'desierto', -90],
    [30.98, 31.0, 'BAJO EGIPTO', 'pais', 0],
    [30.78, 31.0, '(el delta)', 'nota', 0],
    [27.1, 32.25, 'ALTO EGIPTO', 'pais', -62],
    [27.0, 32.43, '(el valle)', 'nota', -62],
    [22.85, 31.0, 'NUBIA', 'region', 0],
    [28.6, 30.15, 'El Fayum', 'nota', 0],
    [29.6, 31.75, 'frontera tradicional', 'nota-peq', 0],
    [25.15, 32.35, 'Nilo', 'rio', -80],
    [28.3, 31.0, 'Nilo', 'rio', 80],
  ],

  // Zonas que se pueden ampliar (en grados)
  zonas: {
    menfis: { nombre: 'Zona de Menfis', latN: 30.2, latS: 29.72, lonO: 30.98, lonE: 31.45 },
    tebas:  { nombre: 'Zona de Tebas',  latN: 25.775, latS: 25.665, lonO: 32.555, lonE: 32.705 },
  },
};
