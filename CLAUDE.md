# CLAUDE.md · Web «Geografía e Historia con Profe JuanRa»

Contexto para Claude Code. Léelo antes de tocar nada.

## Qué es
Web docente de Juan Ramón Marcos (Profe JuanRa), profesor de Geografía e Historia
del IES Albalat (Navalmoral de la Mata, Cáceres). Se publica con GitHub Pages desde
la rama `main`, carpeta raíz. HTML, CSS y JavaScript sin frameworks ni compilación:
lo que está en el repositorio es lo que se publica.

Público: alumnado de ESO y Bachillerato y sus familias. Textos en español de España,
claros y cercanos, con rigor histórico.

## Cómo está organizada
- `contenidos.js` — **el único archivo que el profesor edita a mano** para añadir
  materiales. Contiene `WEB` (enlaces generales: YouTube, Instagram, paseo de
  Navalmoral), `RECONSTRUCCIONES`, `MATERIALES`, `PRESENTACIONES`, `GALERIA` y
  `MATERIAS` (unidades por asignatura). Mantén los comentarios de ayuda del
  principio y su formato «copia esta línea y cambia el texto».
- `comun.js` — partes comunes de todas las páginas: menú (`MENU`), pie y pintado de
  unidades, materiales, galería y reconstrucciones a partir de `contenidos.js`.
  Cada página indica dónde está con `<body data-pagina="...">`.
- `evaluacion.js` — criterios de evaluación por asignatura (competencia, criterio,
  acciones, indicadores, actividades, técnicas e instrumentos). **Se genera a partir
  de los documentos Word del profesor**; no se edita a mano: si cambian los Word,
  se vuelve a generar. Normativa: Decreto 110/2022 (ESO) y Decreto 109/2022
  (Bachillerato) de Extremadura.
- `estilo.css` — estilos de toda la web (tipografía Poppins).
- Páginas: `index.html`, `eso.html`, `1eso.html`…`4eso.html`, `bachillerato.html`,
  `historia-mundo-contemporaneo.html`, `historia-espana.html`, `geografia.html`,
  `historia-arte.html`, `reconstrucciones.html`, `404.html`.
- `img/` — cabeceras, tarjetas, `materiales/` (vistas previas), `galeria/`
  (documentos históricos, cada uno con su versión `-mini`) y `navalmoral/`
  (fotografías antiguas del pueblo, también con `-mini`).
- `materiales/1eso/<reconstruccion>/` — reconstrucciones 3D autónomas con three.js
  (copia local en `src/vendor/`): `poblado-valdecanas` y `dolmen-moina-ii`. Cada una
  tiene `index.html`, `texto.html`, `src/` (datos, escena, interfaz) y `assets/`.
- `materiales/navalmoral-1850/` — paseo 3D por Navalmoral hacia 1850 (ver abajo).
- `egipto.html` + `egipto/` — 1.º ESO: mapa SVG del antiguo Egipto (enclaves en `enclaves.js`,
  geografía en `mapa-geo.js`), ficha de datos de la Gran Pirámide (`piramide-datos.js`, con nivel
  Medido/Estimación/Documentado y fuentes), «Reto del escriba» y lectura fácil. Sin GoatCounter.
- `materiales/1eso/gran-piramide/` — reconstrucción 3D de la Gran Pirámide (three.js r147 local),
  usa los datos de `egipto/piramide-datos.js`. Fotos propias para comparar en `img/egipto/`.

## Convenciones
- Las páginas cargan `estilo.css`, `contenidos.js` y `comun.js` con `?v=Date.now()`
  para evitar la caché del navegador. Mantén ese sistema en las páginas nuevas.
- Página nueva: copia la estructura de una existente (`#barra`, `main#contenido`,
  `#pie`, scripts al final, contador GoatCounter) y añádela a `MENU` en `comun.js`.
- Enlaces de Google Classroom o Drive se marcan «Solo alumnos» automáticamente
  (solo los abre el alumnado con cuenta de Educarex).
- Las reconstrucciones distinguen siempre lo comprobado (fuentes, excavaciones),
  lo deducido y lo hipotético. Cita las fuentes; no inventes referencias.
- Imágenes de galería: versión grande + versión `-mini` con el mismo nombre.
- Contador de visitas GoatCounter (sin cookies). No añadir seguimiento con cookies.
- El repositorio es público: no subir datos del alumnado ni nada privado.

## Notas
- `materiales/navalmoral-1850/index.html` — paseo 3D «Navalmoral de la Mata hacia
  1850», un solo archivo HTML (three.js 0.160 desde jsDelivr). Antes era un artifact
  de claude.ai; ahora vive en la web y no depende de ninguna cuenta.
- Los commits recientes se hicieron subiendo archivos desde la web de GitHub
  («Add files via upload»).
- Claude Code sube los cambios **directamente a `main`**, sin ramas de trabajo ni
  pull requests (decisión del profesor). Antes de subir, `git fetch origin main` e
  integrar lo que haya subido él desde la web. Claude no puede borrar ramas en
  GitHub, así que no conviene crearlas.
- El profesor guarda en su ordenador una carpeta con las cosas de la web, y **puede
  estar desfasada** respecto a GitHub (en noviembre de 2026 le faltaban, entre otras
  cosas, `egipto.html`, `egipto/`, `materiales/1eso/gran-piramide/`,
  `materiales/navalmoral-1850/` y el `contenidos.js` actual). Si trabajas en esa
  carpeta, sincronízala primero con `origin/main` sin borrar sus archivos propios que
  no estén en la web (Word, borradores…). Nunca subas desde ella un archivo antiguo
  que sobrescriba uno más reciente de GitHub, sobre todo `contenidos.js`.
