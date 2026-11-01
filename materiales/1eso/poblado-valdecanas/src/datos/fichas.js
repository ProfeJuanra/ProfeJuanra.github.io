// Textos de los puntos de interés (PDI), en tres niveles, y glosario.
// Fuentes abreviadas: [Art.] artículo de Lara, Valiente y Marcos; [Inf.] informe preliminar de 2008.
// Ver docs/INVESTIGACION.md. Nivel: 1 documentado, 2 deducido, 3 hipótesis.
// vista: [x, y, altura sobre el suelo, x, y, altura] de la cámara y su objetivo, en coordenadas del plano.
window.VALDE = window.VALDE || {};
VALDE.fichas = [
  {
    n: 1, titulo: 'La cabaña', nivel: [1, 3], nivelTexto: 'Planta documentada · paredes deducidas · tejado hipotético',
    fuente: '[Inf.] estructura 31; [Art.] §4.1; Fonseca de la Torre et al. 2022',
    vista: [-2.5, -8.5, 5, -14.3, 0, 1],
    basico: 'Aquí vivía una familia. Los arqueólogos encontraron el suelo de la cabaña, un poco hundido en la tierra: medía 10,5 metros de largo y 2,6 de ancho. Las paredes eran de ramas cubiertas de barro; lo sabemos porque aparecieron trozos de barro con huellas de ramas. Dentro había dos pequeños silos. El tejado lo imaginamos nosotros: no se ha conservado.',
    ampliacion: 'La estructura 31 es el único fondo de cabaña seguro del yacimiento: una planta alargada de 10,56 × 2,59 m, excavada en la arcilla de la terraza, que conserva unos 30 cm de relleno y contiene dos silos coetáneos. No aparecieron agujeros de poste, porque la erosión arrasó la superficie sobre la que se vivía. Los fragmentos de adobe y de barro con improntas vegetales hallados en muchos hoyos proceden de paredes de entramado vegetal manteado con barro, una técnica bien estudiada en asentamientos del Calcolítico de la Meseta Norte. La altura de las paredes, los postes, la cubierta vegetal con caballete y la puerta son hipótesis de este proyecto: otra reconstrucción igual de válida podría proponer, por ejemplo, una cubierta abovedada de ramas. Las otras tres cabañas que ves son hipotéticas: los adobes repartidos por el yacimiento indican que hubo más viviendas, pero no sabemos dónde.',
    facil: 'Esta es una casa. Las paredes eran de ramas y barro. El suelo estaba un poco hundido. Dentro guardaban comida en dos agujeros. No sabemos cómo era el tejado.',
  },
  {
    n: 2, titulo: 'Despensas bajo tierra', nivel: [1], nivelTexto: 'Documentado',
    fuente: '[Art.] §4.2; [Inf.] estructuras 22 y 33',
    vista: [21.5, 11.5, 2.4, 18.1, 7.9, -0.5],
    basico: 'Estos agujeros son silos: despensas excavadas en el suelo para guardar el grano. Tienen forma de campana, con la boca estrecha y el fondo ancho. Así se cerraban bien y el grano se conservaba sin aire, a salvo de bichos y hongos. En el fondo ponían lajas de pizarra y grandes vasijas de barro. En uno de ellos apareció una espiga de trigo.',
    ampliacion: 'La mayoría de las 36 estructuras excavadas son silos de planta circular u oval, paredes acampanadas y fondo plano, de 1 a 1,5 m de diámetro y hasta casi 1 m de profundidad conservada. La forma de campana permite sellar la boca: dentro se crea un ambiente sin oxígeno que frena la germinación del grano y el ataque de insectos y hongos. En los silos 22 y 33 se documentó una cama de lajas de pizarra y cantos rodados sobre la que se apoyaban grandes vasijas de almacén; en el 33 apareció además una espiga de trigo completa. Un silo de 1,5 m de diámetro y 1 m de hondo podía guardar más de 1.700 litros. Muchos silos juntos indican que se producía más de lo que se comía cada día: era una reserva para los años malos, probablemente gestionada por toda la comunidad. El cierre de barro y lajas que ves en los silos tapados es una deducción.',
    facil: 'Esto es un silo. Es un agujero para guardar el grano. Tiene forma de campana. Lo tapaban con barro. Así el grano no se estropeaba.',
  },
  {
    n: 3, titulo: 'Del silo al basurero', nivel: [1], nivelTexto: 'Documentado',
    fuente: '[Inf.] estructuras 17, 18 y 19; [Art.] §4.2',
    vista: [9.5, 7.5, 3.2, 13, 2.8, -0.2],
    basico: 'Cuando un silo se estropeaba, lo usaban como basurero y lo llenaban de restos: cerámica rota, huesos, piedras de moler. Luego excavaban otro al lado. Aquí, el silo 19 corta al 18, y el 18 corta al 17. Así los arqueólogos saben cuál es más antiguo: el que está cortado. Las manchas oscuras del suelo son silos ya rellenos.',
    ampliacion: 'Los silos de Valdecañas tuvieron dos vidas. Primero fueron despensas; cuando dejaron de servir, se rellenaron de forma rápida e intencionada con basura doméstica: vasijas rotas, huesos de animales domésticos, restos de talla de sílex, fragmentos de molinos, adobes y pesas de telar. Gracias a eso se ha conservado casi todo lo que sabemos del poblado. Las relaciones de corte permiten ordenar los hoyos en el tiempo, siguiendo el método de registro estratigráfico de Harris: el 17 fue el primero, el 18 lo cortó y el 19 cortó a ambos. Lo mismo ocurre con el 20 y el 21, o con el espacio de trabajo 11/3 y el hogar 11/4. Por eso no todos los silos funcionaron a la vez, y en esta reconstrucción unos aparecen en uso y otros ya rellenos. Sin dataciones por radiocarbono no podemos saber cuántos años separan unos de otros: el autor piensa que hubo varias ocupaciones.',
    facil: 'Los silos viejos se usaban como basureros. Después hacían otro silo al lado. El silo nuevo rompe un trozo del viejo. Así sabemos cuál es más antiguo.',
  },
  {
    n: 4, titulo: 'La zanja de drenaje', nivel: [1], nivelTexto: 'Documentado (la profundidad original es hipótesis)',
    fuente: '[Art.] §4.3; [Inf.] estructuras 30 y 32',
    vista: [-2.5, -5, 3.5, 3.5, -12, -0.5],
    basico: 'Esta zanja medía unos 40 metros de largo y algo más de 2 de ancho. Servía para sacar el agua de lluvia hacia una vaguada y proteger los silos de la humedad, que pudre el grano. Había que limpiarla a menudo, seguramente entre todos. No es un foso de defensa: no rodea el poblado.',
    ampliacion: 'La zanja tiene unos 40 m de longitud, entre 2 y 2,40 m de anchura, 61 cm de profundidad conservada y sección en U. Desemboca en una vaguada natural y en su recorrido toca las estructuras 30 a 36. Por su trazado se interpreta como un canal para evacuar el agua de lluvia y proteger las estructuras de almacenamiento, ya que la humedad es el peor enemigo de un silo. Una obra así exige limpiezas periódicas, probablemente colectivas. Cuando se rellenó con basura, fauna, adobes y muchos cantos rodados, el sistema ya había dejado de funcionar. Es importante no confundirla con los fosos que rodean algunos poblados calcolíticos de la Meseta y del sur, como los de la cuenca de Madrid o Cortijo Lobato, en Almendralejo: aquí no hay un recinto cerrado, sino una obra de drenaje. En el modelo la hemos hecho unos 30 cm más honda de lo conservado, para compensar la erosión.',
    facil: 'Esto es una zanja. Llevaba el agua de la lluvia lejos de los silos. Así el grano no se mojaba. La limpiaban entre todos.',
  },
  {
    n: 5, titulo: 'El hogar y la molienda', nivel: [1, 3], nivelTexto: 'Documentado (el fuego encendido es hipótesis)',
    fuente: '[Inf.] estructura 11/4; [Art.] §5.3',
    vista: [14, -13.8, 2.8, 9.8, -10.3, 0.3],
    basico: 'Este es un hogar al aire libre, hecho con adobes en círculo. Junto a él aparecieron huesos de animales y trozos de molino. Las personas molían el cereal de rodillas: frotaban un canto de cuarcita sobre una piedra plana de granito. Así hacían harina. Cerca hay cuencos, platos y ollas hechos a mano, sin torno.',
    ampliacion: 'El hogar 11/4 es una construcción circular de adobes de 1,72 m de diámetro, levantada al aire libre y no dentro de una cabaña. Corta un hoyo anterior (11/3) que se interpretó como espacio de trabajo doméstico, y junto a él aparecieron restos de fauna doméstica y dos fragmentos de molino. Los molinos de mano son muy abundantes en Valdecañas: una piedra plana de granito sobre la que se frotaba una moleta de cuarcita. Confirman el peso del cereal en la dieta, aunque en la comarca también era frecuente moler bellota. La cerámica, más de 6.000 fragmentos, está hecha a mano. Predominan los cuencos (57 %), seguidos de platos, ollas y vasos. Casi toda se coció con oxígeno, lo que da colores marrones y rojizos; una parte, sin oxígeno, sale negra o gris; y unas pocas llevan almagra, un engobe rojo intenso. Que el fuego esté encendido justo en este momento es una licencia de la reconstrucción.',
    facil: 'Esto es un fuego para cocinar. Está hecho con ladrillos de barro. Al lado, una persona muele grano. Usa dos piedras. Así hace harina.',
  },
  {
    n: 6, titulo: 'Taller de sílex', nivel: [1, 3], nivelTexto: 'Documentado (el lugar exacto es hipótesis)',
    fuente: '[Art.] §5.2 y §5.3',
    vista: [-1.5, 0, 2.6, -7, -5, 0.4],
    basico: 'Casi todas las herramientas eran de piedra. Golpeando un bloque de sílex sacaban láminas afiladas que servían de cuchillo o de dientes para las hoces. También hacían puntas de flecha. Con hachas de una piedra dura y pulida, el gabro, cortaban árboles y trabajaban la madera. Aparecieron muchos núcleos: tallaban aquí mismo.',
    ampliacion: 'Se estudiaron 473 piezas de piedra tallada: dos de cada tres son de sílex y una de cada cuatro, de cuarcita. Predominan los restos de talla (lascas y lasquitas) y hay 43 núcleos, un 8 % del total, lo que indica que la talla se hacía en el propio poblado aprovechando los nódulos de sílex de las arenas de la comarca. Entre los útiles destacan las láminas, de sección triangular o trapezoidal, usadas como cuchillos o como dientes de hoz; también hay perforadores, piezas con muescas, punzones y dos puntas de flecha de base cóncava con retoque plano por ambas caras, un tipo muy característico del Calcolítico (una apareció en la cabaña y otra en la zanja). Las hachas y azuelas pulimentadas son de gabro, una roca dura y tenaz, imprescindible para abrir campos y construir casas. No sabemos en qué punto exacto del poblado se tallaba: lo situamos aquí como hipótesis.',
    facil: 'Aquí hacen herramientas de piedra. Golpean una piedra llamada sílex. Salen trozos muy afilados. Sirven de cuchillo. Con hachas de piedra cortan madera.',
  },
  {
    n: 7, titulo: 'El telar', nivel: [1, 2], nivelTexto: 'Pesas documentadas · telar deducido',
    fuente: '[Art.] §5.4',
    vista: [-13, 7.5, 2.4, -16.6, 4.6, 1],
    basico: 'En Valdecañas aparecieron pesas de telar: placas de barro con dos agujeros. Se colgaban de los hilos de un telar vertical para mantenerlos tensos mientras se tejía. Así sabemos que aquí se hacían telas, seguramente de lana de oveja y de lino. Las telas no se han conservado.',
    ampliacion: 'Entre los materiales hay varias pesas de telar: una placa rectangular de barro con dos perforaciones en la parte superior (estructura 32) y un canto ovalado perforado (estructura 33). Las placas de barro con dos agujeros son muy características de los poblados calcolíticos de buena parte de la Península. Se colgaban de los hilos de la urdimbre de un telar vertical para tensarlos, de modo que el tejido avanzaba de arriba abajo. Demuestran que en el poblado se producían tejidos, probablemente de lino y de lana: las ovejas están identificadas entre los huesos. Sin embargo, no se ha conservado ningún resto de tela ni de fibra. La forma exacta del telar, sus medidas y el color natural de los tejidos que ves son deducciones a partir de paralelos y de la arqueología experimental.',
    facil: 'Esto es un telar. Sirve para hacer tela. Las piedras de abajo tiran de los hilos. La tela era de lana o de lino.',
  },
  {
    n: 8, titulo: 'Campos y ganado', nivel: [1, 2], nivelTexto: 'Trigo, vacas y ovejas documentados · cebada, leguminosas, cabras y cerdos deducidos',
    fuente: '[Inf.] estructura 33; [Art.] §5.5; Liesau et al. 2008',
    vista: [-6, 42, 6, -14, 58, 0.5], marcador: [-14, 58],
    basico: 'Las personas de Valdecañas eran campesinas. Cultivaban trigo (apareció una espiga en un silo) y seguramente cebada, habas y guisantes. Segaban con hoces de madera y dientes de sílex. Criaban vacas y ovejas, y probablemente cabras, cerdos y perros. También recogían bellotas en el encinar.',
    ampliacion: 'La economía del poblado era agrícola y ganadera. El trigo está documentado por una espiga completa hallada en el silo 33. La cebada y las leguminosas (habas, guisantes) son deducciones: es la combinación habitual en el Calcolítico peninsular, y alternarlas enriquece el suelo con nitrógeno. Los silos, los molinos y los grandes contenedores apuntan en la misma dirección, aunque falta un estudio sistemático de semillas. Entre los huesos hay bóvidos y ovejas; las cabras, los cerdos y los perros se deducen por paralelos del valle del Tajo, como Camino de las Yeseras (Madrid). Una pregunta abierta es si las vacas se criaban por la carne, por la leche o como fuerza de tiro. No hay caballos: su domesticación en esta época es muy discutida. Tampoco gallinas, que llegaron mucho después con los fenicios. La situación de los campos alrededor del poblado es hipotética.',
    facil: 'Aquí cultivan trigo. Lo cortan con hoces de piedra. También cuidan vacas y ovejas. Recogen bellotas en el bosque.',
  },
  {
    n: 9, titulo: '¿Dónde está el metal?', nivel: [1], nivelTexto: 'Documentado (ausencia de metal)',
    fuente: '[Art.] §6 y §7',
    vista: [34, -30, 16, 4, 2, 0],
    basico: 'Este periodo se llama Edad del Cobre, pero en Valdecañas no apareció ningún objeto de metal. Al principio del Calcolítico el cobre era raro y la piedra seguía siendo lo más usado. Este poblado era pequeño y abierto, sin murallas, en lo alto de una meseta con el Tajo al sur. En el sur de Extremadura, en cambio, hubo grandes poblados con fosos y murallas.',
    ampliacion: 'El Calcolítico, o Edad del Cobre, ocupa a grandes rasgos el III milenio a. C. Su nombre viene del primer uso del cobre, pero durante buena parte del periodo los objetos de metal fueron escasos. Lo importante fue el cambio en la forma de vivir: más población, más tierra cultivada y más excedentes guardados en silos. En Valdecañas no hay metal, ni cerámica campaniforme, ni ídolos, ni objetos de prestigio, lo que apoya una fecha antigua, de la primera mitad del III milenio. Comparado con su entorno, el asentamiento se parece a los campos de hoyos de la Meseta (Las Matillas, Fuente Celada) y es muy distinto de los grandes recintos del sur. Allí estaban San Blas, en Cheles, con unas 30 ha y murallas; Cortijo Lobato, en Almendralejo, con murallas y fosos concéntricos; y Valencina, en Sevilla, con más de 235 ha. Las diferencias no se deben solo a la geografía, sino también al tiempo: Valdecañas sería anterior al apogeo de esos grandes centros.',
    facil: 'Es la Edad del Cobre. Pero aquí no apareció cobre. Usaban herramientas de piedra. El pueblo era pequeño. No tenía murallas.',
  },
  {
    n: 10, titulo: 'El dolmen de Guadalperal', nivel: [1, 3], nivelTexto: 'Dolmen documentado · relación con el poblado hipotética',
    fuente: '[Art.] §2 y §8; BOE, Real Decreto 371/2022; Leisner y Leisner 1960',
    vista: [-2478, -621, 7, -2500, -600, 1.2], marcador: [-2500, -600],
    basico: 'A unos 2,5 kilómetros, junto al antiguo cauce del Tajo, está el dolmen de Guadalperal: una gran tumba colectiva con una cámara de losas de granito, un corredor de casi 10 metros y un montículo de tierra y piedras encima. Lo hemos abierto por un lado para que veas su interior. Puede que este poblado enterrara allí a sus muertos, pero no lo sabemos.',
    ampliacion: 'El dolmen de Guadalperal, en el término de El Gordo, es un gran sepulcro megalítico con una cámara de grandes losas de granito y un corredor. Lo excavó Hugo Obermaier entre 1925 y 1927, quedó sumergido por el embalse de Valdecañas en 1963 y su reaparición en las sequías de 2019 y 2022 le dio fama internacional. En 2022 fue declarado Bien de Interés Cultural, con la categoría de Zona Arqueológica, por el Real Decreto 371/2022. Según los autores, es razonable suponer que monumentos como este y poblados como Valdecañas formaron parte de un mismo paisaje, con los vivos en las terrazas cultivables y los muertos en grandes tumbas colectivas que marcaban el territorio. Pero la relación concreta entre ambos es una de las preguntas abiertas: los dólmenes se construyeron y se reutilizaron durante siglos. La reconstrucción sigue la descripción del BOE: cámara de unos 5 m de diámetro formada por 12 o 13 losas, corredor de casi 10 m por 1,5 m, triple línea de ortostatos alrededor de la cámara, un menhir decorado de unos 2 m a la entrada y un túmulo de bolos de piedra (hoy desaparecido: los bolos que se ven en las fotos son restos de la excavación de Obermaier). La orientación del corredor, el tamaño del túmulo y la losa de cubierta son hipótesis. El corte del túmulo es solo un recurso para ver el interior.',
    facil: 'Cerca del río hay una tumba grande de piedra. Se llama dolmen. Tiene un pasillo y una sala redonda. Allí enterraban a muchas personas. Encima tenía un montón de tierra y piedras.',
  },
];

