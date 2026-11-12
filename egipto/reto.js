/*
  RETO DEL ESCRIBA: preguntas de comprensión con corrección automática.
  Todo ocurre en el navegador: no se guarda ni se envía ninguna respuesta.
  Para cambiar las preguntas, edita la lista PREGUNTAS (la correcta es «ok»).
*/
(function () {
  'use strict';
  const { el } = window.EGIPTO;

  const PREGUNTAS = [
    { p: '¿Dónde vivía casi toda la población del antiguo Egipto?',
      pf: '¿Dónde vivían casi todos los egipcios?',
      op: ['En los oasis del desierto', 'En el valle y el delta del Nilo', 'En la costa del mar Rojo'], ok: 1,
      bien: 'Exacto. Fuera del valle y del delta todo es desierto: el Nilo daba agua y, con sus crecidas, tierra fértil.',
      mal: 'Mira el mapa: las ciudades, templos y necrópolis siguen la franja verde del Nilo. Fuera de ella todo es desierto.' },
    { p: '¿Qué es Giza?',
      pf: '¿Qué es Giza?',
      op: ['La capital de Egipto en el Imperio Antiguo', 'La necrópolis (cementerio) de Menfis', 'Un templo de Tebas dedicado a Amón'], ok: 1,
      bien: 'Muy bien. La capital era Menfis; Giza era uno de sus cementerios reales, en la meseta del desierto.',
      mal: 'Fíjate en el símbolo de Giza en el mapa: es un triángulo, el de las necrópolis. La capital era Menfis.' },
    { p: '¿Qué cuenta el diario de Merer, hallado en Wadi el-Jarf?',
      pf: '¿Qué cuenta el diario de Merer?',
      op: ['Cómo un equipo de trabajadores llevaba en barco caliza de Tura hasta Giza', 'Cómo se castigaba a los esclavos que construían la pirámide', 'Dónde se escondió el tesoro de Keops'], ok: 0,
      bien: 'Correcto. Es el documento escrito más antiguo sobre la obra y muestra una organización del Estado, no esclavos.',
      mal: 'Repasa «¿Quién la construyó?»: Merer era jefe de un equipo que transportaba piedra de Tura por el Nilo.' },
    { p: '¿Por qué la Gran Pirámide se veía blanca y lisa al terminarse?',
      pf: '¿Por qué la pirámide era blanca y lisa?',
      op: ['Porque estaba pintada de cal', 'Porque la cubría un revestimiento de caliza fina y pulida de Tura', 'Porque era de granito blanco de Asuán'], ok: 1,
      bien: 'Así es. Hoy vemos el núcleo escalonado porque el revestimiento se arrancó, sobre todo en la Edad Media, para aprovechar la piedra en otras construcciones.',
      mal: 'Prueba el botón «Hoy / Recién terminada» de la reconstrucción 3D: fíjate en qué capa falta hoy.' },
  ];

  function iniciar() {
    const form = document.getElementById('reto-form');
    if (!form) return;
    const resultado = document.getElementById('reto-resultado');

    function pintar(facil) {
      // Conserva las respuestas marcadas al cambiar a lectura fácil
      const marcadas = PREGUNTAS.map((_, i) => { const r = form.querySelector(`input[name="p${i}"]:checked`); return r ? r.value : null; });
      form.querySelectorAll('fieldset').forEach(f => f.remove());
      const enviar = form.querySelector('.reto-botones');
      PREGUNTAS.forEach((q, i) => {
        const fs = el('fieldset', { class: 'pregunta' },
          el('legend', {}, el('span', { class: 'num', text: (i + 1) + '' }), facil ? q.pf : q.p));
        q.op.forEach((t, j) => {
          const id = `p${i}-${j}`;
          const input = el('input', { type: 'radio', name: 'p' + i, id, value: String(j) });
          if (marcadas[i] === String(j)) input.checked = true;
          fs.append(el('label', { for: id, class: 'opcion' }, input, el('span', { text: t })));
        });
        fs.append(el('p', { class: 'explicacion', id: 'exp-' + i, 'aria-live': 'polite' }));
        form.insertBefore(fs, enviar);
      });
      resultado.textContent = '';
    }

    form.addEventListener('submit', ev => {
      ev.preventDefault();
      let aciertos = 0, sinResponder = 0;
      PREGUNTAS.forEach((q, i) => {
        const marcada = form.querySelector(`input[name="p${i}"]:checked`);
        const fs = form.querySelectorAll('fieldset')[i];
        const exp = document.getElementById('exp-' + i);
        fs.classList.remove('bien', 'mal');
        if (!marcada) { sinResponder++; exp.textContent = 'Te falta responder esta pregunta.'; return; }
        const ok = Number(marcada.value) === q.ok;
        if (ok) aciertos++;
        fs.classList.add(ok ? 'bien' : 'mal');
        exp.textContent = (ok ? '✔ ' : '✘ ') + (ok ? q.bien : q.mal);
      });
      const total = PREGUNTAS.length;
      resultado.textContent = sinResponder
        ? `Llevas ${aciertos} de ${total}. Responde todas las preguntas.`
        : aciertos === total ? `¡${aciertos} de ${total}! Eres digno de ser escriba del faraón.`
        : `${aciertos} de ${total}. Lee las pistas, revisa lo que falla y vuelve a intentarlo.`;
      resultado.focus();
    });
    form.addEventListener('reset', () => {
      setTimeout(() => {
        form.querySelectorAll('fieldset').forEach(f => f.classList.remove('bien', 'mal'));
        form.querySelectorAll('.explicacion').forEach(p => { p.textContent = ''; });
        resultado.textContent = '';
      });
    });

    pintar(window.EGIPTO.facil);
    window.EGIPTO.alCambiar(pintar);
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
