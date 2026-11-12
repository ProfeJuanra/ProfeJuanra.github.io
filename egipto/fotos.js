/*
  COMPARACIÓN «LA PIRÁMIDE HOY / RECONSTRUCCIÓN»
  ==============================================
  Fotos propias del profesor (carpeta img/egipto/). Cada elemento tiene:
  · hoy: foto actual (sin extensión: se busca .webp y, si no, .jpg)
  · reconstruccion (opcional): imagen de la reconstrucción 3D desde el mismo punto
    de vista. Si no hay, la foto se muestra sola.
  · alt / altReco: texto alternativo que describe cada imagen
  · pie: pie de foto
  Mientras la lista esté vacía, el bloque no se muestra.
  Las vistas de la reconstrucción se calcularon haciendo coincidir las esquinas y
  la cima de la pirámide del modelo con las de la foto.

  Ejemplo:
  { hoy: 'img/egipto/piramide-norte-hoy', reconstruccion: 'img/egipto/piramide-norte-reco',
    alt: 'Cara norte de la Gran Pirámide hoy: bloques escalonados de color ocre.',
    altReco: 'La misma vista en la reconstrucción: caras lisas de caliza blanca.',
    pie: 'Cara norte vista desde la meseta. Foto: Juan Ramón Marcos.' },
*/
window.FOTOS_PIRAMIDE = [
  { hoy: 'img/egipto/piramide-esquina-hoy', reconstruccion: 'img/egipto/piramide-esquina-reco',
    alt: 'Esquina de la Gran Pirámide vista desde cerca, al nivel del suelo: hiladas de bloques de color ocre que forman escalones, la cúspide plana y, delante, una furgoneta, turistas y camellos.',
    altReco: 'La misma vista en la reconstrucción: dos caras lisas de caliza blanca que terminan en punta.',
    pie: 'La esquina de la pirámide desde el suelo. Desliza para ver cómo era recién terminada: caras lisas y la punta completa, unos 8 m más alta. Foto: Juan Ramón Marcos.' },
  { hoy: 'img/egipto/piramide-lejos-hoy', reconstruccion: 'img/egipto/piramide-lejos-reco',
    alt: 'La Gran Pirámide vista desde más lejos, con una cara en sombra y otra al sol; a la derecha, al fondo, restos de pirámides pequeñas y autobuses de turistas.',
    altReco: 'La misma vista en la reconstrucción: la pirámide blanca y lisa sobre la arena.',
    pie: 'Desde más lejos se aprecia su tamaño: los autobuses del pie parecen de juguete. Foto: Juan Ramón Marcos.' },
  { hoy: 'img/egipto/piramides-giza',
    alt: 'Panorámica de la meseta de Giza: a la izquierda, al fondo, la Gran Pirámide; en el centro, la de Kefrén, con su punta más clara; a la derecha, la de Micerino y pirámides pequeñas.',
    pie: 'Las tres pirámides de Giza: Keops (izquierda, al fondo), Kefrén (centro) y Micerino (derecha). Fíjate en la punta de Kefrén: conserva parte del revestimiento liso original. Así se veía entera la Gran Pirámide. Foto: Juan Ramón Marcos.' },
];

(function () {
  'use strict';
  const { el } = window.EGIPTO;

  function imagen(base, alt) {
    // <picture> con WebP y alternativa JPG
    return el('picture', {},
      el('source', { srcset: base + '.webp', type: 'image/webp' }),
      el('img', { src: base + '.jpg', alt, loading: 'lazy', width: '1600', height: '1200' }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const seccion = document.getElementById('comparar');
    const caja = document.getElementById('comparar-fotos');
    if (!seccion || !caja || !window.FOTOS_PIRAMIDE.length) return;
    seccion.hidden = false;
    window.FOTOS_PIRAMIDE.forEach((f, i) => {
      if (!f.reconstruccion) {   // Foto sola, sin comparación
        caja.append(el('figure', { class: 'cmp sola' }, el('div', { class: 'cmp-marco' }, imagen(f.hoy, f.alt)), el('figcaption', { text: f.pie })));
        return;
      }
      const reco = el('div', { class: 'cmp-reco' }, imagen(f.reconstruccion, f.altReco));
      const rango = el('input', { type: 'range', min: '0', max: '100', value: '50', class: 'cmp-rango',
        'aria-label': 'Desliza para comparar la foto de hoy con la reconstrucción', id: 'cmp-' + i });
      const marco = el('div', { class: 'cmp-marco' }, imagen(f.hoy, f.alt), reco,
        el('span', { class: 'cmp-et hoy', text: 'Hoy' }), el('span', { class: 'cmp-et reco', text: 'Reconstrucción' }), rango);
      const mover = () => marco.style.setProperty('--corte', rango.value + '%');
      rango.addEventListener('input', mover); mover();
      caja.append(el('figure', { class: 'cmp' }, marco, el('figcaption', { text: f.pie })));
    });
  });
})();
