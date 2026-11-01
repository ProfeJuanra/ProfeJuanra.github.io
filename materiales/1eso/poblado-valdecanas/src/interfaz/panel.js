// Interfaz: fichas, lista de puntos de interés, hora, captura, diálogos y atajos de teclado.
(function (V) {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function avisar(t) { const a = $('avisos'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); }

  // Esquemas SVG propios para algunas fichas (a escala a partir de los datos de la excavación)
  function esquemaSilo() {
    const e = V.plano.estructuras.find(s => s.id === '33');
    const D = e.diametro, P = e.profundidad, E = 0.3, k = 120;   // 1 m = 120 px
    const w = 360, cx = w / 2, y0 = 40 + E * k;
    const rb = 0.36;
    const pts = [[-rb, 0], [-rb * 1.15, 0.18], [-D / 2, (P + E) * 0.55], [-D / 2 * 0.95, P + E - 0.03], [D / 2 * 0.95, P + E - 0.03], [D / 2, (P + E) * 0.55], [rb * 1.15, 0.18], [rb, 0]];
    const d = 'M' + pts.map(([x, y]) => (cx + x * k).toFixed(1) + ' ' + (40 + y * k).toFixed(1)).join(' L') + ' Z';
    return `<svg viewBox="0 0 ${w} ${40 + (P + E) * k + 40}" role="img" aria-label="Sección del silo 33: boca estrecha, cuerpo en forma de campana, ${D.toString().replace('.', ',')} metros de diámetro y ${P.toString().replace('.', ',')} metros de profundidad conservada.">
      <rect x="0" y="40" width="${w}" height="${(P + E) * k + 10}" fill="#c9a77d"/>
      <rect x="0" y="40" width="${w}" height="${E * k}" fill="#e6d2b4" opacity=".75"/>
      <path d="${d}" fill="#6b4f36" stroke="#3d2b1c" stroke-width="2"/>
      <ellipse cx="${cx + 6}" cy="${40 + (P + E) * k - 38}" rx="26" ry="34" fill="#8a5a3a" stroke="#3d2b1c"/>
      <rect x="${cx - D / 2 * k * 0.8}" y="${40 + (P + E) * k - 8}" width="${D * k * 0.8}" height="6" fill="#5d6168"/>
      <line x1="0" y1="40" x2="${w}" y2="40" stroke="#555" stroke-dasharray="5 4"/>
      <line x1="0" y1="${y0}" x2="${w}" y2="${y0}" stroke="#3d2b1c" stroke-width="2"/>
      <text x="6" y="34" font-size="12" fill="currentColor">suelo antiguo (hipótesis)</text>
      <text x="6" y="${y0 + 16}" font-size="12" fill="#3d2b1c">suelo actual</text>
      <text x="${w - 6}" y="${40 + E * k / 2 + 4}" font-size="11" fill="#3d2b1c" text-anchor="end">~30 cm erosionados</text>
      <text x="${cx + rb * k + 6}" y="34" font-size="12" fill="currentColor">boca estrecha</text>
      <text x="${cx}" y="${40 + (P + E) * k + 28}" font-size="13" text-anchor="middle" fill="currentColor">${D.toString().replace('.', ',')} m de diámetro · ${P.toString().replace('.', ',')} m conservados</text>
      <text x="${cx + 44}" y="${40 + (P + E) * k - 40}" font-size="12" fill="#fff">vasija</text>
      <text x="${cx - D / 2 * k * 0.8}" y="${40 + (P + E) * k - 14}" font-size="11" fill="#fff">lajas</text>
    </svg>`;
  }
  function esquemaCortes() {
    const s = id => V.plano.estructuras.find(e => e.id === id);
    const L = [s('17'), s('18'), s('19')];
    const k = 55, ox = 180 - 13.0 * k, oy = 100 + 2.9 * k;
    const col = ['#b9a37f', '#8f7656', '#5c4630'];
    const c = L.map((e, i) => `<circle cx="${(ox + e.x * k).toFixed(0)}" cy="${(oy - e.y * k).toFixed(0)}" r="${(e.diametro / 2 * k).toFixed(0)}" fill="${col[i]}" stroke="#2d2117" stroke-width="2"/>`).join('');
    const t = L.map((e, i) => `<text x="${(ox + e.x * k).toFixed(0)}" y="${(oy - e.y * k + 5).toFixed(0)}" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">${e.id}</text>`).join('');
    return `<svg viewBox="0 0 360 200" role="img" aria-label="Planta de los silos 17, 18 y 19: el 18 corta al 17 y el 19 corta a los dos. El orden es 17, 18 y 19.">
      <rect width="360" height="200" fill="#c9a77d" rx="8"/>${c}${t}
      <text x="12" y="190" font-size="13" fill="#2d2117">Orden: 17 (más antiguo) → 18 → 19 (más reciente)</text></svg>`;
  }
  const EXTRAS = { 2: esquemaSilo, 3: esquemaCortes };

  V.construirInterfaz = function (ctx) {
    V.construirControles(ctx);
    V.construirPDI(ctx);

    // Altura real de la barra (puede ocupar una o dos filas) para colocar el panel debajo
    const medirBarra = () => document.documentElement.style.setProperty('--alto-barra', $('barra').getBoundingClientRect().bottom + 'px');
    window.addEventListener('resize', medirBarra); medirBarra();

    $('subtitulo').textContent = V.intro.subtitulo;
    $('intro-texto').textContent = V.intro.texto;

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
    try { nivelLectura = localStorage.getItem('valde-lectura') || 'basico'; } catch (e) { /* sin almacenamiento */ }
    const pestanas = { basico: $('t-basico'), ampliacion: $('t-ampliacion'), facil: $('t-facil') };
    function pintarTexto() {
      const f = V.fichas.find(x => x.n === actual);
      const txt = f[nivelLectura];
      const el = $('panel-texto');
      el.className = nivelLectura === 'facil' ? 'facil' : '';
      el.innerHTML = nivelLectura === 'facil'
        ? txt.split(/(?<=\.)\s+/).map(s => `<p>${esc(s)}</p>`).join('')
        : `<p>${esc(txt)}</p>`;
      for (const k in pestanas) pestanas[k].setAttribute('aria-selected', String(k === nivelLectura));
    }
    function abrir(n, volar) {
      const f = V.fichas.find(x => x.n === n);
      if (!f) return;
      actual = n;
      $('panel-num').textContent = `Punto de interés ${n} de ${V.fichas.length}`;
      $('panel-titulo').textContent = f.titulo;
      $('panel-nivel').innerHTML = f.nivel.map(l => `<span class="chip n${l}">${V.NOMBRE_NIVEL[l]}</span>`).join('') + `<span>${esc(f.nivelTexto)}</span>`;
      $('panel-fuente').textContent = 'Fuente: ' + f.fuente;
      $('panel-extra').innerHTML = EXTRAS[n] ? EXTRAS[n]() : '';
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
      nivelLectura = k; try { localStorage.setItem('valde-lectura', k); } catch (e) { /* nada */ }
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
      avisar(paseo ? 'Paseo a pie activado. Usa W A S D o las flechas para andar.' : 'Vista aérea.');
      if (paseo) cerrar();
    };
    $('b-evidencia').addEventListener('click', () => {
      const b = $('b-evidencia'), on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      $('leyenda').hidden = !on;
      ctx.capaEvidencia && ctx.capaEvidencia(on);
      avisar(on ? 'Capa de evidencia activada.' : 'Capa de evidencia desactivada.');
    });
    $('b-comparar').addEventListener('click', () => {
      const b = $('b-comparar'), on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      $('comparador').hidden = !on;
      ctx.activarComparacion && ctx.activarComparacion(on, +$('r-comparar').value);
      avisar(on ? 'Comparación activada: mueve el deslizador.' : 'Comparación desactivada.');
    });
    $('r-comparar').addEventListener('input', e => ctx.fijarComparacion && ctx.fijarComparacion(+e.target.value));
    $('b-mapa').addEventListener('click', () => $('d-mapa').showModal());
    $('b-ayuda').addEventListener('click', () => $('d-ayuda').showModal());

    // Calidad
    const cC = $('c-calidad');
    cC.checked = ctx.calidad === 'baja';
    cC.addEventListener('change', () => {
      try { localStorage.setItem('valde-calidad', cC.checked ? 'baja' : 'alta'); } catch (e) { /* nada */ }
      location.reload();
    });

    // Captura PNG: se dibuja y se lee el lienzo en el mismo instante
    $('b-captura').addEventListener('click', () => {
      if (ctx.renderizar) ctx.renderizar(); else ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.renderer.domElement.toBlob(b => {
        if (!b) return;
        const a = document.createElement('a');
        const h = String(Math.floor(ctx.horaActual)).padStart(2, '0') + String(Math.round((ctx.horaActual % 1) * 60)).padStart(2, '0');
        a.download = `valdecanas-${h}${actual ? '-punto' + actual : ''}.png`;
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
      else if (k === 'c') $('b-comparar').click();
      else if (k === 'm') $('b-mapa').click();
      else if (k === 'h') $('b-ayuda').click();
      else if (/^[0-9]$/.test(k)) abrir(k === '0' ? 10 : +k, true);
    });
  };
})(window.VALDE);
