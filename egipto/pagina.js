/*
  Estado común de la página egipto.html: interruptor «Lectura fácil».
  La preferencia se recuerda en este navegador (si se puede) y se pasa a la
  reconstrucción 3D en el enlace (?facil=1). No se envía a ningún sitio.
*/
(function () {
  'use strict';
  const avisos = [];
  let facil = false;
  try { facil = localStorage.getItem('egipto-facil') === '1'; } catch (e) { /* sin almacenamiento */ }
  if (/[?&]facil=1/.test(location.search)) facil = true;

  window.EGIPTO = {
    get facil() { return facil; },
    alCambiar(fn) { avisos.push(fn); },
    // Pequeña ayuda para crear elementos
    el(tag, attrs, ...hijos) {
      const e = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs || {})) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
      }
      for (const h of hijos) if (h !== null && h !== undefined) e.append(h);
      return e;
    },
  };

  function aplicar() {
    document.documentElement.classList.toggle('lectura-facil', facil);
    document.querySelectorAll('[data-boton-facil]').forEach(b => {
      b.setAttribute('aria-pressed', String(facil));
      b.querySelector('.estado').textContent = facil ? 'activada' : 'desactivada';
    });
    // Los enlaces a la reconstrucción llevan la preferencia
    document.querySelectorAll('a[data-enlace-3d]').forEach(a => {
      a.href = a.dataset.enlace3d + (facil ? '?facil=1' : '');
    });
    avisos.forEach(fn => fn(facil));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-boton-facil]').forEach(b => b.addEventListener('click', () => {
      facil = !facil;
      try { localStorage.setItem('egipto-facil', facil ? '1' : '0'); } catch (e) { /* sin almacenamiento */ }
      aplicar();
    }));
    aplicar();
  });
})();
