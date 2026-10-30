/* Partes comunes a todas las páginas: menú, pie y lista de unidades.
   Los materiales se cambian en contenidos.js, no aquí. */
(function () {
  const MENU = [
    { id: 'inicio', texto: 'Inicio', enlace: 'index.html' },
    { id: 'eso', texto: 'ESO', enlace: 'eso.html', sub: [
      { id: '1eso', texto: '1º ESO', enlace: '1eso.html' },
      { id: '2eso', texto: '2º ESO', enlace: '2eso.html' },
      { id: '3eso', texto: '3º ESO', enlace: '3eso.html' },
      { id: '4eso', texto: '4º ESO', enlace: '4eso.html' },
    ]},
    { id: 'bachillerato', texto: 'Bachillerato', enlace: 'bachillerato.html', sub: [
      { id: 'historia-mundo-contemporaneo', texto: '1º Bach. · Historia del Mundo Contemporáneo', enlace: 'historia-mundo-contemporaneo.html' },
      { id: 'historia-espana', texto: '2º Bach. · Historia de España', enlace: 'historia-espana.html' },
      { id: 'geografia', texto: '2º Bach. · Geografía', enlace: 'geografia.html' },
      { id: 'historia-arte', texto: '2º Bach. · Historia del Arte', enlace: 'historia-arte.html' },
    ]},
  ];

  const pagina = document.body.dataset.pagina || 'inicio';
  const el = (tag, attrs = {}, ...hijos) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v; else e.setAttribute(k, v);
    }
    for (const h of hijos) e.append(h);
    return e;
  };
  const esExterno = (url) => /^https?:\/\//.test(url);

  // ---- Menú ----
  const barraHueco = document.getElementById('barra');
  if (barraHueco) {
    const ul = el('ul', { class: 'menu', id: 'menu' });
    for (const item of MENU) {
      const activo = item.id === pagina || (item.sub || []).some(s => s.id === pagina);
      const li = el('li', activo ? { class: 'activo' } : {});
      const a = el('a', { href: item.enlace }, item.texto);
      if (item.id === pagina) a.setAttribute('aria-current', 'page');
      if (item.sub) a.append(el('span', { class: 'flecha', 'aria-hidden': 'true' }, '▾'));
      li.append(a);
      if (item.sub) {
        const sub = el('ul', { class: 'submenu' });
        for (const s of item.sub) {
          const sa = el('a', { href: s.enlace }, s.texto);
          if (s.id === pagina) sa.setAttribute('aria-current', 'page');
          sub.append(el('li', s.id === pagina ? { class: 'activo' } : {}, sa));
        }
        li.append(sub);
      }
      ul.append(li);
    }
    const marca = el('a', { class: 'marca', href: 'index.html' },
      el('img', { src: 'img/logo.png', alt: '' }));
    marca.insertAdjacentHTML('beforeend', '<span>Profe <span class="jr">JuanRa</span></span>');
    const boton = el('button', { class: 'boton-menu', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'menu' }, '☰ Menú');
    const barra = el('header', { class: 'barra' }, el('div', { class: 'contenedor' }, marca, boton, ul));
    boton.addEventListener('click', () => {
      const abierta = barra.classList.toggle('abierta');
      boton.setAttribute('aria-expanded', abierta);
      boton.textContent = abierta ? '✕ Cerrar' : '☰ Menú';
    });
    barraHueco.replaceWith(barra);
  }

  // ---- Enlaces que vienen de contenidos.js (paseo, YouTube, Instagram) ----
  document.querySelectorAll('[data-enlace]').forEach(a => {
    const url = WEB[a.dataset.enlace];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
  });

  // ---- Unidades con sus materiales ----
  const NOMBRE_TIPO = { pdf: 'PDF', presentacion: 'Presentación', video: 'Vídeo', actividad: 'Actividad', enlace: 'Enlace' };
  document.querySelectorAll('[data-unidades]').forEach(caja => {
    const unidades = MATERIAS[caja.dataset.unidades] || [];
    unidades.forEach((u, i) => {
      const det = el('details', { class: 'unidad' });
      const sum = el('summary', {}, el('span', { class: 't' }, u.titulo));
      if (u.bloque) sum.append(el('small', {}, u.bloque));
      const dentro = el('div', { class: 'dentro' });
      const mats = u.materiales || [];
      if (mats.length === 0) {
        dentro.append(el('p', { class: 'vacio' }, 'Los materiales de esta unidad aparecerán aquí muy pronto.'));
      } else {
        const lista = el('ul', { class: 'materiales' });
        for (const m of mats) {
          const tipo = (m.tipo || 'enlace').toLowerCase();
          const a = el('a', { href: m.enlace || '#', target: '_blank', rel: 'noopener' },
            el('span', { class: 'tipo ' + tipo }, NOMBRE_TIPO[tipo] || tipo),
            el('span', {}, m.titulo || 'Material'));
          lista.append(el('li', {}, a));
        }
        dentro.append(lista);
      }
      det.append(sum, dentro);
      caja.append(det);
    });
  });

  // ---- Pie ----
  const pieHueco = document.getElementById('pie');
  if (pieHueco) {
    const pie = el('footer', { class: 'pie-web' });
    pie.innerHTML = `
      <div class="contenedor">
        <div>
          <div class="tira" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <p><b>Profe JuanRa</b> · Geografía e Historia<br>IES Albalat · Navalmoral de la Mata</p>
        </div>
        <nav aria-label="Enlaces del pie">
          <a href="index.html">Inicio</a>
          <a href="eso.html">ESO</a>
          <a href="bachillerato.html">Bachillerato</a>
          <a data-enlace="youtube">YouTube</a>
          <a data-enlace="instagram">Instagram</a>
        </nav>
      </div>`;
    pie.querySelectorAll('[data-enlace]').forEach(a => {
      a.href = WEB[a.dataset.enlace]; a.target = '_blank'; a.rel = 'noopener';
    });
    pieHueco.replaceWith(pie);
  }
})();
