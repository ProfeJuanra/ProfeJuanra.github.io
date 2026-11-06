// Fase f: capa de evidencia. Tiñe cada objeto con el color de su nivel (documentado, deducido, hipótesis).
(function (V) {
  'use strict';
  const BEIGE = new THREE.Color(0xd9cfbd);

  V.construirEvidencia = function (ctx) {
    const mats = {}, tenues = {};
    function matNivel(n, tenue) {
      const tabla = tenue ? tenues : mats;
      if (!tabla[n]) {
        const c = new THREE.Color(V.COLOR_NIVEL[n]);
        if (tenue) c.lerp(BEIGE, 0.55);
        tabla[n] = new THREE.MeshLambertMaterial({ color: c, flatShading: !tenue });
      }
      return tabla[n];
    }
    // Superficies muy grandes: color atenuado para que no dominen la vista
    const GRANDES = ['relieve-general', 'relieve-cercano', 'llanura-lejana'];

    // Cada malla toma el nivel del antepasado marcado más cercano
    function nivelDe(o) {
      while (o) { if (o.userData && o.userData.nivel) return { n: o.userData.nivel, raiz: o }; o = o.parent; }
      return null;
    }
    let lista = null;
    function recopilar() {
      lista = [];
      ctx.scene.traverse(o => {
        if (!o.isMesh || o.isSprite) return;
        if (o.material && o.material.colorWrite === false) return;   // máscaras de los silos
        if (o.name === 'sierras') return;                            // fondo: se deja igual
        const nv = nivelDe(o);
        if (!nv) return;
        lista.push({ o, n: nv.n, tenue: GRANDES.includes(nv.raiz.name) });
      });
    }

    ctx.capaEvidencia = function (on) {
      if (!lista) recopilar();
      for (const it of lista) {
        const o = it.o;
        if (on) {
          if (!o.userData.matOrig) o.userData.matOrig = o.material;
          o.material = matNivel(it.n, it.tenue);
          if (o.isInstancedMesh && o.instanceColor) { o.userData.colorInst = o.instanceColor; o.instanceColor = null; }
        } else if (o.userData.matOrig) {
          o.material = o.userData.matOrig;
          if (o.userData.colorInst) { o.instanceColor = o.userData.colorInst; o.userData.colorInst = null; }
        }
      }
      ctx.evidenciaActiva = on;
      ctx.pedirRender();
    };
  };
})(window.MOINA);
