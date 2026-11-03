/*
  CONTENIDOS DE LA WEB DE PROFE JUANRA
  ====================================
  Este es el único archivo que hay que tocar para añadir materiales.

  Cada unidad tiene una lista «materiales». Para añadir uno, copia esta línea
  dentro de los corchetes [ ] de la unidad y cambia el texto:

      { tipo: "pdf", titulo: "Apuntes de la unidad", enlace: "materiales/1eso/u1-apuntes.pdf" },

  · tipo: "pdf", "presentacion", "video", "actividad" o "enlace"
  · titulo: lo que verán tus alumnos
  · enlace: o un archivo subido a la carpeta «materiales»
            o una dirección de internet (YouTube, Drive, Genially…) que empiece por https://
            Si es un enlace de Google Classroom o de Drive, la web lo marca
            «Solo alumnos»: solo lo abren tus alumnos con su cuenta de Educarex.
  · vista (opcional): imagen de vista previa, por ejemplo "img/materiales/u1-apuntes.jpg"
  · descripcion (opcional): una frase que explica el material

  Ejemplo de material de Classroom con vista previa:

      { tipo: "pdf", titulo: "Apuntes: el relieve", descripcion: "Resumen con mapas.",
        vista: "img/materiales/u2-apuntes.jpg", enlace: "https://classroom.google.com/..." },

  No borres las comas ni las comillas. Si algo falla, pídeselo a Claude.
*/

const WEB = {
  // Enlace del paseo 3D por Navalmoral en 1850 (se abre en pestaña nueva)
  paseoNavalmoral: "https://claude.ai/artifact/RowaKbFG2UcMV4SZ12xB2S",
  // Tu canal de YouTube
  youtube: "https://www.youtube.com/@juanramonmarcosbarbado",
  instagram: "https://www.instagram.com/juan_barbado/",
};

// Apartado «Materiales» de cada asignatura (materiales generales, no de una unidad)
const MATERIALES = {

  "historia-espana": [
  ],

  "1eso": [
  ],

};

// Presentaciones de Canva que se ven DENTRO de la web (sin botón de descarga).
// canva: el enlace de «Insertar» de Canva (termina en /view?embed). Nunca el de edición.
const PRESENTACIONES = {

  "historia-espana": [
    { titulo: "Paso a paso para comentar fuentes históricas",
      descripcion: "Textos, imágenes, fotografías, gráficas y viñetas.",
      vista: "img/materiales/canva-paso-a-paso.jpg",
      canva: "https://www.canva.com/design/DAHWgBHCTUE/J7J_lf2FREfFNLQbRrUung/view?embed" },
    { titulo: "Esquema para comentar textos y mapas históricos",
      descripcion: "Clasificación, análisis, contextualización y valoración crítica.",
      vista: "img/materiales/canva-esquema.jpg",
      canva: "https://www.canva.com/design/DAG0oHo60Gk/oaKnXLwIdpSaQRMDGtkKLg/view?embed" },
  ],

  // Apartado «Bloques temáticos para la PAU»
  "historia-espana-pau": [
    { titulo: "Esquema-resumen del curso",
      descripcion: "Siglos XIX y XX: los momentos clave que entran en la PAU.",
      vista: "img/materiales/canva-bloques-pau.jpg",
      canva: "https://www.canva.com/design/DAGlcoBpmLE/1PE6wkujJ09IKfFZCKQNRA/view?embed" },
  ],

};

