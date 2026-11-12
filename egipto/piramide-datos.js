/*
  DATOS CIENTÍFICOS DE LA GRAN PIRÁMIDE DE KEOPS
  ==============================================
  Este archivo lo usan la página egipto.html (ficha de datos) y la
  reconstrucción 3D (materiales/1eso/gran-piramide/). Si cambias un dato
  aquí, cambia en los dos sitios.

  Cada dato tiene:
  · nivel: "Medido"      → se ha medido sobre la propia pirámide
           "Estimación"  → cálculo o cifra aproximada de los especialistas
           "Documentado" → lo dicen fuentes escritas o arqueológicas
  · texto:  versión normal
  · facil:  versión de lectura fácil (frases cortas y cifras redondeadas)
  · fuentes: claves de la lista FUENTES (al final del archivo)

  No inventes cifras: si un dato no se puede comprobar, mejor quitarlo.
*/
window.PIRAMIDE = {

  datos: [
    { id: 'faraon', titulo: 'Faraón y dinastía', nivel: 'Documentado',
      valor: 'Keops (Jufu), IV dinastía',
      texto: 'La mandó construir Keops, que los egipcios llamaban Jufu, segundo rey de la IV dinastía. Su nombre aparece en marcas pintadas por los obreros en las cámaras ocultas sobre la Cámara del Rey, y la pirámide se cita como «Horizonte de Jufu» en los papiros de Wadi el-Jarf.',
      facil: 'La mandó hacer el faraón Keops. Los egipcios lo llamaban Jufu. Los obreros pintaron su nombre dentro de la pirámide.',
      fuentes: ['lehner1997', 'tallet2017'] },

    { id: 'fecha', titulo: 'Fecha', nivel: 'Estimación',
      valor: 'Hacia 2589-2566 a. C. (reinado de Keops)',
      texto: 'Se construyó durante el reinado de Keops, hacia 2589-2566 a. C. según la cronología de la Universidad de Oxford. Otras cronologías adelantan o retrasan estas fechas unas décadas: en el Imperio Antiguo no hay fechas exactas.',
      facil: 'Se construyó hace unos 4500 años, hacia el año 2570 antes de Cristo. La fecha exacta no se sabe.',
      fuentes: ['shaw2000'] },

    { id: 'altura', titulo: 'Altura', nivel: 'Estimación',
      valor: '146,6 m al terminarse · unos 138,5 m hoy',
      texto: 'Al terminarse medía unos 146,6 m (280 codos egipcios). Es una estimación, porque la cúspide no se conserva: se calcula a partir de la base y del ángulo de las caras. Hoy mide entre 138,5 y 138,8 m porque ha perdido el piramidión y las hiladas de arriba.',
      facil: 'Medía casi 150 metros, como un edificio de 50 pisos. Hoy mide un poco menos porque ha perdido la punta.',
      fuentes: ['lehner1997', 'petrie1883'] },

    { id: 'base', titulo: 'Lado de la base', nivel: 'Medido',
      valor: '230,3 m de media (440 codos)',
      texto: 'Cada lado de la base mide unos 230,3 m. Entre el lado más largo y el más corto solo hay unos 20 cm de diferencia. La base ocupa más de 5 hectáreas, como siete campos de fútbol.',
      facil: 'Cada lado mide unos 230 metros. La base es tan grande como siete campos de fútbol.',
      fuentes: ['cole1925', 'lehner1997'] },

    { id: 'angulo', titulo: 'Ángulo de las caras', nivel: 'Medido',
      valor: '51° 50′ 40″ (unos 52°)',
      texto: 'Las caras se inclinan unos 51° 50′, lo que corresponde a un «seked» de 5 palmos y medio: los egipcios no usaban grados, sino los palmos que se retira la cara por cada codo de altura. Petrie midió unos 51° 52′ sobre las piedras del revestimiento que aún quedan en la base.',
      facil: 'Las caras están muy inclinadas: unos 52 grados.',
      fuentes: ['petrie1883', 'lehner1997'] },

    { id: 'orientacion', titulo: 'Orientación', nivel: 'Medido',
      valor: 'Hacia los puntos cardinales, con un error de 3-4 minutos de arco',
      texto: 'Cada cara mira a un punto cardinal: norte, sur, este y oeste. El error medio es de solo 3 o 4 minutos de arco (menos de una décima de grado). Probablemente se orientaron observando las estrellas o el Sol.',
      facil: 'Cada cara mira a un punto cardinal: norte, sur, este y oeste. Casi no tiene error.',
      fuentes: ['petrie1883', 'cole1925', 'nell2014'] },

    { id: 'bloques', titulo: 'Bloques y peso', nivel: 'Estimación',
      valor: 'Unos 2,3 millones de bloques · unas 2,5 t de media',
      texto: 'Se calcula que tiene unos 2,3 millones de bloques de piedra, de unas 2,5 toneladas de media, aunque los hay mucho más pequeños y mucho más grandes. En total pesaría unos 6 millones de toneladas.',
      facil: 'Tiene más de 2 millones de bloques de piedra. Cada uno pesa como dos coches.',
      fuentes: ['lehner1997'] },

    { id: 'materiales', titulo: 'Materiales y procedencia', nivel: 'Documentado',
      valor: 'Caliza de Giza, caliza fina de Tura y granito de Asuán',
      texto: 'El núcleo es de caliza local, sacada de canteras junto a la pirámide. El revestimiento exterior era de caliza blanca y fina de Tura, en la otra orilla del Nilo. La Cámara del Rey es de granito rojo traído en barco desde Asuán, a unos 800 km al sur.',
      facil: 'Por dentro es de piedra de Giza. Por fuera tenía piedra blanca de Tura. La cámara del rey es de granito de Asuán, que llegó en barco por el Nilo.',
      fuentes: ['lehner1997', 'tallet2017'] },

    { id: 'duracion', titulo: 'Duración de la obra', nivel: 'Estimación',
      valor: 'Unos 20 años',
      texto: 'Se calcula que la obra duró unos 20 años. Heródoto ya daba esa cifra hacia 450 a. C. Los papiros de Merer, del año 26 o 27 del reinado, muestran que entonces todavía se llevaba caliza de Tura a Giza.',
      facil: 'Tardaron unos 20 años en construirla.',
      fuentes: ['herodoto', 'tallet2017'] },

    { id: 'trabajadores', titulo: 'Mano de obra', nivel: 'Estimación',
      valor: 'Entre unos miles y 20 000-30 000 personas',
      texto: 'Los especialistas calculan que trabajaron desde unos miles de obreros fijos hasta unas 20 000 o 30 000 personas en los momentos de más trabajo, por turnos. Es mucho menos que los 100 000 hombres de los que hablaba Heródoto 2000 años después.',
      facil: 'Trabajaron miles de personas, por turnos. No eran 100 000, como se creía antes.',
      fuentes: ['nova', 'herodoto'] },

    { id: 'camara-rey', titulo: 'Cámara del Rey', nivel: 'Medido',
      valor: 'Unos 10,5 × 5,2 m y 5,8 m de alto',
      texto: 'Es una sala de granito rojo de unos 10,5 por 5,2 m (20 por 10 codos) y 5,8 m de alto, con un sarcófago de granito vacío. Encima tiene cinco cámaras bajas que reparten el enorme peso de la piedra.',
      facil: 'Es una sala de granito rojo, del tamaño de un aula. Dentro hay un sarcófago vacío.',
      fuentes: ['petrie1883', 'lehner1997'] },

    { id: 'galeria', titulo: 'Gran Galería', nivel: 'Medido',
      valor: 'Unos 46,7 m de largo y 8,6 m de alto',
      texto: 'Es un pasillo en cuesta de unos 46,7 m de largo y 8,6 m de alto, con un techo de piedras que sobresalen unas sobre otras (falsa bóveda). Sube hasta la Cámara del Rey.',
      facil: 'Es un pasillo en cuesta muy alto. Sube hasta la cámara del rey.',
      fuentes: ['petrie1883', 'lehner1997'] },

    { id: 'vacio', titulo: 'El «Gran Vacío» (2017)', nivel: 'Medido',
      valor: 'Al menos 30 m de largo, sobre la Gran Galería',
      texto: 'En 2017, el proyecto ScanPyramids detectó con muones, unas partículas que llegan del espacio, un hueco de al menos 30 m de largo sobre la Gran Galería. Se sabe que existe, pero no su forma exacta ni para qué sirvió: puede ser horizontal o inclinado, y uno o varios huecos.',
      facil: 'En 2017 se descubrió un gran hueco escondido. Mide al menos 30 metros. Nadie sabe todavía para qué servía.',
      fuentes: ['morishima2017'] },

    { id: 'corredor', titulo: 'Corredor de la cara norte (2023)', nivel: 'Medido',
      valor: 'Unos 9 m de largo y 2 × 2 m de sección',
      texto: 'En 2023 se confirmó un corredor de unos 9 m de largo y unos 2 m de ancho y de alto, detrás de los grandes bloques en forma de V que hay sobre la entrada original. Se vio por dentro con una cámara diminuta (endoscopio). Su función no se conoce; una hipótesis es que repartía el peso de la piedra.',
      facil: 'En 2023 se encontró un pasillo escondido encima de la entrada. Mide 9 metros. Se vio con una cámara muy pequeña.',
      fuentes: ['procureur2023', 'mta2023'] },
  ],

  // Sección «¿Quién la construyó?»
  quien: {
    texto: [
      'Durante siglos se repitió que las pirámides las hicieron esclavos. La arqueología cuenta otra historia.',
      'Junto a la pirámide se ha excavado el poblado de los trabajadores (Heit el-Ghurab), con panaderías, almacenes y largas naves que pudieron servir de dormitorio. Allí aparecen muchos huesos de vaca, oveja y cabra, y restos de pescado: el Estado alimentaba a los obreros.',
      'Desde 1990 se excavan también sus tumbas, al pie de las pirámides. Muchos esqueletos tienen fracturas que se curaron bien, señal de que alguien los atendió. Para Zahi Hawass, que dirigió la excavación, unas tumbas tan cerca del rey indican que no eran esclavos.',
      'Los papiros de Wadi el-Jarf, hallados en 2013, incluyen el diario de Merer, jefe de un equipo de trabajadores. Cuenta cómo llevaban en barco bloques de caliza de Tura hasta Giza por canales del Nilo, y que dependían de Anjaf, un alto funcionario, probablemente hermanastro del rey.',
      'Lo más probable es que trabajaran especialistas fijos junto a campesinos que acudían por turnos, como una obligación con el Estado. No eran esclavos en el sentido actual, pero tampoco trabajadores libres como hoy: muchos estaban obligados a ir.',
    ],
    facil: [
      'Antes se creía que las pirámides las hicieron esclavos. Hoy sabemos que no fue así.',
      'Junto a la pirámide vivían los trabajadores. Tenían panaderías y comían carne y pescado.',
      'Los enterraban en tumbas cerca de la pirámide. Si se rompían un hueso, alguien los curaba.',
      'Un jefe de obreros llamado Merer escribió un diario. Cuenta cómo llevaban piedras en barco por el Nilo.',
      'Trabajaban por turnos. Muchos eran campesinos que tenían la obligación de ir. No eran esclavos.',
    ],
    fuentes: ['aera', 'hawass', 'tallet2017', 'tallet2021', 'nova'],
  },

  // Fuentes citadas (sección «Para saber más»)
  FUENTES: {
    lehner1997:    { cita: 'Lehner, M. (1997). The Complete Pyramids. Londres: Thames & Hudson.' },
    petrie1883:    { cita: 'Petrie, W. M. F. (1883). The Pyramids and Temples of Gizeh. Londres: Field & Tuer. Copia digital en el Giza Project de la Universidad de Harvard.',
                     url: 'https://gizamedia.rc.fas.harvard.edu/images/MFA-images/Giza/GizaImage/full/library/petrie_gizeh.pdf' },
    cole1925:      { cita: 'Cole, J. H. (1925). Determination of the Exact Size and Orientation of the Great Pyramid of Giza. Survey of Egypt, Paper n.º 39. El Cairo.' },
    nell2014:      { cita: 'Nell, E. y Ruggles, C. (2014). «The orientations of the Giza pyramids and associated structures». Journal of Astronomical History and Heritage, 17(3).',
                     url: 'https://arxiv.org/abs/1302.5622' },
    shaw2000:      { cita: 'Shaw, I. (ed.) (2000). The Oxford History of Ancient Egypt. Oxford: Oxford University Press.' },
    herodoto:      { cita: 'Heródoto, Historia, libro II, 124 (siglo V a. C.).' },
    tallet2017:    { cita: 'Tallet, P. (2017). Les papyrus de la mer Rouge I. Le «journal de Merer». El Cairo: Instituto Francés de Arqueología Oriental (IFAO).' },
    tallet2021:    { cita: 'Tallet, P. y Lehner, M. (2021). The Red Sea Scrolls: How Ancient Papyri Reveal the Secrets of the Pyramids. Londres: Thames & Hudson.' },
    morishima2017: { cita: 'Morishima, K. et al. (2017). «Discovery of a big void in Khufu\'s Pyramid by observation of cosmic-ray muons». Nature, 552, 386-390 (proyecto ScanPyramids).',
                     url: 'https://doi.org/10.1038/nature24647' },
    procureur2023: { cita: 'Procureur, S. et al. (2023). «Precise characterization of a corridor-shaped structure in Khufu\'s Pyramid by observation of cosmic-ray muons». Nature Communications, 14, 1144 (proyecto ScanPyramids).',
                     url: 'https://doi.org/10.1038/s41467-023-36351-0' },
    mta2023:       { cita: 'Ministerio de Turismo y Antigüedades de Egipto: presentación del corredor de la cara norte, 2 de marzo de 2023 (noticia en Archaeology Magazine).',
                     url: 'https://archaeology.org/news/2023/03/02/230303-egypt-pyramid-corridor/' },
    aera:          { cita: 'Ancient Egypt Research Associates (AERA), dirigida por Mark Lehner: excavación de la «Ciudad perdida» de los constructores de pirámides (Heit el-Ghurab).',
                     url: 'https://aeraweb.org/' },
    hawass:        { cita: 'Hawass, Z. «The Pyramid Builders»: el cementerio de los trabajadores de Giza. Copia en el Giza Project de la Universidad de Harvard.',
                     url: 'https://gizamedia.rc.fas.harvard.edu/images/MFA-images/Giza/GizaImage/full/library/hawass_pyramid_builders.pdf' },
    nova:          { cita: 'PBS NOVA, «Who Built the Pyramids?», entrevistas a Mark Lehner y Zahi Hawass.',
                     url: 'https://www.pbs.org/wgbh/nova/article/who-built-the-pyramids/' },
    gizaproject:   { cita: 'Giza Project, Universidad de Harvard: fotografías, planos y documentos de las excavaciones de Giza.',
                     url: 'https://giza.fas.harvard.edu/' },
  },
};