VALDE.intro = {
  titulo: 'Poblado de la Isla de Valdecañas',
  subtitulo: 'Edad del Cobre · hacia el 2900 a. C. · El Gordo y Berrocalejo (Cáceres)',
  texto: 'Esta reconstrucción muestra cómo pudo ser el asentamiento campesino que se excavó en 2008 en lo alto de una pequeña meseta junto al río Tajo, hoy convertida en una isla del embalse de Valdecañas. Es una hipótesis científica: cada elemento tiene su justificación. Activa la capa de evidencia para ver qué está documentado, qué está deducido y qué es hipótesis.',
};

VALDE.glosario = [
  ['Adobe', 'Bloque de barro mezclado con paja y secado al sol.'],
  ['Almagra', 'Capa de arcilla rica en óxido de hierro que da a la cerámica un color rojo intenso.'],
  ['Bastión', 'Torre o saliente de una muralla. Propio de algunos poblados fortificados del Calcolítico del sur; aquí no hay.'],
  ['Calcolítico', 'Edad del Cobre: periodo de la Prehistoria entre el Neolítico y la Edad del Bronce, en la Península aproximadamente entre el 3200 y el 2200 a. C.'],
  ['Campo de hoyos', 'Yacimiento formado por muchos hoyos excavados en el suelo (silos, basureros, fondos de cabaña), sin murallas.'],
  ['Campaniforme', 'Cerámica decorada con forma de campana invertida, propia del final del Calcolítico. En Valdecañas no aparece.'],
  ['Castro', 'Poblado fortificado en un alto, típico de la Edad del Hierro (por ejemplo, los castros vettones). Es mucho posterior a Valdecañas.'],
  ['Crisol', 'Recipiente de barro resistente al fuego donde se funde el metal. En Valdecañas no hay.'],
  ['Dolmen', 'Tumba colectiva hecha con grandes losas de piedra.'],
  ['Escoria', 'Resto que queda al fundir mineral para obtener metal. En Valdecañas no hay.'],
  ['Estratigrafía', 'Estudio de las capas de tierra para saber en qué orden se formaron.'],
  ['Fondo de cabaña', 'Parte de una vivienda excavada en el suelo que se conserva cuando las paredes han desaparecido.'],
  ['Foso', 'Zanja que rodea un poblado para defenderlo o delimitarlo. La zanja de Valdecañas no es un foso.'],
  ['Gabro', 'Roca muy dura y oscura con la que se hacían hachas pulimentadas.'],
  ['Lámina', 'Lasca larga y estrecha de sílex con filos cortantes.'],
  ['Manteado', 'Capa de barro con que se cubre un entramado de ramas para hacer una pared.'],
  ['Metalurgia', 'Técnicas para obtener y trabajar los metales.'],
  ['Molino de mano', 'Piedra plana sobre la que se muele el grano frotándolo con otra piedra (moleta).'],
  ['Muralla', 'Muro de defensa que rodea un poblado. Valdecañas no tenía.'],
  ['Núcleo', 'Bloque de sílex del que se van sacando lascas y láminas.'],
  ['Oppidum', 'Gran poblado fortificado de la Edad del Hierro final, con funciones de centro de un territorio.'],
  ['Pesa de telar', 'Pieza de barro o piedra que se cuelga de los hilos de un telar vertical para tensarlos.'],
  ['Piedras hincadas', 'Campo de piedras clavadas en el suelo delante de una muralla para frenar a los atacantes. Típico de castros de la Edad del Hierro.'],
  ['Silo', 'Hoyo excavado en el suelo para guardar el grano.'],
  ['Sílex', 'Piedra muy dura que, al golpearla, se rompe en lascas con filos muy cortantes.'],
  ['Tapial', 'Muro de tierra apisonada dentro de un encofrado de tablas. No se ha documentado en Valdecañas.'],
];

VALDE.niveles = {
  1: { nombre: 'Documentado', desc: 'Hallado en la excavación de Valdecañas.' },
  2: { nombre: 'Deducido', desc: 'Completado con otros yacimientos de la misma época y región.' },
  3: { nombre: 'Hipótesis', desc: 'Propuesta razonada sin pruebas directas.' },
};
