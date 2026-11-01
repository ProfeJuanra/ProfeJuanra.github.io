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
    { tipo: "pdf", titulo: "Cuestiones breves resumidas",
      descripcion: "Resumen de las cuestiones breves para preparar la PAU.",
      vista: "img/materiales/cuestiones-breves.jpg",
      enlace: "https://classroom.google.com/w/MjUzNTEwOTg1OTZa/t/all" },
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
    { imagen: "img/galeria/1794-mapa.jpg",
      mini: "img/galeria/1794-mapa-mini.jpg", ancho: 1743, alto: 1800,
      fecha: "1794",
      titulo: "Plano manuscrito de 1794",
      bloque: "Crisis del Antiguo Régimen" },
    { imagen: "img/galeria/1813-cortes-inquisicion.jpg",
      mini: "img/galeria/1813-cortes-inquisicion-mini.jpg", ancho: 638, alto: 340,
      fecha: "23 de junio de 1813",
      titulo: "Navalmoral felicita a las Cortes por abolir la Inquisición",
      texto: "El ayuntamiento constitucional, el clero y el pueblo de Navalmoral de la Mata felicitan al Congreso.",
      bloque: "Crisis del Antiguo Régimen" },
    { imagen: "img/galeria/1918-homenaje-rosado.jpg",
      mini: "img/galeria/1918-homenaje-rosado-mini.jpg", ancho: 1738, alto: 1386,
      fecha: "1918",
      titulo: "Los moralos homenajean a Rosado",
      bloque: "La Restauración" },
    { imagen: "img/galeria/1928-mesa-petitoria.jpg",
      mini: "img/galeria/1928-mesa-petitoria-mini.jpg", ancho: 1018, alto: 818,
      fecha: "1928",
      titulo: "Mesa petitoria",
      bloque: "La Restauración" },
    { imagen: "img/galeria/1931-hospital-antipaludico.jpg",
      mini: "img/galeria/1931-hospital-antipaludico-mini.jpg", ancho: 1800, alto: 1200,
      fecha: "1931",
      titulo: "Hospital antipalúdico",
      fuente: "España Médica, 1931",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1933-estampa-campesinos.jpg",
      mini: "img/galeria/1933-estampa-campesinos-mini.jpg", ancho: 1280, alto: 1800,
      fecha: "28 de enero de 1933",
      titulo: "«Los campesinos extremeños invaden las tierras»",
      texto: "Portada de la revista Estampa sobre la ocupación de fincas en Navalmoral de la Mata.",
      fuente: "Estampa, nº 264 · Biblioteca Nacional de España",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1933-estampa-invasion-tierras.jpg",
      mini: "img/galeria/1933-estampa-invasion-tierras-mini.jpg", ancho: 1291, alto: 1800,
      fecha: "1933",
      titulo: "La ocupación de tierras, en Estampa",
      texto: "Reportaje con fotografías de los labriegos y sus yuntas en Navalmoral.",
      fuente: "Estampa · Biblioteca Nacional de España",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1933-detenciones-navalmoral.jpg",
      mini: "img/galeria/1933-detenciones-navalmoral-mini.jpg", ancho: 1678, alto: 828,
      fecha: "1933",
      titulo: "Detenciones en Navalmoral",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1933-ermita-angustias.jpg",
      mini: "img/galeria/1933-ermita-angustias-mini.jpg", ancho: 954, alto: 1228,
      fecha: "1933",
      titulo: "Ermita de las Angustias",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1933-confiscacion-armas.jpg",
      mini: "img/galeria/1933-confiscacion-armas-mini.jpg", ancho: 1030, alto: 724,
      fecha: "1933",
      titulo: "Confiscación de armas",
      bloque: "Segunda República y Guerra Civil" },
    { imagen: "img/galeria/1935-loteria.jpg",
      mini: "img/galeria/1935-loteria-mini.jpg", ancho: 1036, alto: 1280,
      fecha: "1935",
      titulo: "La lotería",
      bloque: "Segunda República y Guerra Civil" },
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
    ]},
    { titulo: "Crisis del Antiguo Régimen", bloque: "1788–1833", materiales: [
    ]},
    { titulo: "Construcción del Estado liberal", bloque: "1833–1874", materiales: [
    ]},
    { titulo: "La Restauración", bloque: "1874–1931", materiales: [
    ]},
    { titulo: "Segunda República y Guerra Civil", bloque: "1931–1939", materiales: [
    ]},
    { titulo: "El franquismo", bloque: "1939–1975", materiales: [
    ]},
    { titulo: "Transición y democracia", bloque: "1975–hoy", materiales: [
    ]},
  ],

};
