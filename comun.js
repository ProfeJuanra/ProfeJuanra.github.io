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
    { id: 'reconstrucciones', texto: 'Reconstrucciones 3D', enlace: 'reconstrucciones.html' },
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

  // ---- Materiales: apartado general y unidades ----
  const NOMBRE_TIPO = { pdf: 'PDF', presentacion: 'Presentación', video: 'Vídeo', actividad: 'Actividad', enlace: 'Enlace' };
  // Enlaces de Classroom o Drive: solo los abren los alumnos con su cuenta
  const esPrivado = (url) => /classroom\.google\.com|drive\.google\.com|docs\.google\.com/.test(url || '');
  const candado = () => el('span', { class: 'candado' }, '🔒 Solo alumnos');

  // Dibuja una lista de materiales: con vista previa en fichas, sin ella en lista
  function pintarMateriales(mats, destino) {
    const conVista = mats.filter(m => m.vista);
    const sinVista = mats.filter(m => !m.vista);
    if (conVista.length) {
      const rejilla = el('div', { class: 'fichas' });
      for (const m of conVista) {
        const tipo = (m.tipo || 'enlace').toLowerCase();
        const info = el('div', { class: 'info' },
          el('span', { class: 'tipo ' + tipo }, NOMBRE_TIPO[tipo] || tipo),
          el('h3', {}, m.titulo || 'Material'));
        if (m.descripcion) info.append(el('p', {}, m.descripcion));
        if (esPrivado(m.enlace)) info.append(candado());
        info.append(el('span', { class: 'abrir' }, esPrivado(m.enlace) ? 'Abrir en Classroom →' : 'Abrir →'));
        rejilla.append(el('a', { class: 'ficha', href: m.enlace || '#', target: '_blank', rel: 'noopener' },
          el('img', { src: m.vista, alt: '', loading: 'lazy' }), info));
      }
      destino.append(rejilla);
    }
    if (sinVista.length) {
      const lista = el('ul', { class: 'materiales' });
      for (const m of sinVista) {
        const tipo = (m.tipo || 'enlace').toLowerCase();
        const a = el('a', { href: m.enlace || '#', target: '_blank', rel: 'noopener' },
          el('span', { class: 'tipo ' + tipo }, NOMBRE_TIPO[tipo] || tipo),
          el('span', { class: 'nombre' }, m.titulo || 'Material'));
        if (esPrivado(m.enlace)) a.append(candado());
        lista.append(el('li', {}, a));
      }
      destino.append(lista);
    }
  }

  // Aviso de «Solo alumnos», una vez por página, antes del primer material privado
  let avisoPuesto = false;
  function aviso(antesDe, mats) {
    if (avisoPuesto || !mats.some(m => esPrivado(m.enlace))) return;
    antesDe.before(el('p', { class: 'nota-alumnos' },
      '🔒 Los materiales marcados como «Solo alumnos» se abren en Google Classroom. Entra con tu cuenta de Educarex para verlos y descargarlos.'));
    avisoPuesto = true;
  }

  // Apartado «Materiales» (materiales generales de la asignatura)
  document.querySelectorAll('[data-materiales]').forEach(caja => {
    const mats = (typeof MATERIALES !== 'undefined' && MATERIALES[caja.dataset.materiales]) || [];
    if (!mats.length) return;               // si no hay, el apartado queda oculto
    aviso(caja, mats);
    pintarMateriales(mats, caja);
    caja.closest('section').hidden = false;
  });

  // Unidades o bloques, cada uno desplegable con sus materiales
  document.querySelectorAll('[data-unidades]').forEach(caja => {
    const unidades = MATERIAS[caja.dataset.unidades] || [];
    aviso(caja, unidades.flatMap(u => [...(u.materiales || []), ...(u.apartados || []).flatMap(a => a.materiales || [])]));
    unidades.forEach(u => {
      const det = el('details', { class: 'unidad' });
      const sum = el('summary', {}, el('span', { class: 't' }, u.titulo));
      if (u.bloque) sum.append(el('small', {}, u.bloque));
      const dentro = el('div', { class: 'dentro' });
      const mats = u.materiales || [];
      if (u.apartados) {
        // Bloque dividido en apartados (Temas PAU, Comentarios de fuente histórica…)
        if (mats.length) pintarMateriales(mats, dentro);
        u.apartados.forEach(a => {
          const ap = el('div', { class: 'apartado' }, el('h3', {}, a.titulo));
          if ((a.materiales || []).length) pintarMateriales(a.materiales, ap);
          else ap.append(el('p', { class: 'vacio' }, 'Aparecerán aquí muy pronto.'));
          dentro.append(ap);
        });
      } else if (mats.length === 0) {
        dentro.append(el('p', { class: 'vacio' }, 'Los materiales de esta unidad aparecerán aquí muy pronto.'));
      } else {
        pintarMateriales(mats, dentro);
      }
      det.append(sum, dentro);
      caja.append(det);
    });
  });

  // ---- Presentaciones de Canva: se ven en la propia web, sin descargar ----
  document.querySelectorAll('[data-presentaciones]').forEach(caja => {
    const lista = (typeof PRESENTACIONES !== 'undefined' && PRESENTACIONES[caja.dataset.presentaciones]) || [];
    if (!lista.length) return;
    caja.closest('section').hidden = false;

    const visor = el('dialog', { class: 'visor visor-canva', 'aria-label': 'Presentación' });
    const marco = el('div', { class: 'marco' });
    const titulo = el('b', {});
    const cerrar = el('button', { class: 'visor-cerrar', type: 'button', 'aria-label': 'Cerrar' }, '✕');
    visor.append(cerrar, el('figure', {}, marco, el('div', { class: 'visor-pie' }, titulo)));
    document.body.append(visor);
    const cerrarVisor = () => { visor.close(); };
    visor.addEventListener('close', () => marco.replaceChildren());   // para el iframe al cerrar
    cerrar.addEventListener('click', cerrarVisor);
    visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });

    const rejilla = el('div', { class: 'fichas' });
    for (const p of lista) {
      const listo = /^https:\/\/www\.canva\.com\/design\/[^/]+\/[^/]+\/view/.test(p.canva || '');
      const info = el('div', { class: 'info' },
        el('span', { class: 'tipo presentacion' }, 'Presentación'),
        el('h3', {}, p.titulo));
      if (p.descripcion) info.append(el('p', {}, p.descripcion));
      info.append(el('span', { class: 'abrir' }, listo ? 'Ver presentación →' : 'Disponible muy pronto'));
      const ficha = el('button', { class: 'ficha', type: 'button' }, el('img', { src: p.vista, alt: '', loading: 'lazy' }), info);
      if (!listo) { ficha.disabled = true; ficha.classList.add('pronto'); }
      ficha.addEventListener('click', () => {
        const url = p.canva.split('?')[0] + '?embed';
        marco.replaceChildren(el('iframe', { src: url, title: p.titulo, loading: 'lazy', allow: 'fullscreen', allowfullscreen: '' }));
        titulo.textContent = p.titulo;
        visor.showModal();
      });
      rejilla.append(ficha);
    }
    caja.append(rejilla);
  });

  // ---- Criterios de evaluación (solo lectura, con marca de agua) ----
  document.querySelectorAll('[data-evaluacion]').forEach(caja => {
    const lista = (typeof EVALUACION !== 'undefined' && EVALUACION[caja.dataset.evaluacion]) || [];
    if (!lista.length) return;
    caja.closest('section').hidden = false;
    const conHtml = (tag, clase, h) => { const e = el(tag, clase ? { class: clase } : {}); e.innerHTML = h; return e; };
    const bloque = (titulo, items, clase) => {
      if (!items || !items.length) return null;
      const ul = el('ul', {});
      items.forEach(h => ul.append(conHtml('li', '', h)));
      if (items.every(h => /^(<b>)?\s*\d+\./.test(h))) ul.className = 'numerada';
      return el('div', { class: 'ev-bloque ' + (clase || '') }, el('h4', {}, titulo), ul);
    };
    // Agrupar por competencia específica
    const grupos = new Map();
    lista.forEach(c => {
      if (!grupos.has(c.competencia)) grupos.set(c.competencia, []);
      grupos.get(c.competencia).push(c);
    });
    grupos.forEach((crits, num) => {
      const texto = crits.map(c => c.textoCompetencia).sort((a, b) => b.length - a.length)[0];
      const grupo = el('div', { class: 'ev-competencia' },
        el('div', { class: 'ev-ce' }, el('span', { class: 'ev-num' }, 'CE ' + num),
          el('div', {}, el('h3', {}, 'Competencia específica ' + num), el('p', {}, texto))));
      crits.forEach(c => {
        const det = el('details', { class: 'unidad ev-criterio' });
        det.append(el('summary', {}, el('span', { class: 't' }, el('b', {}, 'Criterio ' + c.codigo), ' ', el('span', { class: 'ev-resumen' }, c.criterio))));
        const dentro = el('div', { class: 'ev-dentro' });
        dentro.append(el('p', { class: 'ev-texto' }, el('b', {}, 'Criterio ' + c.codigo + '. '), c.criterio));
        const rej = el('div', { class: 'ev-rejilla' });
        [bloque('Acciones evaluables', c.acciones), bloque('Indicadores de logro', c.indicadores),
         bloque('Actividades y tareas', c.actividades, 'ancho'),
         bloque('Técnicas de evaluación', c.tecnicas), bloque('Instrumentos de evaluación', c.instrumentos)].forEach(b => b && rej.append(b));
        dentro.append(rej);
        det.append(dentro);
        grupo.append(det);
      });
      caja.append(grupo);
    });
    // Solo lectura: sin menú contextual, sin copiar ni arrastrar
    ['contextmenu', 'copy', 'cut', 'dragstart'].forEach(ev => caja.addEventListener(ev, e => e.preventDefault()));
  });

  // ---- Reconstrucciones en 3D: una tarjeta por cada una ----
  document.querySelectorAll('[data-reconstrucciones]').forEach(caja => {
    const lista = (typeof RECONSTRUCCIONES !== 'undefined' && RECONSTRUCCIONES) || [];
    lista.forEach(r => {
      const url = WEB[r.enlace] || r.enlace;
      const fuera = esExterno(url);
      const a = el('a', { class: 'reco', href: url },
        el('span', { class: 'reco-img' }, el('img', { src: r.vista, alt: '', loading: 'lazy', width: 900, height: 506 })),
        el('span', { class: 'reco-texto' },
          el('span', { class: 'reco-curso' }, r.curso),
          el('h3', {}, r.titulo),
          el('span', { class: 'reco-datos' }, r.lugar + ' · ' + r.epoca),
          el('span', { class: 'reco-desc' }, r.descripcion),
          el('span', { class: 'ir' }, fuera ? 'Abrir en una pestaña nueva ↗' : 'Entrar en la reconstrucción →')));
      if (fuera) { a.target = '_blank'; a.rel = 'noopener'; }
      caja.append(a);
    });
  });

  // ---- Galería de imágenes con visor a pantalla completa ----
  const abrirGaleria = {};
  document.querySelectorAll('[data-galeria]').forEach(caja => {
    const fotos = (typeof GALERIA !== 'undefined' && GALERIA[caja.dataset.galeria]) || [];
    if (!fotos.length) return;
    caja.closest('section').hidden = false;

    const visor = el('dialog', { class: 'visor', 'aria-label': 'Imagen ampliada' });
    const vImg = el('img', { alt: '' });
    const vPie = el('div', { class: 'visor-pie' });
    const cerrar = el('button', { class: 'visor-cerrar', type: 'button', 'aria-label': 'Cerrar' }, '✕');
    const ant = el('button', { class: 'visor-flecha ant', type: 'button', 'aria-label': 'Anterior' }, '‹');
    const sig = el('button', { class: 'visor-flecha sig', type: 'button', 'aria-label': 'Siguiente' }, '›');
    visor.append(cerrar, ant, el('figure', {}, vImg, vPie), sig);
    document.body.append(visor);
    let actual = 0;
    const pie = (f, destino) => {
      destino.replaceChildren();
      destino.append(el('span', { class: 'fecha' }, f.fecha || ''), el('b', {}, f.titulo || ''));
      if (f.texto) destino.append(el('span', { class: 'texto' }, f.texto));
      if (f.fuente) destino.append(el('span', { class: 'fuente' }, 'Fuente: ' + f.fuente));
    };
    const mostrar = (i) => {
      actual = (i + fotos.length) % fotos.length;
      const f = fotos[actual];
      vImg.src = f.imagen; vImg.alt = f.titulo || '';
      pie(f, vPie);
    };
    const abrir = (i) => { mostrar(i); visor.showModal(); };
    abrirGaleria[caja.dataset.galeria] = abrir;
    cerrar.addEventListener('click', () => visor.close());
    ant.addEventListener('click', () => mostrar(actual - 1));
    sig.addEventListener('click', () => mostrar(actual + 1));
    visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
    visor.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
      if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
    if (fotos.length < 2) { ant.hidden = true; sig.hidden = true; }

    fotos.forEach((f, i) => {
      const prop = (f.ancho && f.alto) ? f.ancho / f.alto : 1.4;
      const fig = el('figure', { class: 'foto' });
      fig.style.setProperty('--prop', prop.toFixed(3));
      const boton = el('button', { class: 'foto-boton', type: 'button', 'aria-label': 'Ampliar: ' + (f.titulo || 'imagen') },
        el('img', { src: f.mini || f.imagen, alt: f.titulo || '', loading: 'lazy', width: f.ancho || '', height: f.alto || '' }),
        el('span', { class: 'lupa', 'aria-hidden': 'true' }, '⤢ Ampliar'));
      boton.addEventListener('click', () => abrir(i));
      const cap = el('figcaption', {});
      pie(f, cap);
      if (f.bloque) cap.append(el('span', { class: 'bloque' }, f.bloque));
      fig.append(boton, cap);
      caja.append(fig);
    });

    // Galerías largas: se enseñan unas cuantas y el resto con «Ver más fotos»
    const tanda = 24;
    if (fotos.length > tanda) {
      const figuras = [...caja.children];
      let visibles = tanda;
      const mas = el('button', { class: 'boton oscuro ver-mas', type: 'button' });
      const poner = () => {
        figuras.forEach((f, i) => { f.hidden = i >= visibles; });
        const quedan = fotos.length - visibles;
        mas.textContent = 'Ver más fotos (quedan ' + quedan + ')';
        mas.hidden = quedan <= 0;
      };
      mas.addEventListener('click', () => { visibles += tanda; poner(); });
      caja.after(el('div', { class: 'ver-mas-caja' }, mas));
      poner();
    }
  });

  // ---- Mosaico de fotos bajo la cabecera (de lado a lado) ----
  document.querySelectorAll('[data-mosaico]').forEach(tira => {
    const clave = tira.dataset.mosaico;
    const fotos = (typeof GALERIA !== 'undefined' && GALERIA[clave]) || [];
    if (!fotos.length) { tira.remove(); return; }
    const fila = el('div', { class: 'mosaico-fila' });
    // Cada foto aparece una sola vez (las primeras 45, por orden de fecha)
    fotos.slice(0, 45).forEach((f, i) => {
      const b = el('button', { class: 'tesela', type: 'button', title: (f.fecha ? f.fecha + ' · ' : '') + (f.titulo || ''),
        'aria-label': 'Ver en grande: ' + (f.titulo || 'imagen') },
        el('img', { src: f.mini || f.imagen, alt: '', width: f.ancho || 300, height: f.alto || 200, loading: i < 20 ? 'eager' : 'lazy' }));
      b.addEventListener('click', () => {
        if (abrirGaleria[clave]) abrirGaleria[clave](i);
      });
      fila.append(b);
    });
    tira.append(fila);
  });

  // ---- Botones de secciones: cada uno despliega su apartado ----
  document.querySelectorAll('.boton-seccion').forEach(boton => {
    const panel = document.getElementById(boton.dataset.panel);
    if (!panel || panel.hidden) { boton.remove(); return; }   // apartado sin contenido
    boton.addEventListener('click', () => {
      const abrir = !panel.classList.contains('abierto');
      document.querySelectorAll('.boton-seccion').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.dataset.panel)?.classList.remove('abierto');
      });
      if (abrir) {
        panel.classList.add('abierto');
        boton.setAttribute('aria-expanded', 'true');
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
          <a href="reconstrucciones.html">Reconstrucciones 3D</a>
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
