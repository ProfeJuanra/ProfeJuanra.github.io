/*
  PUNTOS DE INFORMACIÓN DE LA RECONSTRUCCIÓN 3D
  =============================================
  Coordenadas en metros. Origen: centro de la base. x = este, y = altura,
  z = sur (el norte es z negativo).
  · modo: "fuera" (vista exterior), "dentro" (vista interior) o "ambos"
  · estado: "completa", "hoy" o "ambos" (en qué versión de la pirámide se ve)
  · nivel: "Medido", "Estimación", "Documentado" o "Hipótesis"
  · dato (opcional): id del dato de egipto/piramide-datos.js que se enseña debajo
*/
window.PUNTOS = [
  { n: 1, id: 'piramidion', titulo: 'El piramidión', pos: [0, 148, 0], modo: 'fuera', estado: 'completa', nivel: 'Hipótesis',
    texto: 'La punta de la pirámide era una piedra en forma de pequeña pirámide. El de Keops no se ha conservado, así que no sabemos de qué material era ni cómo era. Que estuviera recubierto de oro es solo una hipótesis. Aquí se ha dibujado de caliza, como el revestimiento.',
    facil: 'La punta era una pequeña pirámide de piedra. Se ha perdido. No sabemos cómo era.' },

  { n: 2, id: 'revestimiento', titulo: 'Revestimiento de caliza blanca', pos: [64, 66, 18], modo: 'fuera', estado: 'completa', nivel: 'Documentado', dato: 'materiales',
    texto: 'Al terminarse, toda la pirámide estaba cubierta por bloques de caliza fina de Tura, cortados con el ángulo exacto de las caras y pulidos. Las caras eran lisas y brillaban al sol. Casi todo este revestimiento se arrancó siglos después para aprovechar la piedra.',
    facil: 'Por fuera tenía piedras blancas y lisas. Brillaba al sol. Después se llevaron casi todas esas piedras.' },

  { n: 3, id: 'nucleo', titulo: 'El núcleo escalonado', pos: [62, 66, 18], modo: 'fuera', estado: 'hoy', nivel: 'Medido', dato: 'bloques',
    texto: 'Sin el revestimiento se ve el núcleo: más de 200 hiladas de bloques de caliza local, por eso hoy parece una escalera gigante. La pirámide ha perdido además la punta: mide unos 8 m menos que al terminarse.',
    facil: 'Hoy se ven los bloques de dentro, como una escalera gigante. Ha perdido la punta.' },

  { n: 4, id: 'restos', titulo: 'Restos del revestimiento', pos: [0, 3, -118], modo: 'fuera', estado: 'hoy', nivel: 'Medido', dato: 'angulo',
    texto: 'En la base de la cara norte quedan algunos bloques del revestimiento original. Sobre ellos se ha medido el ángulo de las caras y se comprueba lo bien ajustados que estaban.',
    facil: 'Abajo, en la cara norte, quedan algunas piedras blancas del revestimiento.' },

  { n: 5, id: 'base', titulo: 'La base', pos: [117, 2, 30], modo: 'ambos', estado: 'ambos', nivel: 'Medido', dato: 'base',
    texto: 'La base es casi un cuadrado perfecto, de unos 230 m de lado, sobre una plataforma nivelada en la roca. Para trazarla así hacían falta medidas muy precisas y mucha organización.',
    facil: 'La base es un cuadrado casi perfecto de 230 metros de lado.' },

  { n: 6, id: 'orientacion', titulo: 'Orientada al norte', pos: [-150, 2, -150], modo: 'fuera', estado: 'ambos', nivel: 'Medido', dato: 'orientacion',
    texto: 'La flecha del suelo marca el norte. Cada cara mira casi exactamente a un punto cardinal: la entrada está en la cara norte.',
    facil: 'La flecha marca el norte. Cada cara mira a un punto cardinal.' },

  { n: 7, id: 'entrada', titulo: 'Entrada original', pos: [7.3, 19, -103], modo: 'ambos', estado: 'ambos', nivel: 'Medido',
    texto: 'La entrada original está en la cara norte, a unos 17 m de altura y un poco desplazada hacia el este. Encima tiene grandes bloques colocados en forma de V. Hoy los visitantes entran por un túnel más bajo, abierto por saqueadores.',
    facil: 'La puerta está en la cara norte, a unos 17 metros de altura.' },

  { n: 8, id: 'persona', titulo: 'Una persona a escala', pos: [122, 3, -122], modo: 'ambos', estado: 'ambos', nivel: 'Medido', dato: 'altura',
    texto: 'Junto a la esquina noreste hay una persona de 1,65 m. Pulsa «Escala humana» para acercarte: la pirámide medía casi 90 veces su altura.',
    facil: 'Aquí hay una persona. La pirámide es casi 90 veces más alta que ella.' },

  // --------- Interior ---------
  { n: 9, id: 'descendente', titulo: 'Pasillo descendente', pos: [7.3, -6, -56], modo: 'dentro', estado: 'ambos', nivel: 'Medido',
    texto: 'Desde la entrada, un pasillo estrecho baja en línea recta con una pendiente de unos 26°. Atraviesa la pirámide y se hunde en la roca hasta unos 30 m bajo la base.',
    facil: 'Es un pasillo estrecho que baja hasta debajo de la pirámide.' },

  { n: 10, id: 'subterranea', titulo: 'Cámara subterránea', pos: [1, -26, 5.6], modo: 'dentro', estado: 'ambos', nivel: 'Medido',
    texto: 'Sala excavada en la roca, a unos 30 m bajo la base. Está sin terminar: el suelo es irregular. Quizá el plan cambió durante la obra y se decidió poner la cámara funeraria más arriba.',
    facil: 'Es una sala excavada en la roca, debajo de la pirámide. No se terminó.' },

  { n: 11, id: 'ascendente', titulo: 'Pasillo ascendente', pos: [7.3, 14, -59], modo: 'dentro', estado: 'ambos', nivel: 'Medido',
    texto: 'Sale del pasillo descendente y sube con la misma pendiente. Tras el entierro se cerró con grandes bloques de granito, que aún siguen en su sitio.',
    facil: 'Este pasillo sube hacia las cámaras. Se cerró con bloques de granito.' },

  { n: 12, id: 'reina', titulo: 'Cámara de la Reina', pos: [4.4, 25, 0], modo: 'dentro', estado: 'ambos', nivel: 'Medido',
    texto: 'Sala de caliza con techo a dos aguas, justo en el eje de la pirámide. Su nombre es moderno y engaña: no era la tumba de una reina. Su función no se conoce con seguridad.',
    facil: 'Se llama Cámara de la Reina, pero no era de una reina. No sabemos para qué servía.' },

  { n: 13, id: 'galeria', titulo: 'Gran Galería', pos: [7.3, 37, -21], modo: 'dentro', estado: 'ambos', nivel: 'Medido', dato: 'galeria',
    texto: 'Gran pasillo en cuesta, mucho más alto que los demás, con techo de falsa bóveda. Pudo servir para guardar los bloques que cerraron el pasillo ascendente.',
    facil: 'Es un pasillo en cuesta muy alto que sube hacia la cámara del rey.' },

  { n: 14, id: 'rey', titulo: 'Cámara del Rey', pos: [3.1, 50, 7.6], modo: 'dentro', estado: 'ambos', nivel: 'Medido', dato: 'camara-rey',
    texto: 'Cámara funeraria de granito rojo de Asuán, con el sarcófago vacío de Keops. Encima hay cinco cámaras bajas que reparten el peso. En ellas aparecieron marcas de los obreros con el nombre del rey.',
    facil: 'Es la sala del sarcófago del rey. Es de granito rojo.' },

  { n: 15, id: 'vacio', titulo: 'El Gran Vacío (hallazgo de 2017)', pos: [7.3, 52, -20], modo: 'dentro', estado: 'ambos', nivel: 'Hipótesis', dato: 'vacio',
    texto: 'Hueco de al menos 30 m detectado en 2017 con partículas llamadas muones. Su existencia está comprobada, pero su forma, su posición exacta y su función son DESCONOCIDAS. Aquí se dibuja solo como una zona aproximada.',
    facil: 'En 2017 se descubrió un hueco escondido. No sabemos qué forma tiene ni para qué servía.' },

  { n: 16, id: 'corredor', titulo: 'Corredor de la cara norte (2023)', pos: [7.3, 27, -90], modo: 'dentro', estado: 'ambos', nivel: 'Medido', dato: 'corredor',
    texto: 'Corredor de unos 9 m confirmado en 2023 detrás de los bloques en V que hay sobre la entrada. Se vio con un endoscopio. Su función no se conoce.',
    facil: 'Es un pasillo escondido encima de la entrada. Se encontró en 2023.' },
];
