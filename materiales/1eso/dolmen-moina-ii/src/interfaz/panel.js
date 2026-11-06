// Interfaz: momentos de la historia, corte, fichas, lista de puntos de interés, hora, captura, diálogos y atajos.
(function (V) {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function avisar(t) { const a = $('avisos'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); }

  V.construirInterfaz = function (ctx) {
    V.construirControles(ctx);
    V.construirPDI(ctx);
    const medirBarra = () => document.documentElement.style.setProperty('--alto-barra', $('barra').getBoundingClientRect().bottom + 'px');
    window.addEventListener('resize', medirBarra); medirBarra();

    $('titulo').textContent = V.intro.titulo;
    $('subtitulo').textContent = V.intro.subtitulo;
    $('intro-texto').textContent = V.intro.texto;

    // ---- Momentos ----
    const cajaM = $('momentos');
    const nombreMomento = id => id.startsWith('sellado') ? 'sellado-fuego' : id;
    V.momentos.forEach(m => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.m = m.id; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<b>${esc(m.nombre)}</b><span>${esc(m.fecha)}</span>`;
      cajaM.appendChild(b);
    });
    let momento = 'uso';
    function fijarMomento(id, silencio) {
      momento = id;
      ctx.dolmen.fijarMomento(id);
      cajaM.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === nombreMomento(id))));
      const m = V.momentos.find(x => x.id === nombreMomento(id));
      $('momento-texto').textContent = m.texto;
      $('pasos-sellado').hidden = !id.startsWith('sellado');
      $('b-fuego').setAttribute('aria-pressed', String(id === 'sellado-fuego'));
      $('b-relleno').setAttribute('aria-pressed', String(id === 'sellado-relleno'));
      ctx.recolocarPaseo && ctx.recolocarPaseo();
      if (!silencio) avisar('Momento: ' + m.nombre + ', ' + m.fecha + '.');
      if (actual) pintarExtra(V.fichas.find(x => x.n === actual));
    }
    cajaM.addEventListener('click', e => { const b = e.target.closest('button'); if (b) fijarMomento(b.dataset.m); });
    $('b-fuego').addEventListener('click', () => fijarMomento('sellado-fuego'));
    $('b-relleno').addEventListener('click', () => fijarMomento('sellado-relleno'));
    ctx.fijarMomento = fijarMomento;

    // ---- Corte («ver por dentro») y grabados ----
    const bC = $('b-corte');
    function fijarCorte(on) {
      bC.setAttribute('aria-pressed', String(on));
      ctx.dolmen.corte(on);
    }
    bC.addEventListener('click', () => { const on = bC.getAttribute('aria-pressed') !== 'true'; fijarCorte(on); avisar(on ? 'Corte del túmulo: ahora ves el interior.' : 'Túmulo completo.'); });
    ctx.fijarCorte = fijarCorte;
    let resaltar = false;
    function fijarResaltar(on) {
      resaltar = on; ctx.dolmen.resaltarGrabados(on);
      document.querySelectorAll('.b-resaltar').forEach(b => b.setAttribute('aria-pressed', String(on)));
    }

    // ---- Lista de puntos de interés ----
    const ol = $('pdi-ol');
    V.fichas.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" data-n="${f.n}"><span class="n" aria-hidden="true">${f.n}</span><span class="t">${esc(f.titulo)}</span><span class="vh">Punto ${f.n}: ${esc(f.titulo)}</span></button>`;
      ol.appendChild(li);
    });
    ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) abrir(+b.dataset.n, true); });
    $('b-vista-general').addEventListener('click', () => { cerrar(); ctx.volarA(ctx.vistaGeneral.cam, ctx.vistaGeneral.obj); });

    // ---- Panel de ficha ----
    let actual = null, nivelLectura = 'basico';
    try { nivelLectura = localStorage.getItem('moina-lectura') || 'basico'; } catch (e) { /* sin almacenamiento */ }
    const pestanas = { basico: $('t-basico'), ampliacion: $('t-ampliacion'), facil: $('t-facil') };
    function pintarTexto() {
      const f = V.fichas.find(x => x.n === actual);
      const txt = f[nivelLectura], el = $('panel-texto');
      el.className = nivelLectura === 'facil' ? 'facil' : '';
      el.innerHTML = nivelLectura === 'facil' ? txt.split(/(?<=\.)\s+/).map(s => `<p>${esc(s)}</p>`).join('') : `<p>${esc(txt)}</p>`;
      for (const k in pestanas) pestanas[k].setAttribute('aria-selected', String(k === nivelLectura));
    }
    // Galería de fotos y calcos del informe (Tera S.L.), con visor a pantalla completa
    const visor = $('d-foto');
    let galeria = [], iFoto = 0;
    function verFoto(i) {
      iFoto = (i + galeria.length) % galeria.length;
      const g = galeria[iFoto];
      $('foto-img').src = g.src; $('foto-img').alt = g.pie;
      $('foto-pie').textContent = g.pie + ' Foto: Tera S.L.';
      $('foto-ant').hidden = $('foto-sig').hidden = galeria.length < 2;
      if (!visor.open) visor.showModal();
    }
    $('foto-ant').addEventListener('click', () => verFoto(iFoto - 1));
    $('foto-sig').addEventListener('click', () => verFoto(iFoto + 1));
    visor.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') verFoto(iFoto - 1); if (e.key === 'ArrowRight') verFoto(iFoto + 1); });
    visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
    function htmlGaleria(lista, clase) {
      return `<div class="${clase}">${lista.map((g, i) => `<button type="button" class="miniatura" data-i="${i}" aria-label="Ampliar: ${esc(g.pie)}"><img src="${g.mini}" alt="" loading="lazy"></button>`).join('')}</div>`;
    }
    function pintarExtra(f) {
      const ex = $('panel-extra');
      let html = '';
      galeria = (f.fotos || []).map(x => ({ src: 'fotos/' + x.f + '.jpg', mini: 'fotos/' + x.f + '-mini.jpg', pie: x.pie }));
      if (f.extra === 'grabados') {
        html += `<p class="botonera"><button type="button" class="b-resaltar" aria-pressed="${resaltar}">Resaltar grabados</button></p>`;
        const losas = V.datos.camara.losas.filter(l => V.grabados[l.id]).map(l => l.id).concat(['acceso']);
        const calcos = losas.map(id => ({ src: 'fotos/calco-' + id + '.jpg', mini: 'fotos/calco-' + id + '-mini.jpg', pie: (id === 'acceso' ? 'Calco del ortostato del acceso' : 'Calco del ortostato U.E. ' + id) + ' (' + V.grabados[id].tecnica + ').' }));
        html += `<h3 class="pie">Calcos de los grabados</h3>` + htmlGaleria(calcos, 'galeria calcos');
        galeria = calcos.concat(galeria);
        if (f.fotos) html += `<h3 class="pie">Fotografías</h3>` + htmlGaleria(galeria.slice(calcos.length), 'galeria').replace(/data-i="(\d+)"/g, (m, i) => `data-i="${+i + calcos.length}"`);
      } else {
        if (f.extra === 'clausura') html += `<p class="botonera"><button type="button" data-p="sellado-fuego" aria-pressed="${momento === 'sellado-fuego'}">1. Losa de cierre y hoguera</button> <button type="button" data-p="sellado-relleno" aria-pressed="${momento === 'sellado-relleno'}">2. Cierre de madera y relleno</button></p>`;
        if (galeria.length) html += `<h3 class="pie">Fotografías de la excavación</h3>` + htmlGaleria(galeria, 'galeria');
      }
      if (galeria.length) html += `<p class="pie credito">Fotos, planimetría y calcos: Tera S.L. Pulsa una imagen para ampliarla.</p>`;
      ex.innerHTML = html;
      ex.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => fijarMomento(b.dataset.p)));
      const br = ex.querySelector('.b-resaltar'); if (br) br.addEventListener('click', () => fijarResaltar(!resaltar));
      ex.querySelectorAll('.miniatura').forEach(b => b.addEventListener('click', () => verFoto(+b.dataset.i)));
    }
    function abrir(n, volar) {
      const f = V.fichas.find(x => x.n === n);
      if (!f) return;
      actual = n;
      if (f.momento && f.momento !== momento && !(f.momento === 'sellado-fuego' && momento === 'sellado-relleno')) fijarMomento(f.momento, true);
      if (f.corte !== undefined) fijarCorte(f.corte);
      if (f.extra !== 'grabados' && resaltar) fijarResaltar(false);
      $('panel-num').textContent = `Punto de interés ${n} de ${V.fichas.length}`;
      $('panel-titulo').textContent = f.titulo;
      $('panel-nivel').innerHTML = f.nivel.map(l => `<span class="chip n${l}">${V.NOMBRE_NIVEL[l]}</span>`).join('') + `<span>${esc(f.nivelTexto)}</span>`;
      $('panel-fuente').textContent = 'Fuente: ' + f.fuente.replace('[Inf.]', 'informe de la excavación de 2012 (Tera S.L.):');
      pintarExtra(f);
      pintarTexto();
      $('panel').hidden = false;
      document.querySelectorAll('#pdi-ol button').forEach(b => b.setAttribute('aria-current', String(+b.dataset.n === n)));
      ctx.resaltarPDI(n);
      if (volar && f.vista) ctx.volarAVista(f.vista);
      $('panel-titulo').setAttribute('tabindex', '-1');
      $('panel-titulo').focus({ preventScroll: true });
      avisar(`Ficha ${n}: ${f.titulo}`);
    }
    function cerrar() {
      if ($('panel').hidden) return;
      $('panel').hidden = true;
      ctx.resaltarPDI(null);
      const b = document.querySelector(`#pdi-ol button[data-n="${actual}"]`);
      if (b) b.focus({ preventScroll: true });
      actual = null;
    }
    ctx.abrirFicha = abrir;
    $('panel-cerrar').addEventListener('click', cerrar);
    $('panel-ant').addEventListener('click', () => abrir(actual === 1 ? V.fichas.length : actual - 1, true));
    $('panel-sig').addEventListener('click', () => abrir(actual === V.fichas.length ? 1 : actual + 1, true));
    for (const k in pestanas) pestanas[k].addEventListener('click', () => {
      nivelLectura = k; try { localStorage.setItem('moina-lectura', k); } catch (e) { /* nada */ }
      pintarTexto();
    });
    document.querySelector('.pestanas').addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const ks = Object.keys(pestanas), i = ks.indexOf(nivelLectura);
      nivelLectura = ks[(i + (e.key === 'ArrowRight' ? 1 : ks.length - 1)) % ks.length];
      pintarTexto(); pestanas[nivelLectura].focus();
    });

    // ---- Hora del día ----
    const rH = $('r-hora'), oH = $('o-hora');
    function hora(v) {
      const h = Math.floor(v), m = Math.round((v - h) * 60);
      oH.textContent = `${h}:${String(m).padStart(2, '0')}`;
      rH.setAttribute('aria-valuetext', `${h} horas y ${m} minutos`);
      ctx.fijarHora(v);
    }
    rH.addEventListener('input', () => hora(+rH.value));
    rH.value = ctx.horaActual || 10.5; hora(+rH.value);

    // ---- Botones ----
    const bP = $('b-pasear');
    bP.addEventListener('click', () => ctx.alternarPaseo());
    ctx.alCambiarModo = function (paseo) {
      bP.setAttribute('aria-pressed', String(paseo));
      $('aviso-paseo').hidden = !paseo;
      $('mando').hidden = !(paseo && (ctx.movil || matchMedia('(pointer: coarse)').matches));
      avisar(paseo ? 'Paseo a pie: estás frente al vestíbulo. Usa W A S D o las flechas para andar.' : 'Vista aérea.');
      if (paseo) { cerrar(); if (bC.getAttribute('aria-pressed') === 'true') fijarCorte(false); }
    };
    ctx.alEntrar = function (dentro) {
      $('aviso-paseo').innerHTML = dentro
        ? 'Estás bajo el túmulo: te alumbras con una antorcha. <b>W A S D</b> o flechas para andar · <b>P</b> para salir'
        : 'Paseo a pie: <b>W A S D</b> o flechas para andar · arrastra para mirar · <b>P</b> para salir';
    };
    $('b-evidencia').addEventListener('click', () => {
      const b = $('b-evidencia'), on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      $('leyenda').hidden = !on;
      ctx.capaEvidencia && ctx.capaEvidencia(on);
      avisar(on ? 'Capa de evidencia activada.' : 'Capa de evidencia desactivada.');
    });
    $('b-mapa').addEventListener('click', () => $('d-mapa').showModal());
    $('b-ayuda').addEventListener('click', () => $('d-ayuda').showModal());
    const cC = $('c-calidad');
    cC.checked = ctx.calidad === 'baja';
    cC.addEventListener('change', () => {
      try { localStorage.setItem('moina-calidad', cC.checked ? 'baja' : 'alta'); } catch (e) { /* nada */ }
      location.reload();
    });
    $('b-captura').addEventListener('click', () => {
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.renderer.domElement.toBlob(b => {
        if (!b) return;
        const a = document.createElement('a');
        a.download = `dolmen-moina-ii-${momento}${actual ? '-punto' + actual : ''}.png`;
        a.href = URL.createObjectURL(b);
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        avisar('Imagen guardada.');
      }, 'image/png');
    });

    // ---- Atajos de teclado ----
    window.addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const paseo = ctx.paseo && ctx.paseo.activo;
      if (e.key === 'Escape') { if (paseo) ctx.alternarPaseo(false); else cerrar(); return; }
      if (paseo && /^Key[WASD]$/.test(e.code)) return;
      const k = e.key.toLowerCase();
      if (k === 'p') bP.click();
      else if (k === 'e') $('b-evidencia').click();
      else if (k === 'v') bC.click();
      else if (k === 'm') $('b-mapa').click();
      else if (k === 'h') $('b-ayuda').click();
      else if (/^[0-9]$/.test(k)) abrir(k === '0' ? 10 : +k, true);
    });

    fijarMomento('uso', true);
  };
})(window.MOINA);
