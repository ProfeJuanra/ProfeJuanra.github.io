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

  No borres las comas ni las comillas. Si algo falla, pídeselo a Claude.
*/

const WEB = {
  // Enlace del paseo 3D por Navalmoral en 1850 (se abre en pestaña nueva)
  paseoNavalmoral: "https://claude.ai/artifact/RowaKbFG2UcMV4SZ12xB2S",
  // Tu canal de YouTube
  youtube: "https://www.youtube.com/@juanramonmarcosbarbado",
  instagram: "https://www.instagram.com/juan_barbado/",
};

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
