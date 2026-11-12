/*
  COMPARACIÓN «LA PIRÁMIDE HOY / RECONSTRUCCIÓN»
  ==============================================
  Fotos propias del profesor (carpeta img/egipto/). Cada pareja tiene:
  · hoy: foto actual (sin extensión: se busca .webp y, si no, .jpg)
  · reconstruccion: imagen de la reconstrucción 3D desde un punto parecido
  · alt / altReco: texto alternativo que describe cada imagen
  · pie: pie de foto
  Mientras la lista esté vacía, el bloque no se muestra.

  Ejemplo:
  { hoy: 'img/egipto/piramide-norte-hoy', reconstruccion: 'img/egipto/piramide-norte-reco',
    alt: 'Cara norte de la Gran Pirámide hoy: bloques escalonados de color ocre.',
    altReco: 'La misma vista en la reconstrucción: caras lisas de caliza blanca.',
    pie: 'Cara norte vista desde la meseta. Foto: Juan Ramón Marcos.' },
*/
window.FOTOS_PIRAMIDE = [
];

(function () {
  'use strict';
  const { el } = window.EGIPTO;

  function imagen(base, alt) {
    // <picture> con WebP y alternativa JPG
    return el('picture', {},
      el('source', { srcset: base + '.webp', type: 'image/webp' }),
      el('img', { src: base + '.jpg', alt, loading: 'lazy', width: '1600', height: '1067' }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const seccion = document.getElementById('comparar');
    const caja = document.getElementById('comparar-fotos');
    if (!seccion || !caja || !window.FOTOS_PIRAMIDE.length) return;
    seccion.hidden = false;
    window.FOTOS_PIRAMIDE.forEach((f, i) => {
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
