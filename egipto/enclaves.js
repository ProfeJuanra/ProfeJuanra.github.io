/*
  ENCLAVES DEL MAPA DEL ANTIGUO EGIPTO
  ====================================
  · tipo: "ciudad", "necropolis", "templo" o "cantera" (cantera y puerto)
  · lat / lon: coordenadas aproximadas (grados decimales)
  · zona: "menfis" o "tebas" si el enclave está en una zona que se amplía
  · periodo: época principal (fechas aproximadas; cronología de Shaw, 2000)
  · texto: ficha normal (máximo 60 palabras)
  · facil: ficha de lectura fácil
  · aviso (opcional): nota destacada
  · etiqueta (opcional): posición del nombre respecto al marcador ("d", "i", "ar", "ab")
*/
window.TIPOS_ENCLAVE = {
  ciudad:     { nombre: 'Ciudad',               forma: 'cuadrado' },
  necropolis: { nombre: 'Necrópolis',           forma: 'triangulo' },
  templo:     { nombre: 'Templo o santuario',   forma: 'circulo' },
  cantera:    { nombre: 'Cantera o puerto',     forma: 'rombo' },
};

window.ENCLAVES = [
  // ---------- Zona de Menfis ----------
  { id: 'menfis', nombre: 'Menfis', tipo: 'ciudad', lat: 29.85, lon: 31.25, zona: 'menfis', etiqueta: 'd',
    periodo: 'Desde hacia 3000 a. C. · capital del Imperio Antiguo',
    texto: 'Primera gran capital del Egipto unificado, en el punto donde el estrecho valle del Nilo se abre al delta. Desde aquí se controlaban el Alto y el Bajo Egipto. Era la ciudad del dios Ptah. Sus necrópolis son Giza, Saqqara y Dahshur.',
    facil: 'Fue la primera capital de Egipto. Estaba donde el valle del Nilo se abre en el delta. Sus cementerios son Giza, Saqqara y Dahshur.' },

  { id: 'giza', nombre: 'Giza', tipo: 'necropolis', lat: 29.979, lon: 31.134, zona: 'menfis', etiqueta: 'i',
    periodo: 'IV dinastía · hacia 2600-2500 a. C.',
    texto: 'No es una ciudad: es la necrópolis real de Menfis, sobre una meseta del desierto. Allí están las pirámides de Keops, Kefrén y Micerino, la Gran Esfinge, templos, tumbas de nobles y el poblado de los trabajadores que las construyeron.',
    facil: 'Giza no es una ciudad. Es un cementerio de reyes. Allí están las tres grandes pirámides y la Esfinge.',
    piramide: true },

  { id: 'saqqara', nombre: 'Saqqara', tipo: 'necropolis', lat: 29.871, lon: 31.216, zona: 'menfis', etiqueta: 'i',
    periodo: 'Desde la I dinastía · pirámide de Djoser hacia 2650 a. C.',
    texto: 'Gran necrópolis de Menfis, usada durante 3000 años. Aquí está la pirámide escalonada del rey Djoser, la primera gran construcción de piedra de la historia, atribuida a su arquitecto Imhotep: seis escalones que parecen tumbas apiladas.',
    facil: 'Es otro cementerio de Menfis. Aquí está la primera pirámide, la del rey Djoser. Tiene forma de escalera.' },

  { id: 'dahshur', nombre: 'Dahshur', tipo: 'necropolis', lat: 29.79, lon: 31.209, zona: 'menfis', etiqueta: 'i',
    periodo: 'IV dinastía · rey Snefru',
    texto: 'Necrópolis donde Snefru, padre de Keops, construyó dos pirámides: la Acodada, que cambia de inclinación a mitad de altura, y la Roja, la primera pirámide de caras lisas. Fueron los ensayos que hicieron posible la Gran Pirámide.',
    facil: 'Aquí el rey Snefru, padre de Keops, hizo dos pirámides. Fueron las pruebas antes de la Gran Pirámide.' },

  { id: 'heliopolis', nombre: 'Heliópolis', tipo: 'ciudad', lat: 30.129, lon: 31.307, zona: 'menfis', etiqueta: 'd',
    periodo: 'Desde el Imperio Antiguo',
    texto: 'Ciudad sagrada del dios sol Ra, uno de los grandes centros religiosos de Egipto. Sus sacerdotes eran famosos por su sabiduría. Hoy está bajo El Cairo, pero aún se alza el obelisco que levantó el rey Senusret I hace unos 4000 años.',
    facil: 'Era la ciudad del dios del Sol, Ra. Hoy está debajo de El Cairo. Todavía queda un obelisco.' },

  { id: 'tura', nombre: 'Canteras de Tura', tipo: 'cantera', lat: 29.93, lon: 31.28, zona: 'menfis', etiqueta: 'd',
    periodo: 'Desde el Imperio Antiguo',
    texto: 'Canteras de caliza muy blanca y fina, en la orilla oriental del Nilo. De aquí salió el revestimiento que hacía brillar la Gran Pirámide. El diario de Merer cuenta cómo un equipo de trabajadores llevaba estos bloques en barco hasta Giza.',
    facil: 'De aquí sacaban la piedra blanca que cubría la Gran Pirámide. La llevaban en barco por el Nilo.' },

  // ---------- Delta y norte ----------
  { id: 'avaris', nombre: 'Avaris', tipo: 'ciudad', lat: 30.787, lon: 31.821, etiqueta: 'd',
    periodo: 'Hacia 1650-1550 a. C. · Segundo Periodo Intermedio',
    texto: 'Capital de los hicsos, gobernantes de origen asiático que dominaron el norte de Egipto durante un siglo. Los reyes de Tebas los expulsaron y empezó el Imperio Nuevo. Demuestra que Egipto no siempre estuvo unido ni gobernado por egipcios.',
    facil: 'Fue la capital de los hicsos, unos reyes extranjeros. Gobernaron el norte de Egipto unos cien años.' },

  { id: 'alejandria', nombre: 'Alejandría', tipo: 'ciudad', lat: 31.2, lon: 29.92, etiqueta: 'ab',
    periodo: 'Fundada en el 331 a. C. · época helenística',
    aviso: 'Es mucho más moderna: se fundó unos 2200 años después de la Gran Pirámide.',
    texto: 'Ciudad fundada por Alejandro Magno en el 331 a. C., en época helenística. Fue la capital de los reyes Ptolomeos, de origen griego, hasta Cleopatra. Tuvo el famoso Faro, una de las siete maravillas, y la gran Biblioteca.',
    facil: 'La fundó Alejandro Magno en el año 331 antes de Cristo. Es mucho más moderna que las pirámides. Tenía un faro muy famoso.' },

  // ---------- Egipto Medio ----------
  { id: 'amarna', nombre: 'Amarna', tipo: 'ciudad', lat: 27.645, lon: 30.9, etiqueta: 'd',
    periodo: 'Hacia 1350-1330 a. C. · Imperio Nuevo',
    texto: 'Ciudad nueva, llamada Ajetatón, que fundó el faraón Ajenatón para adorar a un solo dios, Atón, el disco solar. Se abandonó pocos años después de su muerte. Como solo estuvo habitada unos años, los arqueólogos han podido estudiar muy bien cómo era.',
    facil: 'La fundó el faraón Ajenatón para adorar al dios Atón, el disco del Sol. Se abandonó pronto.' },

  { id: 'abidos', nombre: 'Abidos', tipo: 'templo', lat: 26.185, lon: 31.919, etiqueta: 'i',
    periodo: 'Desde hacia 3100 a. C. · templo de Seti I hacia 1290 a. C.',
    texto: 'Lugar sagrado de Osiris, dios de los muertos. Aquí se enterraron los primeros reyes de Egipto. Muchos egipcios peregrinaban a Abidos. El templo de Seti I conserva una lista de los reyes anteriores, muy útil para los historiadores.',
    facil: 'Era el lugar sagrado de Osiris, el dios de los muertos. Aquí están las tumbas de los primeros reyes.' },

  // ---------- Zona de Tebas ----------
  { id: 'tebas', nombre: 'Tebas', tipo: 'ciudad', lat: 25.71, lon: 32.648, zona: 'tebas', etiqueta: 'd',
    periodo: 'Capital en el Imperio Medio y Nuevo · hacia 2050-1070 a. C.',
    texto: 'Gran ciudad del Alto Egipto, hoy Luxor. Fue capital y centro del culto al dios Amón. En la orilla este, la de la vida, estaban la ciudad y los templos; en la oeste, por donde se pone el Sol, las tumbas.',
    facil: 'Fue la capital de Egipto mucho tiempo. Hoy se llama Luxor. Los vivos estaban al este del río y los muertos, al oeste.' },

  { id: 'karnak', nombre: 'Karnak', tipo: 'templo', lat: 25.719, lon: 32.657, zona: 'tebas', etiqueta: 'd',
    periodo: 'Del Imperio Medio a época ptolemaica',
    texto: 'El mayor conjunto de templos de Egipto, dedicado sobre todo a Amón. Cada faraón añadía puertas, patios u obeliscos, y se amplió durante casi 2000 años. Su sala hipóstila tiene 134 enormes columnas.',
    facil: 'Es el templo más grande de Egipto. Está dedicado al dios Amón. Muchos faraones lo hicieron más grande.' },

  { id: 'luxor', nombre: 'Templo de Luxor', tipo: 'templo', lat: 25.7, lon: 32.639, zona: 'tebas', etiqueta: 'ab',
    periodo: 'Imperio Nuevo · Amenhotep III y Ramsés II',
    texto: 'Templo unido a Karnak por una avenida de esfinges de casi 3 km. Cada año, en la fiesta de Opet, las estatuas de los dioses viajaban en barca de un templo a otro entre la multitud. Lo construyeron sobre todo Amenhotep III y Ramsés II.',
    facil: 'Este templo está unido a Karnak por un camino de esfinges. Allí se celebraba una gran fiesta cada año.' },

  { id: 'valle-reyes', nombre: 'Valle de los Reyes', tipo: 'necropolis', lat: 25.74, lon: 32.601, zona: 'tebas', etiqueta: 'i',
    periodo: 'Imperio Nuevo · hacia 1500-1070 a. C.',
    texto: 'Valle escondido en la orilla oeste donde los faraones del Imperio Nuevo excavaron sus tumbas en la roca, en lugar de construir pirámides. Casi todas fueron saqueadas. La de Tutankamón, descubierta por Howard Carter en 1922, apareció casi intacta.',
    facil: 'Aquí los faraones excavaban sus tumbas en la roca. La tumba de Tutankamón se encontró casi entera en 1922.' },

  // ---------- Sur ----------
  { id: 'asuan', nombre: 'Elefantina / Asuán', tipo: 'ciudad', lat: 24.085, lon: 32.887, etiqueta: 'd',
    periodo: 'Desde el Imperio Antiguo',
    texto: 'Frontera sur de Egipto, junto a la primera catarata, donde las rocas cortan el río. Era puerta del comercio con Nubia: oro, marfil y ébano. De sus canteras salió el granito rojo de la Cámara del Rey de la Gran Pirámide.',
    facil: 'Era la frontera sur de Egipto, junto a la primera catarata. De aquí salió el granito rojo de la Gran Pirámide.' },

  { id: 'abu-simbel', nombre: 'Abu Simbel', tipo: 'templo', lat: 22.337, lon: 31.626, etiqueta: 'i',
    periodo: 'Ramsés II · siglo XIII a. C.',
    texto: 'Dos templos excavados en la montaña por Ramsés II en Nubia, con cuatro estatuas gigantes del faraón en la entrada. Entre 1964 y 1968 se cortaron en bloques y se subieron más arriba para salvarlos de las aguas de la presa de Asuán.',
    facil: 'Son dos templos de Ramsés II tallados en la montaña. En el siglo XX los movieron para que no los cubriera el agua de una presa.' },

  // ---------- Mar Rojo ----------
  { id: 'wadi-el-jarf', nombre: 'Wadi el-Jarf', tipo: 'cantera', lat: 28.9, lon: 32.7, etiqueta: 'd', aprox: true,
    periodo: 'Reinado de Keops',
    texto: 'Puerto en la costa del mar Rojo, desde donde salían expediciones al Sinaí en busca de cobre. En 2013 aparecieron aquí los papiros escritos más antiguos que se conocen, entre ellos el diario de Merer, que habla de la construcción de la Gran Pirámide.',
    facil: 'Era un puerto en el mar Rojo. Aquí se encontraron los papiros más antiguos, con el diario de Merer.' },
];