// Galería «Imágenes de la historia»: fotos de hemeroteca e investigación.
// Para añadir una foto: súbela a img/galeria (versión grande y «-mini») y copia un bloque.
// ancho y alto: medidas de la foto (sirven para que todas queden a la misma altura).
const GALERIA = {

  "historia-espana": [
    {"imagen": "img/galeria/1794-mapa.jpg", "mini": "img/galeria/1794-mapa-mini.jpg", "ancho": 1743, "alto": 1800, "fecha": "1794", "titulo": "Plano manuscrito de 1794", "bloque": "Crisis del Antiguo Régimen"},
    {"imagen": "img/galeria/1813-cortes-inquisicion.jpg", "mini": "img/galeria/1813-cortes-inquisicion-mini.jpg", "ancho": 638, "alto": 340, "fecha": "23 de junio de 1813", "titulo": "Navalmoral felicita a las Cortes por abolir la Inquisición", "texto": "El ayuntamiento constitucional, el clero y el pueblo de Navalmoral de la Mata felicitan al Congreso.", "bloque": "Crisis del Antiguo Régimen"},
    {"imagen": "img/galeria/1918-homenaje-rosado.jpg", "mini": "img/galeria/1918-homenaje-rosado-mini.jpg", "ancho": 1738, "alto": 1386, "fecha": "1918", "titulo": "Los moralos homenajean a Rosado", "bloque": "La Restauración"},
    {"imagen": "img/navalmoral/calle-antonio-concha.jpg", "mini": "img/navalmoral/calle-antonio-concha-mini.jpg", "ancho": 1600, "alto": 1275, "fecha": "1920", "titulo": "Calle Antonio Concha", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/galeria/1928-mesa-petitoria.jpg", "mini": "img/galeria/1928-mesa-petitoria-mini.jpg", "ancho": 1018, "alto": 818, "fecha": "1928", "titulo": "Mesa petitoria", "bloque": "La Restauración"},
    {"imagen": "img/navalmoral/avenida-de-las-angustias.jpg", "mini": "img/navalmoral/avenida-de-las-angustias-mini.jpg", "ancho": 1600, "alto": 1178, "fecha": "1928", "titulo": "Avenida de las Angustias", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/galeria/1931-hospital-antipaludico.jpg", "mini": "img/galeria/1931-hospital-antipaludico-mini.jpg", "ancho": 1800, "alto": 1200, "fecha": "1931", "titulo": "Hospital antipalúdico", "fuente": "España Médica, 1931", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/galeria/1933-estampa-campesinos.jpg", "mini": "img/galeria/1933-estampa-campesinos-mini.jpg", "ancho": 1280, "alto": 1800, "fecha": "28 de enero de 1933", "titulo": "«Los campesinos extremeños invaden las tierras»", "texto": "Portada de la revista Estampa sobre la ocupación de fincas en Navalmoral de la Mata.", "fuente": "Estampa, nº 264 · Biblioteca Nacional de España", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/galeria/1933-estampa-invasion-tierras.jpg", "mini": "img/galeria/1933-estampa-invasion-tierras-mini.jpg", "ancho": 1291, "alto": 1800, "fecha": "1933", "titulo": "La ocupación de tierras, en Estampa", "texto": "Reportaje con fotografías de los labriegos y sus yuntas en Navalmoral.", "fuente": "Estampa · Biblioteca Nacional de España", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/galeria/1933-detenciones-navalmoral.jpg", "mini": "img/galeria/1933-detenciones-navalmoral-mini.jpg", "ancho": 1678, "alto": 828, "fecha": "1933", "titulo": "Detenciones en Navalmoral", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/galeria/1933-ermita-angustias.jpg", "mini": "img/galeria/1933-ermita-angustias-mini.jpg", "ancho": 954, "alto": 1228, "fecha": "1933", "titulo": "Ermita de las Angustias", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/galeria/1933-confiscacion-armas.jpg", "mini": "img/galeria/1933-confiscacion-armas-mini.jpg", "ancho": 1030, "alto": 724, "fecha": "1933", "titulo": "Confiscación de armas", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/navalmoral/almacenes-mateos.jpg", "mini": "img/navalmoral/almacenes-mateos-mini.jpg", "ancho": 1600, "alto": 1101, "fecha": "1933", "titulo": "Almacenes Mateos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/galeria/1935-loteria.jpg", "mini": "img/galeria/1935-loteria-mini.jpg", "ancho": 1036, "alto": 1280, "fecha": "1935", "titulo": "La lotería", "bloque": "Segunda República y Guerra Civil"},
    {"imagen": "img/navalmoral/cruz-de-los-caidos.jpg", "mini": "img/navalmoral/cruz-de-los-caidos-mini.jpg", "ancho": 1600, "alto": 1055, "fecha": "Años 40", "titulo": "Cruz de los Caídos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/tabacalera.jpg", "mini": "img/navalmoral/tabacalera-mini.jpg", "ancho": 1600, "alto": 1017, "fecha": "1943", "titulo": "Tabacalera", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/vista-de-navalmoral.jpg", "mini": "img/navalmoral/vista-de-navalmoral-mini.jpg", "ancho": 1600, "alto": 961, "fecha": "1950", "titulo": "Vista de Navalmoral", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-jose-antonio-primo-de-rivera.jpg", "mini": "img/navalmoral/calle-jose-antonio-primo-de-rivera-mini.jpg", "ancho": 1600, "alto": 1088, "fecha": "1959", "titulo": "Calle José Antonio Primo de Rivera", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-joaquin-alcalde.jpg", "mini": "img/navalmoral/calle-joaquin-alcalde-mini.jpg", "ancho": 1130, "alto": 1600, "fecha": "1960", "titulo": "Calle Joaquín Alcalde", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-jovellanos.jpg", "mini": "img/navalmoral/calle-jovellanos-mini.jpg", "ancho": 1600, "alto": 1176, "fecha": "1960", "titulo": "Calle Jovellanos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/carretera-de-valdehuncar.jpg", "mini": "img/navalmoral/carretera-de-valdehuncar-mini.jpg", "ancho": 1600, "alto": 1032, "fecha": "1962", "titulo": "Carretera de Valdehúncar", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/casa-del-conejar.jpg", "mini": "img/navalmoral/casa-del-conejar-mini.jpg", "ancho": 1600, "alto": 1035, "fecha": "1962", "titulo": "Casa del Conejar", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-jose-antonio-primo-de-rivera-2.jpg", "mini": "img/navalmoral/calle-jose-antonio-primo-de-rivera-2-mini.jpg", "ancho": 1600, "alto": 1146, "fecha": "1964", "titulo": "Calle José Antonio Primo de Rivera", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/cruz-del-rollo.jpg", "mini": "img/navalmoral/cruz-del-rollo-mini.jpg", "ancho": 1600, "alto": 1070, "fecha": "1964", "titulo": "Cruz del Rollo", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-antonio-maria-concha.jpg", "mini": "img/navalmoral/calle-antonio-maria-concha-mini.jpg", "ancho": 1600, "alto": 1135, "fecha": "1967", "titulo": "Calle Antonio María Concha", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/estacion-de-auto-res.jpg", "mini": "img/navalmoral/estacion-de-auto-res-mini.jpg", "ancho": 1600, "alto": 1029, "fecha": "1967", "titulo": "Estación de Auto Res", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/nevada-en-navalmoral.jpg", "mini": "img/navalmoral/nevada-en-navalmoral-mini.jpg", "ancho": 890, "alto": 633, "fecha": "1969", "titulo": "Nevada en Navalmoral"},
    {"imagen": "img/navalmoral/instituto-augustobriga.jpg", "mini": "img/navalmoral/instituto-augustobriga-mini.jpg", "ancho": 1551, "alto": 1090, "fecha": "1973", "titulo": "Instituto Augustóbriga", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/cepansa.jpg", "mini": "img/navalmoral/cepansa-mini.jpg", "ancho": 1600, "alto": 1109, "fecha": "", "titulo": "CEPANSA", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-antonio-concha-2.jpg", "mini": "img/navalmoral/calle-antonio-concha-2-mini.jpg", "ancho": 1061, "alto": 1600, "fecha": "", "titulo": "Calle Antonio Concha", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-antonio-concha-e-iglesia-de-san-andres.jpg", "mini": "img/navalmoral/calle-antonio-concha-e-iglesia-de-san-andres-mini.jpg", "ancho": 1600, "alto": 1060, "fecha": "", "titulo": "Calle Antonio Concha e iglesia de San Andrés", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-jose-antonio-primo-de-rivera-3.jpg", "mini": "img/navalmoral/calle-jose-antonio-primo-de-rivera-3-mini.jpg", "ancho": 1600, "alto": 1067, "fecha": "", "titulo": "Calle José Antonio Primo de Rivera", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/calle-urbano-gonzalez-serrano-y-el-jardincillo.jpg", "mini": "img/navalmoral/calle-urbano-gonzalez-serrano-y-el-jardincillo-mini.jpg", "ancho": 1600, "alto": 1068, "fecha": "", "titulo": "Calle Urbano González Serrano y el Jardincillo", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/carretera-de-valdehuncar-piedra-caballera.jpg", "mini": "img/navalmoral/carretera-de-valdehuncar-piedra-caballera-mini.jpg", "ancho": 1600, "alto": 1059, "fecha": "", "titulo": "Carretera de Valdehúncar, Piedra Caballera", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/casas-baratas-en-el-barrio-de-las-minas.jpg", "mini": "img/navalmoral/casas-baratas-en-el-barrio-de-las-minas-mini.jpg", "ancho": 1600, "alto": 1130, "fecha": "", "titulo": "Casas Baratas en el barrio de Las Minas", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/casas-de-la-via-barrio-vietnam.jpg", "mini": "img/navalmoral/casas-de-la-via-barrio-vietnam-mini.jpg", "ancho": 1600, "alto": 898, "fecha": "", "titulo": "Casas de la Vía (barrio Vietnam)", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/complejo-brasilia.jpg", "mini": "img/navalmoral/complejo-brasilia-mini.jpg", "ancho": 1600, "alto": 1131, "fecha": "", "titulo": "Complejo Brasilia", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/construccion-de-la-central-nuclear-de-almaraz.jpg", "mini": "img/navalmoral/construccion-de-la-central-nuclear-de-almaraz-mini.jpg", "ancho": 1600, "alto": 1156, "fecha": "", "titulo": "Construcción de la Central Nuclear de Almaraz", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/cruz-del-rollo-2.jpg", "mini": "img/navalmoral/cruz-del-rollo-2-mini.jpg", "ancho": 1600, "alto": 1274, "fecha": "", "titulo": "Cruz del Rollo", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/ermita-de-las-angustias.jpg", "mini": "img/navalmoral/ermita-de-las-angustias-mini.jpg", "ancho": 1061, "alto": 1600, "fecha": "", "titulo": "Ermita de las Angustias", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/estacion-de-renfe.jpg", "mini": "img/navalmoral/estacion-de-renfe-mini.jpg", "ancho": 1600, "alto": 1066, "fecha": "", "titulo": "Estación de RENFE", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/estacion-de-autobuses.jpg", "mini": "img/navalmoral/estacion-de-autobuses-mini.jpg", "ancho": 1065, "alto": 1600, "fecha": "", "titulo": "Estación de autobuses", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/fuente-de-los-canos-viejos.jpg", "mini": "img/navalmoral/fuente-de-los-canos-viejos-mini.jpg", "ancho": 1600, "alto": 1134, "fecha": "", "titulo": "Fuente de los Caños Viejos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/fuente-del-parque-municipal.jpg", "mini": "img/navalmoral/fuente-del-parque-municipal-mini.jpg", "ancho": 1600, "alto": 1056, "fecha": "", "titulo": "Fuente del Parque Municipal", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/garaje-del-oeste.jpg", "mini": "img/navalmoral/garaje-del-oeste-mini.jpg", "ancho": 1600, "alto": 1147, "fecha": "", "titulo": "Garaje del Oeste", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/grupo-de-viviendas-jose-antonio-giron.jpg", "mini": "img/navalmoral/grupo-de-viviendas-jose-antonio-giron-mini.jpg", "ancho": 1600, "alto": 1071, "fecha": "", "titulo": "Grupo de viviendas José Antonio Girón", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/homenaje-a-urbano-gonzalez-serrano.jpg", "mini": "img/navalmoral/homenaje-a-urbano-gonzalez-serrano-mini.jpg", "ancho": 1600, "alto": 1035, "fecha": "", "titulo": "Homenaje a Urbano González Serrano", "fuente": "Herederos de D. Agustín Marcos Nieto, cedida por José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/hospital-moyano.jpg", "mini": "img/navalmoral/hospital-moyano-mini.jpg", "ancho": 1600, "alto": 1060, "fecha": "", "titulo": "Hospital Moyano", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/hotel-almanzor-y-cafeteria-gredos.jpg", "mini": "img/navalmoral/hotel-almanzor-y-cafeteria-gredos-mini.jpg", "ancho": 1062, "alto": 1600, "fecha": "", "titulo": "Hotel Almanzor y cafetería Gredos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/iglesia-de-san-andres-en-la-plaza-de-espana.jpg", "mini": "img/navalmoral/iglesia-de-san-andres-en-la-plaza-de-espana-mini.jpg", "ancho": 1066, "alto": 1600, "fecha": "", "titulo": "Iglesia de San Andrés en la plaza de España", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/matadero-general-barrio-de-las-minas.jpg", "mini": "img/navalmoral/matadero-general-barrio-de-las-minas-mini.jpg", "ancho": 1600, "alto": 1031, "fecha": "", "titulo": "Matadero General, barrio de Las Minas", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/mercado-central-de-abastos.jpg", "mini": "img/navalmoral/mercado-central-de-abastos-mini.jpg", "ancho": 1600, "alto": 982, "fecha": "", "titulo": "Mercado Central de Abastos", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/mercado-en-la-calle-joaquin-alcalde.jpg", "mini": "img/navalmoral/mercado-en-la-calle-joaquin-alcalde-mini.jpg", "ancho": 1600, "alto": 1227, "fecha": "", "titulo": "Mercado en la calle Joaquín Alcalde", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/paseo-de-la-estacion.jpg", "mini": "img/navalmoral/paseo-de-la-estacion-mini.jpg", "ancho": 1600, "alto": 997, "fecha": "", "titulo": "Paseo de la Estación", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/plaza-de-espana.jpg", "mini": "img/navalmoral/plaza-de-espana-mini.jpg", "ancho": 1600, "alto": 1116, "fecha": "", "titulo": "Plaza de España", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/restos-de-la-presa-del-molinillo.jpg", "mini": "img/navalmoral/restos-de-la-presa-del-molinillo-mini.jpg", "ancho": 1600, "alto": 1280, "fecha": "", "titulo": "Restos de la presa del Molinillo", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/vista-parcial-del-centro-de-navalmoral.jpg", "mini": "img/navalmoral/vista-parcial-del-centro-de-navalmoral-mini.jpg", "ancho": 1600, "alto": 1257, "fecha": "", "titulo": "Vista parcial del centro de Navalmoral", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/vistas-desde-el-canchigordo.jpg", "mini": "img/navalmoral/vistas-desde-el-canchigordo-mini.jpg", "ancho": 1600, "alto": 1284, "fecha": "", "titulo": "Vistas desde el Canchigordo", "fuente": "José Mª Guedes · revista Punto de Encuentro"},
    {"imagen": "img/navalmoral/barrio-de-las-minas.jpg", "mini": "img/navalmoral/barrio-de-las-minas-mini.jpg", "ancho": 1024, "alto": 600, "fecha": "", "titulo": "Barrio de Las Minas"},
    {"imagen": "img/navalmoral/calle-hacia-la-iglesia.jpg", "mini": "img/navalmoral/calle-hacia-la-iglesia-mini.jpg", "ancho": 801, "alto": 960, "fecha": "", "titulo": "Calle hacia la iglesia"},
    {"imagen": "img/navalmoral/calle-principal.jpg", "mini": "img/navalmoral/calle-principal-mini.jpg", "ancho": 1000, "alto": 633, "fecha": "", "titulo": "Calle principal"},
    {"imagen": "img/navalmoral/carnaval.jpg", "mini": "img/navalmoral/carnaval-mini.jpg", "ancho": 720, "alto": 504, "fecha": "", "titulo": "Carnaval"},
    {"imagen": "img/navalmoral/centro-del-tabaco.jpg", "mini": "img/navalmoral/centro-del-tabaco-mini.jpg", "ancho": 960, "alto": 627, "fecha": "", "titulo": "Centro del tabaco"},
    {"imagen": "img/navalmoral/cruz-de-los-caidos-2.jpg", "mini": "img/navalmoral/cruz-de-los-caidos-2-mini.jpg", "ancho": 996, "alto": 633, "fecha": "", "titulo": "Cruz de los Caídos"},
    {"imagen": "img/navalmoral/cruz-de-los-caidos-3.jpg", "mini": "img/navalmoral/cruz-de-los-caidos-3-mini.jpg", "ancho": 1024, "alto": 552, "fecha": "", "titulo": "Cruz de los Caídos"},
    {"imagen": "img/navalmoral/el-cerro.jpg", "mini": "img/navalmoral/el-cerro-mini.jpg", "ancho": 633, "alto": 833, "fecha": "", "titulo": "El Cerro"},
    {"imagen": "img/navalmoral/el-jardinillo.jpg", "mini": "img/navalmoral/el-jardinillo-mini.jpg", "ancho": 991, "alto": 633, "fecha": "", "titulo": "El Jardinillo"},
    {"imagen": "img/navalmoral/el-matadero.jpg", "mini": "img/navalmoral/el-matadero-mini.jpg", "ancho": 1009, "alto": 633, "fecha": "", "titulo": "El matadero"},
    {"imagen": "img/navalmoral/el-matadero-2.jpg", "mini": "img/navalmoral/el-matadero-2-mini.jpg", "ancho": 960, "alto": 680, "fecha": "", "titulo": "El matadero"},
    {"imagen": "img/navalmoral/encina-la-marquesa.jpg", "mini": "img/navalmoral/encina-la-marquesa-mini.jpg", "ancho": 931, "alto": 633, "fecha": "", "titulo": "Encina La Marquesa"},
    {"imagen": "img/navalmoral/ermita-de-san-isidro.jpg", "mini": "img/navalmoral/ermita-de-san-isidro-mini.jpg", "ancho": 1000, "alto": 633, "fecha": "", "titulo": "Ermita de San Isidro"},
    {"imagen": "img/navalmoral/ermita-de-las-angustias-2.jpg", "mini": "img/navalmoral/ermita-de-las-angustias-2-mini.jpg", "ancho": 983, "alto": 633, "fecha": "", "titulo": "Ermita de las Angustias"},
    {"imagen": "img/navalmoral/ermita-de-las-angustias-3.jpg", "mini": "img/navalmoral/ermita-de-las-angustias-3-mini.jpg", "ancho": 929, "alto": 633, "fecha": "", "titulo": "Ermita de las Angustias"},
    {"imagen": "img/navalmoral/escuela-hogar.jpg", "mini": "img/navalmoral/escuela-hogar-mini.jpg", "ancho": 602, "alto": 960, "fecha": "", "titulo": "Escuela Hogar"},
    {"imagen": "img/navalmoral/escuelas-de-la-fundacion-concha.jpg", "mini": "img/navalmoral/escuelas-de-la-fundacion-concha-mini.jpg", "ancho": 960, "alto": 600, "fecha": "", "titulo": "Escuelas de la Fundación Concha"},
    {"imagen": "img/navalmoral/estacion-de-tren.jpg", "mini": "img/navalmoral/estacion-de-tren-mini.jpg", "ancho": 1019, "alto": 633, "fecha": "", "titulo": "Estación de tren"},
    {"imagen": "img/navalmoral/fuente-de-los-canos.jpg", "mini": "img/navalmoral/fuente-de-los-canos-mini.jpg", "ancho": 720, "alto": 500, "fecha": "", "titulo": "Fuente de los Caños"},
    {"imagen": "img/navalmoral/homenaje-en-la-cruz-de-los-caidos.jpg", "mini": "img/navalmoral/homenaje-en-la-cruz-de-los-caidos-mini.jpg", "ancho": 931, "alto": 633, "fecha": "", "titulo": "Homenaje en la Cruz de los Caídos"},
    {"imagen": "img/navalmoral/homenaje-en-la-cruz-de-los-caidos-2.jpg", "mini": "img/navalmoral/homenaje-en-la-cruz-de-los-caidos-2-mini.jpg", "ancho": 1019, "alto": 633, "fecha": "", "titulo": "Homenaje en la Cruz de los Caídos"},
    {"imagen": "img/navalmoral/iglesia-de-las-angustias.jpg", "mini": "img/navalmoral/iglesia-de-las-angustias-mini.jpg", "ancho": 934, "alto": 633, "fecha": "", "titulo": "Iglesia de las Angustias"},
    {"imagen": "img/navalmoral/imagen-sin-identificar.jpg", "mini": "img/navalmoral/imagen-sin-identificar-mini.jpg", "ancho": 864, "alto": 633, "fecha": "", "titulo": "Imagen sin identificar"},
    {"imagen": "img/navalmoral/instituto-augustobriga-2.jpg", "mini": "img/navalmoral/instituto-augustobriga-2-mini.jpg", "ancho": 960, "alto": 564, "fecha": "", "titulo": "Instituto Augustóbriga"},
    {"imagen": "img/navalmoral/la-tuna.jpg", "mini": "img/navalmoral/la-tuna-mini.jpg", "ancho": 720, "alto": 508, "fecha": "", "titulo": "La tuna"},
    {"imagen": "img/navalmoral/los-canos.jpg", "mini": "img/navalmoral/los-canos-mini.jpg", "ancho": 960, "alto": 651, "fecha": "", "titulo": "Los Caños"},
    {"imagen": "img/navalmoral/mercado-de-abastos.jpg", "mini": "img/navalmoral/mercado-de-abastos-mini.jpg", "ancho": 633, "alto": 910, "fecha": "", "titulo": "Mercado de abastos"},
    {"imagen": "img/navalmoral/mercado-de-abastos-2.jpg", "mini": "img/navalmoral/mercado-de-abastos-2-mini.jpg", "ancho": 960, "alto": 583, "fecha": "", "titulo": "Mercado de abastos"},
    {"imagen": "img/navalmoral/ninos.jpg", "mini": "img/navalmoral/ninos-mini.jpg", "ancho": 576, "alto": 432, "fecha": "", "titulo": "Niños"},
    {"imagen": "img/navalmoral/parque-municipal.jpg", "mini": "img/navalmoral/parque-municipal-mini.jpg", "ancho": 926, "alto": 633, "fecha": "", "titulo": "Parque Municipal"},
    {"imagen": "img/navalmoral/parque-municipal-2.jpg", "mini": "img/navalmoral/parque-municipal-2-mini.jpg", "ancho": 1024, "alto": 549, "fecha": "", "titulo": "Parque Municipal"},
    {"imagen": "img/navalmoral/parque-municipal-nevado.jpg", "mini": "img/navalmoral/parque-municipal-nevado-mini.jpg", "ancho": 956, "alto": 633, "fecha": "", "titulo": "Parque Municipal nevado"},
    {"imagen": "img/navalmoral/paseo-de-la-estacion-2.jpg", "mini": "img/navalmoral/paseo-de-la-estacion-2-mini.jpg", "ancho": 1024, "alto": 612, "fecha": "", "titulo": "Paseo de la Estación"},
    {"imagen": "img/navalmoral/paseo-de-la-estacion-3.jpg", "mini": "img/navalmoral/paseo-de-la-estacion-3-mini.jpg", "ancho": 875, "alto": 633, "fecha": "", "titulo": "Paseo de la Estación"},
    {"imagen": "img/navalmoral/piscina-y-campo-de-futbol.jpg", "mini": "img/navalmoral/piscina-y-campo-de-futbol-mini.jpg", "ancho": 1024, "alto": 510, "fecha": "", "titulo": "Piscina y campo de fútbol"},
    {"imagen": "img/navalmoral/plaza-vieja-de-navalmoral.jpg", "mini": "img/navalmoral/plaza-vieja-de-navalmoral-mini.jpg", "ancho": 720, "alto": 479, "fecha": "", "titulo": "Plaza vieja de Navalmoral"},
    {"imagen": "img/navalmoral/policias.jpg", "mini": "img/navalmoral/policias-mini.jpg", "ancho": 450, "alto": 321, "fecha": "", "titulo": "Policías"},
    {"imagen": "img/navalmoral/primera-piedra-de-san-isidro.jpg", "mini": "img/navalmoral/primera-piedra-de-san-isidro-mini.jpg", "ancho": 455, "alto": 720, "fecha": "", "titulo": "Primera piedra de San Isidro"},
    {"imagen": "img/navalmoral/puente-del-arroyo-sensa-antes-de-los-canos.jpg", "mini": "img/navalmoral/puente-del-arroyo-sensa-antes-de-los-canos-mini.jpg", "ancho": 960, "alto": 576, "fecha": "", "titulo": "Puente del arroyo Sensa, antes de los Caños"},
    {"imagen": "img/navalmoral/sala-de-fiestas-capri.jpg", "mini": "img/navalmoral/sala-de-fiestas-capri-mini.jpg", "ancho": 480, "alto": 339, "fecha": "", "titulo": "Sala de fiestas Capri"},
    {"imagen": "img/navalmoral/servicio-de-autobuses.jpg", "mini": "img/navalmoral/servicio-de-autobuses-mini.jpg", "ancho": 633, "alto": 852, "fecha": "", "titulo": "Servicio de autobuses"},
    {"imagen": "img/navalmoral/tabacalera-2.jpg", "mini": "img/navalmoral/tabacalera-2-mini.jpg", "ancho": 1000, "alto": 633, "fecha": "", "titulo": "Tabacalera"},
    {"imagen": "img/navalmoral/vista-aerea-del-parque-municipal.jpg", "mini": "img/navalmoral/vista-aerea-del-parque-municipal-mini.jpg", "ancho": 891, "alto": 633, "fecha": "", "titulo": "Vista aérea del Parque Municipal"},
    {"imagen": "img/navalmoral/vista-aerea-del-ayuntamiento.jpg", "mini": "img/navalmoral/vista-aerea-del-ayuntamiento-mini.jpg", "ancho": 944, "alto": 633, "fecha": "", "titulo": "Vista aérea del ayuntamiento"},
    {"imagen": "img/navalmoral/vista-del-pueblo.jpg", "mini": "img/navalmoral/vista-del-pueblo-mini.jpg", "ancho": 960, "alto": 196, "fecha": "", "titulo": "Vista del pueblo"},
    {"imagen": "img/navalmoral/vista-desde-la-carretera-de-valdehuncar.jpg", "mini": "img/navalmoral/vista-desde-la-carretera-de-valdehuncar-mini.jpg", "ancho": 1024, "alto": 590, "fecha": "", "titulo": "Vista desde la carretera de Valdehúncar"},
    {"imagen": "img/navalmoral/vista-desde-la-carretera-de-valdehuncar-2.jpg", "mini": "img/navalmoral/vista-desde-la-carretera-de-valdehuncar-2-mini.jpg", "ancho": 1010, "alto": 633, "fecha": "", "titulo": "Vista desde la carretera de Valdehúncar"},
    {"imagen": "img/navalmoral/zona-de-los-canos.jpg", "mini": "img/navalmoral/zona-de-los-canos-mini.jpg", "ancho": 919, "alto": 633, "fecha": "", "titulo": "Zona de los Caños"},
    {"imagen": "img/navalmoral/calle-del-cerro.jpg", "mini": "img/navalmoral/calle-del-cerro-mini.jpg", "ancho": 960, "alto": 657, "fecha": "", "titulo": "¿Calle del Cerro?"},
    {"imagen": "img/navalmoral/instituto-zurbaran.jpg", "mini": "img/navalmoral/instituto-zurbaran-mini.jpg", "ancho": 960, "alto": 619, "fecha": "", "titulo": "¿Instituto Zurbarán?"},
    {"imagen": "img/navalmoral/la-retuerta.jpg", "mini": "img/navalmoral/la-retuerta-mini.jpg", "ancho": 987, "alto": 633, "fecha": "", "titulo": "¿La Retuerta?"},
    {"imagen": "img/navalmoral/paseo-de-la-estacion-4.jpg", "mini": "img/navalmoral/paseo-de-la-estacion-4-mini.jpg", "ancho": 1014, "alto": 633, "fecha": "", "titulo": "¿Paseo de la Estación?"},
  ],
};

// Unidades o bloques de cada asignatura, con sus materiales
const MATERIAS = {

  "1eso": [
    { titulo: "1. La Tierra y su representación: mapas y coordenadas", bloque: "Geografía", materiales: [
    ]},
    { titulo: "2. El relieve de la Tierra", bloque: "Geografía", materiales: [
    ]},
    { titulo: "3. Aguas, climas y paisajes", bloque: "Geografía", materiales: [
    ]},
    { titulo: "4. El medio físico de España y de Extremadura", bloque: "Geografía", materiales: [
    ]},
    { titulo: "5. La Prehistoria", bloque: "Historia", materiales: [
      { tipo: "actividad", titulo: "Reconstrucción 3D: el poblado de la Isla de Valdecañas",
        descripcion: "Pasea por un poblado de la Edad del Cobre del Campo Arañuelo, hacia el 2900 a. C.",
        vista: "img/materiales/poblado-valdecanas.jpg",
        enlace: "materiales/1eso/poblado-valdecanas/index.html" },
    ]},
    { titulo: "6. Mesopotamia y Egipto", bloque: "Historia", materiales: [
    ]},
    { titulo: "7. Grecia", bloque: "Historia", materiales: [
    ]},
    { titulo: "8. Roma e Hispania romana", bloque: "Historia", materiales: [
    ]},
  ],

  "historia-espana": [
    { titulo: "Raíces históricas: de la Prehistoria al siglo XVIII", bloque: "hasta 1788", materiales: [
      { tipo: "pdf", titulo: "Cuestiones breves resumidas",
        descripcion: "Resumen de las cuestiones breves para preparar la PAU.",
        vista: "img/materiales/cuestiones-breves.jpg",
        enlace: "https://classroom.google.com/w/MjUzNTEwOTg1OTZa/t/all" },
    ]},
    { titulo: "Crisis del Antiguo Régimen", bloque: "1788–1833",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
        { tipo: "pdf", titulo: "Comentario 1. Decreto I de las Cortes de Cádiz (1810)",
          descripcion: "Comentario resuelto del decreto de 24 de septiembre de 1810.",
          vista: "img/materiales/comentario-decreto-1810.jpg",
          enlace: "https://classroom.google.com/c/ODg0MjE1MjQ2MTgw/m/MjU1MjY0OTY4NzJa/details" },
        { tipo: "pdf", titulo: "Comentario 2. Constitución de 1812",
          descripcion: "Comentario resuelto de la Constitución de Cádiz de 1812.",
          vista: "img/materiales/comentario-constitucion-1812.jpg",
          enlace: "https://classroom.google.com/c/ODg0MjE1MjQ2MTgw/m/MjU1MjY0OTMxNTZa/details" },
      ]},
    ]},
    { titulo: "Construcción del Estado liberal", bloque: "1833–1874",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
      ]},
    ]},
    { titulo: "La Restauración", bloque: "1874–1931",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
      ]},
    ]},
    { titulo: "Segunda República y Guerra Civil", bloque: "1931–1939",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
      ]},
    ]},
    { titulo: "El franquismo", bloque: "1939–1975",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
      ]},
    ]},
    { titulo: "Transición y democracia", bloque: "1975–hoy",
    apartados: [
      { titulo: "Temas PAU", materiales: [
      ]},
      { titulo: "Comentarios de fuente histórica", materiales: [
      ]},
    ]},
  ],

};
