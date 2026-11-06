// Textos de los puntos de interés, en tres niveles (básico, ampliación y lectura fácil), y glosario.
// Fuente principal: [Inf.] informe de la excavación de 2012 aportado por J. R. Marcos.
// Nivel: 1 documentado, 2 deducido, 3 hipótesis.
// vista: [x, y, altura, tx, ty, taltura] de la cámara y su objetivo (plano, m). marcador: [x, y, altura].
// momento: momento de la historia que se muestra al abrir la ficha. corte: abre o cierra el corte del túmulo.
window.MOINA = window.MOINA || {};
(function (V) {
  const E = (s, t) => { const p = V.desdeEje(s, t); return [p.x, p.y]; };
  const vista = (cs, ct, ch, os, ot, oh) => [...E(cs, ct), ch, ...E(os, ot), oh];

  V.intro = {
    titulo: 'Dolmen de La Moína II',
    subtitulo: 'Jaraíz de la Vera (Cáceres) · hacia el 3500-2700 a. C.',
    texto: 'Reconstrucción de un sepulcro megalítico de La Vera a partir de su excavación arqueológica. Elige un momento de su historia (construcción, uso, clausura u hoy), pulsa los números para leer las fichas, mira «por dentro» con el corte del túmulo o entra paseando por el corredor hasta la cámara.',
  };

  V.momentos = [
    { id: 'construccion', nombre: 'Construcción', fecha: 'segunda mitad del IV milenio a. C.', texto: 'Se clavan las losas en zanjas abiertas en la roca y el túmulo crece por anillos de piedra.' },
    { id: 'uso', nombre: 'En uso', fecha: 'durante generaciones', texto: 'El túmulo cubre la cámara y el corredor. Se entra agachado desde el vestíbulo, que queda abierto.' },
    { id: 'sellado-fuego', nombre: 'Clausura', fecha: 'inicios del III milenio a. C.', texto: 'Se sella la cámara con una losa, se enciende una gran hoguera en el corredor y, después, se rellena el vestíbulo.' },
    { id: 'hoy', nombre: 'Hoy', fecha: 'tras la excavación de 2012', texto: 'La cubierta de la cámara está derrumbada y retirada. El corredor conserva sus losas.' },
  ];

  V.fichas = [
    {
      n: 1, titulo: 'Un dolmen: una tumba de piedra', nivel: [1, 2], nivelTexto: 'Estructura documentada · fecha deducida de los hallazgos',
      fuente: '[Inf.] estructura, cerámica e industria lítica',
      momento: 'uso', corte: false,
      vista: vista(27, -13, 14, -3, 0, 1.5), marcador: [...E(-3, 0), 6],
      basico: 'Un dolmen es una tumba construida con grandes piedras. Por eso se llama megalito, que significa «piedra grande». Lo levantaron las comunidades de campesinos y pastores que vivían en La Vera hace más de 5.000 años. Tiene una cámara redonda para los muertos, un corredor para entrar y un vestíbulo abierto delante. Todo quedaba escondido bajo un gran montón de piedras y tierra: el túmulo. Desde fuera solo se veía una colina artificial.',
      ampliacion: 'La Moína II es un sepulcro de corredor: una cámara poligonal de 13 ortostatos, un corredor corto y cubierto orientado al sureste y un vestíbulo abocinado, todo ello dentro de un túmulo de unos 24 × 32 m. A falta de una datación absoluta (por radiocarbono), el equipo de excavación sitúa sus cerámicas y su industria lítica en la transición del Neolítico al Calcolítico, entre la segunda mitad del IV milenio y los primeros siglos del III milenio a. C. Es la época en que se construyen muchos dolmenes en Extremadura, como el de Guadalperal en el embalse de Valdecañas. Eran tumbas colectivas, usadas durante generaciones, y también monumentos que marcaban el territorio de una comunidad.',
      facil: 'Un dolmen es una tumba. Está hecho con piedras muy grandes. Tiene más de 5.000 años. Dentro hay una sala redonda para los muertos. Por encima tiene una montaña de piedras y tierra.',
    },
    {
      n: 2, titulo: 'El túmulo', nivel: [1, 3], nivelTexto: 'Medidas y materiales documentados · anillos colocados como hipótesis',
      fuente: '[Inf.] Túmulo',
      momento: 'uso', corte: false,
      vista: vista(-2, 22, 7, -3, 4, 1.5), marcador: [...E(-4, 9), 3.6],
      basico: 'El túmulo es la montaña artificial que cubre el dolmen. Mide unos 32 metros de largo, 24 de ancho y entre 3 y 4 metros de alto. Está hecho con capas de piedras y tierra, sujetas por anillos de piedra para que no se desmoronen. Casi todas las piedras son de granito; también hay cuarcita rojiza y cuarzo blanco. Entre ellas aparecieron molinos de mano rotos: los aprovecharon como piedras de construcción.',
      ampliacion: 'El túmulo tiene forma de tendencia circular (24 m de noroeste a sureste y 31,98 m de noreste a suroeste) y un alzado de 3 a 4 m. Se apoya directamente sobre un batolito granítico, del que probablemente salió casi toda la piedra. Está formado por varias unidades constructivas superpuestas, con refuerzos y anillos de piedra que contenían las piedras sueltas, y depósitos de tierra que las apelmazaban. La capa superficial, que cubría y protegía todo el conjunto, mezcla fragmentos de granito (el 90 %), cuarcita rojiza y cuarzo blanco con tierra gris y anaranjada. Entre esas piedras se documentaron varios molinos barquiformes, casi todos rotos, reutilizados como material de construcción. En la reconstrucción, la cámara queda desplazada hacia el sureste del centro del túmulo, como sugiere el croquis del informe; la posición exacta de los anillos es una hipótesis.',
      facil: 'El túmulo es una montaña hecha por personas. Cubre el dolmen. Tiene piedras y tierra. Unos anillos de piedra lo sujetan. Usaron también molinos viejos y rotos.',
    },
    {
      n: 3, titulo: 'La cámara funeraria', nivel: [1], nivelTexto: 'Documentado',
      fuente: '[Inf.] Cámara funeraria',
      momento: 'uso', corte: true,
      vista: vista(0.5, 9, 4, 0, 0, 1.0), marcador: [...E(0, 0), 5.2],
      basico: 'Esta es la sala de los muertos. Es casi redonda y mide 3,90 metros de lado a lado. Sus paredes son 13 grandes losas de granito clavadas de pie, que se llaman ortostatos. Miden de media 1,68 metros de alto, como una persona alta. Las losas se apoyan unas en otras y están metidas en una zanja excavada en la roca. Para que no se movieran, las calzaron con piedras más pequeñas y cuñas.',
      ampliacion: 'La cámara es poligonal de tendencia circular, de 3,90 m de diámetro, formada por 13 ortostatos de granito con un alzado medio de 1,68 m; algunos superan 1,80 m. Todo el conjunto se encaja en sí mismo: los ortostatos se adosan y apoyan unos en otros y se hincan en una fosa perimetral excavada en la roca. Parece que se hincaron desde el exterior, de modo que la zanja quedó sellada por las propias losas. Después se niveló el interior con un depósito blanquecino, que sirvió también para calzar algunos ortostatos con granitos medianos y pequeños y cuñas en los huecos. Encima se extendió la superficie de uso, de tono anaranjado, que ocupa toda la cámara. Al empezar la excavación, la cámara estaba sellada por el derrumbe de su cubierta, salvo la zona excavada en una intervención anterior, en 2010.',
      facil: 'Esta es la sala de los muertos. Es redonda. Sus paredes son 13 piedras muy grandes. Están de pie. Miden casi como una persona alta. Unas piedras pequeñas las sujetan.',
    },
    {
      n: 4, titulo: 'Un techo de lajas', nivel: [1, 3], nivelTexto: 'Lajas del derrumbe documentadas · forma de la cubierta: hipótesis del equipo de excavación',
      fuente: '[Inf.] Cámara funeraria (cubierta)',
      momento: 'uso', corte: true,
      vista: vista(1.5, 6.5, 4.6, 0, 0, 2.0), marcador: [...E(-1.3, 1.5), 5.6],
      basico: 'La cámara tenía techo, pero se cayó hace mucho tiempo. Los arqueólogos encontraron dentro muchas lajas planas, más pequeñas que las paredes. Piensan que el techo era una falsa cúpula: cada fila de lajas sobresalía un poco más hacia el centro que la de abajo, hasta cerrarse arriba. El peso del túmulo, por fuera, las mantenía en su sitio. En el momento «Hoy» verás la cámara sin techo.',
      ampliacion: 'La cámara apareció cubierta por tierra y por un buen número de lajas procedentes del derrumbe de la cubierta: aplanadas, de formas variadas y nunca mayores que los ortostatos (las más grandes alcanzan la mitad de su tamaño). Con esa tipología, y con la forma de los ortostatos, cuya disposición parece funcional, el equipo de excavación propone una cubierta construida por aproximación de lajas: hiladas que avanzan hacia el centro, contrapesadas hacia el exterior por la estructura tumular y apoyadas en los desniveles entre las cabezas de los ortostatos. Después, todo quedaba protegido por la capa superficial del túmulo. Es una hipótesis razonada: el número de hiladas, su altura y la gran losa de cierre del centro son propuestas de esta reconstrucción.',
      facil: 'La sala tenía techo de piedras planas. Se cayó. Cada fila de piedras salía un poco más hacia el centro. Así se cerraba el techo. Hoy la sala no tiene techo.',
    },
    {
      n: 5, titulo: 'El corredor: entrar agachado', nivel: [1, 2], nivelTexto: 'Documentado · longitud y anchura medidas en el croquis',
      fuente: '[Inf.] Corredor y vestíbulo',
      momento: 'uso', corte: true,
      vista: vista(3.8, 6, 3, 3.8, 0, 0.6), marcador: [...E(3.8, 0), 3.8],
      basico: 'Para llegar a la cámara había que pasar por un corredor corto y bajo, orientado hacia el sureste. Sus paredes son 9 losas más pequeñas que las de la cámara, colocadas tumbadas: son más largas que altas. El corredor es cada vez más bajo hacia fuera, siguiendo la forma del túmulo. Por arriba lo cubren losas planas de granito. Había que entrar agachado. Prueba a hacerlo con el botón «Pasear».',
      ampliacion: 'El acceso es un corredor corto y cubierto orientado al sureste, precedido de un espacio abierto. Lo forman 9 ortostatos de menor tamaño que los de la cámara, hincados sobre una de sus caras menores, de modo que predomina la longitud sobre la altura. Así se forma un pasillo bajo cuya altura disminuye a medida que se aleja de la cámara, ajustándose al perfil del túmulo. Como en la cámara, los ortostatos rellenan una zanja de cimentación excavada en la roca y, en este caso, todos están trabados con calzos. El corredor apareció en buena parte cubierto por losas planas de granito apoyadas directamente sobre los ortostatos. La orientación al sureste, hacia la salida del sol en invierno, es muy frecuente en los dolmenes de la península ibérica.',
      facil: 'El corredor es el pasillo para entrar. Es corto y bajo. Hay que agacharse. Mira hacia donde sale el sol. Su techo son piedras planas.',
    },
    {
      n: 6, titulo: 'El vestíbulo', nivel: [1, 2], nivelTexto: 'Documentado · longitud y abertura medidas en el croquis',
      fuente: '[Inf.] Corredor y vestíbulo; depósito U.E. 61',
      momento: 'uso', corte: false,
      vista: vista(13, 2.5, 3.2, 6.8, 0, 0.4), marcador: [...E(7.4, 0), 1.9],
      basico: 'Delante del corredor había un espacio al aire libre, el vestíbulo. Tiene forma de embudo: es estrecho junto a la entrada y se abre hacia fuera. Sus lados son 11 losas de granito, cada vez más bajas. Junto a la entrada, los arqueólogos hallaron trozos de al menos cuatro cuencos pequeños pintados de negro, puntas de flecha y cuentas de collar.',
      ampliacion: 'Al este del dintel, fuera del corredor, se documentó un espacio abierto que formaba parte de la estructura: un vestíbulo de forma abocinada con sus laterales formados por 11 ortostatos de granito, cuya altura decrece suavemente hacia las zonas bajas del túmulo. Junto a la cara este del dintel apareció un depósito cerámico (U.E. 61) con fragmentos de al menos 4 pequeños cuencos decorados con motivos pintados en negro, y un número importante de piezas líticas: puntas talladas y cuentas de collar. Pertenece a los niveles de clausura del monumento. Es probable que el vestíbulo fuera el lugar de las ceremonias de la comunidad ante la tumba, pero eso es una deducción a partir de otros dolmenes.',
      facil: 'El vestíbulo está delante de la entrada. Es como un embudo. Tiene 11 piedras a los lados. Allí dejaron cuatro cuencos pintados de negro. También dejaron puntas de flecha y cuentas de collar.',
    },
    {
      n: 7, titulo: 'Los grabados de las losas', nivel: [1, 3], nivelTexto: 'Motivos documentados · su posición exacta en cada piedra es aproximada · su significado, desconocido',
      fuente: '[Inf.] Fichas de catalogación de arte rupestre (U.E. 6, 8, 9, 10, 11, 12, 13, 19, 21 y ortostato del acceso)',
      momento: 'hoy', corte: false, extra: 'grabados',
      vista: vista(1.2, 0.3, 1.35, -2, 0.2, 1.0), marcador: [...E(-1.6, -1.2), 4.4],
      basico: 'Nueve losas de la cámara y una del acceso tienen dibujos grabados en la piedra. Hay pequeños agujeros redondos (cazoletas), puntos, círculos, figuras que parecen personas, figuras con forma de rama (ramiformes), rectángulos y líneas onduladas como serpientes. Los hicieron golpeando la piedra con otra piedra (piqueteado) o frotándola (abrasión). No sabemos qué significan. Hoy se ven muy mal: pulsa «Resaltar grabados» para verlos mejor.',
      ampliacion: 'El arte megalítico de La Moína II está catalogado en diez ortostatos. Predominan las cazoletas (en las U.E. 8, 9, 13, 19 y en el ortostato del acceso), los motivos circulares rellenos o abiertos (U.E. 6, 11 y 13), los antropomorfos esquemáticos (U.E. 6, con brazos en cruz o curvos y piernas en ángulo), los ramiformes (U.E. 9, 12 y 19: un eje con trazos transversales en diagonal; en la U.E. 9 los trazos inferiores se curvan y sugieren una figura humana), los rectángulos verticales, a veces compartimentados (U.E. 9, 12 y 13), y los ondulados verticales o serpentiformes (U.E. 10, de 1,12 m de alto, y U.E. 21). Las técnicas son el piqueteado, la abrasión, el raspado y la incisión, con surcos en U y en V. Casi todos tienen mala visibilidad: el granito de grano grueso y la meteorización los han borrado en parte. Se interpretan como símbolos ligados a las creencias sobre la muerte, pero su significado concreto no se conoce. En esta reconstrucción se han dibujado a partir de las descripciones y medidas de las fichas; su forma y posición exactas en cada piedra son aproximadas. Es posible que algunos estuvieran pintados: no hay pruebas en este dolmen.',
      facil: 'Algunas piedras tienen dibujos grabados. Hay agujeros pequeños, círculos y líneas. Hay figuras como personas. Hay líneas como serpientes. Los hicieron golpeando o frotando la piedra. No sabemos qué significan.',
    },
    {
      n: 8, titulo: 'El ajuar: lo que acompañaba a los muertos', nivel: [1], nivelTexto: 'Documentado (la colocación de cada pieza es aproximada)',
      fuente: '[Inf.] El ajuar: material lítico, materias primas y material cerámico',
      momento: 'uso', corte: true,
      vista: vista(0.4, 3.6, 2.0, 0.2, -0.3, 0.1), marcador: [...E(0.8, -1.6), 4.0],
      basico: 'Junto a los muertos dejaban objetos: es el ajuar. En este dolmen hay puntas de flecha de muchas formas, cuchillos de piedra, hachas pulidas, collares y vasijas de barro. Muchas cuentas de collar son de una piedra verde, la variscita, que llegó desde Zamora. Eso demuestra que había intercambios con lugares muy lejanos.',
      ampliacion: 'La industria lítica tallada incluye láminas, laminitas, microlitos geométricos y puntas de flecha de talla bifacial de muy diversa tipología (de base plana, cóncava, convexa o apuntada, romboidales, con pedúnculo y foliáceas), propias de los horizontes del Calcolítico inicial. La industria pulimentada reúne hachas (las únicas piezas con huellas claras de uso, quizá en la propia construcción del túmulo), hachas tipo cincel y tipo azada, azuelas (una de ellas, de sillimanita, con función votiva) y mazos. Los adornos son muy variados: la mayoría, de minerales verdes, entre ellos la variscita, procedente casi con seguridad de los afloramientos de Palazuelo de las Cuevas (Zamora), a casi 200 km; también hay calizas, pizarras, jade y turmalina chorlo. La materia prima más representada es la calcedonia, junto al sílex. La cerámica es casi toda lisa (escudillas, cuencos, ollas, vasos, tinajas y las nuevas fuentes y cazuelas), a veces cubierta de almagra; hay tres fragmentos con decoración incisa en zigzag y punteados, y cuencos pintados en negro, típicos del Calcolítico inicial del suroeste.',
      facil: 'El ajuar son los objetos de los muertos. Hay puntas de flecha. Hay cuchillos y hachas de piedra. Hay collares de piedra verde. Esa piedra vino de muy lejos.',
    },
    {
      n: 9, titulo: '¿Dónde están los huesos?', nivel: [1, 2], nivelTexto: 'Documentado · uso colectivo deducido de otros dolmenes',
      fuente: '[Inf.] Cámara funeraria (U.E. 80, 82, 83, 84 y 124)',
      momento: 'uso', corte: true,
      vista: vista(-1.2, 4.2, 2.4, -0.7, -0.3, 0.1), marcador: [...E(-2.4, 2.2), 4.6],
      basico: 'En la cámara no apareció ni un solo hueso. No es que no enterraran a nadie: la tierra de granito es muy ácida y deshace los huesos con el paso de miles de años. Lo que sí apareció son varios montoncitos de piedras sobre el suelo, con puntas de flecha, cuchillos y hachas encima. Los arqueólogos creen que formaban parte de los ritos de los entierros.',
      ampliacion: 'Sobre la superficie de uso de la cámara se documentaron varias agrupaciones de piedras (U.E. 80, 82, 83, 84 y 124) con un alto porcentaje de material lítico tallado y pulimentado colocado «in situ», que el equipo de excavación relaciona con rituales funerarios. No se han conservado restos óseos, algo esperable en un terreno de acidez muy elevada como el granítico, que destruye la materia orgánica. Por comparación con dolmenes de suelos más favorables, sabemos que estas cámaras recibían a muchas personas a lo largo del tiempo: eran tumbas colectivas, quizá de un linaje o de toda una comunidad.',
      facil: 'No hay huesos en la sala. La tierra es ácida. Los huesos se deshicieron. Sí hay montones de piedras con objetos encima. Eran parte de un ritual.',
    },
    {
      n: 10, titulo: 'El cierre del dolmen', nivel: [1, 3], nivelTexto: 'Losa, hoguera y relleno documentados · el aspecto del fuego y el cierre de madera son hipótesis',
      fuente: '[Inf.] Corredor y vestíbulo (U.E. 77 y depósitos de amortización)',
      momento: 'sellado-fuego', corte: true, extra: 'clausura',
      vista: vista(3.2, 6.5, 4.4, 3.0, 0, 0.3), marcador: [...E(5.6, 0.9), 2.6],
      basico: 'Un día decidieron dejar de usar el dolmen y lo cerraron con una ceremonia. Primero taparon la entrada de la cámara con una losa ovalada que encaja justo en el hueco. Después encendieron una gran hoguera en el corredor y echaron al fuego cuchillos, hachas, puntas de flecha y cuentas de collar. Por último, cerraron el corredor y llenaron el vestíbulo de piedras y tierra. El dolmen quedó enterrado del todo.',
      ampliacion: 'En el corredor, frente al umbral, apareció un ortostato de monzogranito labrado, de forma ovalada, que encaja perfectamente en el hueco de entrada a la cámara (U.E. 77): es la losa de cierre que se colocó cuando se decidió abandonar el monumento. Bajo ella, sobre el suelo del corredor, había un depósito totalmente quemado, con cenizas y carbones de una gran combustión, junto a cuchillos laminares, útiles pulimentados, puntas de flecha y cuentas de collar. El foco de la hoguera estaba en el extremo oeste del corredor, frente a la losa de cierre. Después se rellenó el vestíbulo, completando la ladera sureste del túmulo y sellando toda la estructura. Como el corredor apareció aislado y vacío, el equipo deduce que su boca se cerró antes con algún material perecedero, como madera. Las razones del cierre (¿el fin de un linaje?, ¿un cambio de creencias?) no se conocen. Usa los botones de abajo para ver la hoguera o el relleno.',
      facil: 'Al final cerraron el dolmen. Taparon la sala con una piedra redonda. Hicieron un gran fuego en el pasillo. Echaron objetos al fuego. Después lo taparon todo con piedras y tierra.',
    },
    {
      n: 11, titulo: '¿Cómo se construyó?', nivel: [1, 3], nivelTexto: 'Zanjas, calzos y anillos documentados · herramientas y transporte: hipótesis',
      fuente: '[Inf.] Túmulo, cámara y corredor; técnicas de transporte deducidas de la arqueología experimental',
      momento: 'construccion', corte: false,
      vista: vista(15, 9, 7, 0, 0, 0.8), marcador: [...E(12.8, 2.6), 2.4],
      basico: 'La piedra estaba a mano: el dolmen se levanta sobre una gran masa de granito. Primero excavaron zanjas en la roca y clavaron en ellas las grandes losas, desde fuera. Las sujetaron con piedras pequeñas y nivelaron el suelo. Luego pusieron el techo y fueron levantando el túmulo por capas, con anillos de piedra. Para mover losas de más de una tonelada hacían falta muchas personas, trineos de madera, rodillos, palancas y cuerdas.',
      ampliacion: 'La secuencia constructiva se deduce de la excavación: apertura de una fosa perimetral en el firme granítico, hincado de los ortostatos desde el exterior (la zanja quedó sellada por las propias losas), calzado con granitos y cuñas, nivelación del interior con un depósito blanquecino y, por último, la superficie de uso. El túmulo se levantó por unidades constructivas superpuestas, con refuerzos y anillos de piedra, y una capa superficial que lo cubría todo; entre sus piedras se reutilizaron molinos rotos. Las hachas pulimentadas son las únicas piezas con huellas de uso, y el informe plantea que pudieran emplearse en la construcción. Cómo se movieron y levantaron las losas no está documentado aquí: los trineos, rodillos, palancas y rampas que ves son una hipótesis basada en la arqueología experimental. Una losa de 1,7 × 1 × 0,3 m de granito pesa más de una tonelada.',
      facil: 'La piedra estaba muy cerca. Hicieron zanjas en la roca. Clavaron las piedras grandes. Las sujetaron con piedras pequeñas. Movieron las piedras entre muchas personas. Usaron troncos y cuerdas.',
    },
    {
      n: 12, titulo: 'Cómo lo sabemos: la excavación', nivel: [1, 2], nivelTexto: 'Documentado',
      fuente: '[Inf.] Excavaciones de 2010 y 2012',
      momento: 'hoy', corte: false,
      vista: vista(20, -14, 9, 0, 0, 0.5), marcador: [...E(14, -6), 2.4],
      basico: 'Todo lo que ves sale de una excavación arqueológica. Los arqueólogos quitaron la tierra capa a capa y dibujaron y fotografiaron cada piedra. Así supieron cómo se construyó, cómo se usó y cómo se cerró el dolmen. Lo que no se ha conservado lo hemos imaginado con cuidado. Pulsa «Evidencia» para ver qué está comprobado (azul), qué se deduce (naranja) y qué es una hipótesis (rosa).',
      ampliacion: 'El dolmen se excavó en 2012, tras una intervención anterior en 2010 que había abierto parte de la cámara. Cada capa y cada estructura se registró como una unidad estratigráfica (U.E.), con su número, su dibujo y sus materiales: así se reconstruye el orden de los acontecimientos, desde la construcción hasta la clausura. Aún falta una datación absoluta por radiocarbono, por lo que las fechas se basan en la comparación de la cerámica y de las puntas de flecha con otros yacimientos. En esta reconstrucción, los datos del informe se combinan con deducciones a partir de otros dolmenes y con hipótesis propias, y la capa de evidencia permite distinguirlos. El momento «Hoy» muestra el dolmen tal como quedó tras la excavación de 2012; su estado actual puede ser distinto.',
      facil: 'Los arqueólogos excavaron el dolmen. Quitaron la tierra poco a poco. Dibujaron cada piedra. Así sabemos cómo era. Lo que falta lo imaginamos. El botón «Evidencia» te enseña qué es seguro.',
    },
  ];

  V.glosario = [
    ['Megalito', 'Monumento hecho con piedras muy grandes.'],
    ['Dolmen', 'Tumba megalítica con una cámara de losas, a menudo con corredor y cubierta por un túmulo.'],
    ['Ortostato', 'Losa grande clavada de pie que forma las paredes de la cámara, del corredor o del vestíbulo.'],
    ['Túmulo', 'Montaña artificial de piedras y tierra que cubre el dolmen.'],
    ['Cámara', 'Sala del dolmen donde se depositaban los muertos.'],
    ['Corredor', 'Pasillo de entrada a la cámara.'],
    ['Vestíbulo', 'Espacio abierto delante del corredor.'],
    ['Dintel', 'Losa horizontal que cubre una entrada.'],
    ['Calzo', 'Piedra pequeña que sujeta la base de una losa para que no se mueva.'],
    ['Falsa cúpula', 'Techo de lajas en el que cada hilada sobresale un poco más hacia el centro hasta cerrarse.'],
    ['Ajuar', 'Objetos que acompañan a un difunto en su tumba.'],
    ['Cazoleta', 'Pequeña cavidad redonda grabada en la roca.'],
    ['Antropomorfo', 'Figura con forma humana.'],
    ['Ramiforme', 'Figura con forma de rama: un eje con trazos a los lados. A veces representa a una persona de forma muy esquemática.'],
    ['Piqueteado', 'Técnica de grabado que consiste en golpear la piedra con otra piedra más dura.'],
    ['Abrasión', 'Técnica de grabado que consiste en frotar la piedra hasta abrir un surco.'],
    ['Variscita', 'Mineral verde muy apreciado para hacer cuentas de collar.'],
    ['Almagra', 'Pigmento rojo de óxido de hierro con el que se cubrían algunas vasijas.'],
    ['Molino barquiforme', 'Piedra de moler alargada, con forma de barca, para hacer harina.'],
    ['Unidad estratigráfica (U.E.)', 'Cada capa, estructura o depósito que el arqueólogo distingue y numera al excavar.'],
    ['Neolítico', 'Periodo de la Prehistoria en que aparecen la agricultura y la ganadería.'],
    ['Calcolítico', 'Edad del Cobre: periodo en que se empieza a trabajar el cobre, desde hacia el 3200 a. C. en la península ibérica.'],
  ];
})(window.MOINA);
