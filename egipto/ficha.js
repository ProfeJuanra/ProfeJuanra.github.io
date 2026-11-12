/*
  FICHA DE DATOS DE LA GRAN PIRÁMIDE, «¿QUIÉN LA CONSTRUYÓ?» Y «PARA SABER MÁS»
  Lee los datos de piramide-datos.js y los pinta en egipto.html.
*/
(function () {
  'use strict';
  const { el } = window.EGIPTO;
  const P = window.PIRAMIDE;
  // Cada nivel lleva icono y texto, no solo color
  const NIVELES = {
    'Medido':      { icono: '📏', clase: 'medido',      ayuda: 'Se ha medido sobre la propia pirámide.' },
    'Estimación':  { icono: '≈',  clase: 'estimacion',  ayuda: 'Cálculo aproximado de los especialistas.' },
    'Documentado': { icono: '📜', clase: 'documentado', ayuda: 'Lo prueban textos o hallazgos arqueológicos.' },
  };
  const claves = Object.keys(P.FUENTES);
  const numFuente = id => claves.indexOf(id) + 1;

  function citas(ids) {
    return el('span', { class: 'citas' }, 'Fuentes: ', ...ids.flatMap((id, i) => [
      i ? ', ' : '',
      el('a', { href: '#fuente-' + id, title: P.FUENTES[id].cita, text: '[' + numFuente(id) + ']' }),
    ]));
  }

  function pintar(facil) {
    // Tarjetas de datos
    const caja = document.getElementById('datos-piramide');
    if (caja) {
      caja.textContent = '';
      for (const d of P.datos) {
        const n = NIVELES[d.nivel];
        caja.append(el('article', { class: 'dato', id: 'dato-' + d.id },
          el('p', { class: 'nivel ' + n.clase, title: n.ayuda }, el('span', { 'aria-hidden': 'true', text: n.icono + ' ' }), d.nivel),
          el('h3', { text: d.titulo }),
          el('p', { class: 'valor', text: d.valor }),
          el('p', { class: 'texto', text: facil ? d.facil : d.texto }),
          citas(d.fuentes)));
      }
    }
    // ¿Quién la construyó?
    const quien = document.getElementById('quien-texto');
    if (quien) {
      quien.textContent = '';
      (facil ? P.quien.facil : P.quien.texto).forEach(t => quien.append(el('p', { text: t })));
      quien.append(el('p', {}, citas(P.quien.fuentes)));
    }
  }

  function pintarFuentes() {
    const ol = document.getElementById('fuentes-lista');
    if (!ol) return;
    for (const id of claves) {
      const f = P.FUENTES[id];
      const li = el('li', { id: 'fuente-' + id }, f.cita + ' ');
      if (f.url) li.append(el('a', { href: f.url, rel: 'noopener', target: '_blank', text: 'Enlace ↗' }));
      ol.append(li);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    pintarFuentes();
    pintar(window.EGIPTO.facil);
    window.EGIPTO.alCambiar(pintar);
  });
})();
