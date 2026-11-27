"""
Cocina la oclusión ambiental del cuerpo base (MakeHuman, CC0) con Blender y la guarda
como un número por vértice en src/datos/cuerpo-ao.js:

    blender -b --factory-startup -P herramientas/cuerpo_ao_blender.py -- src/datos/cuerpo.js src/datos/cuerpo-ao.js

La web multiplica estos valores por los colores de piel y ropa: axilas, cuello,
entrepierna y pliegues quedan algo más oscuros y el cuerpo deja de parecer de plástico.
"""
import bpy, bmesh, json, sys
ent, sal = sys.argv[sys.argv.index('--') + 1:][:2]
txt = open(ent, encoding='utf-8').read()
k = txt.index('VALDE.cuerpo ='); C = json.loads(txt[txt.index('{', k): txt.rindex('}') + 1])
P, I = C['pos'], C['idx']
n = len(P) // 3

bpy.ops.wm.read_factory_settings(use_empty=True)
esc = bpy.context.scene
me = bpy.data.meshes.new('cuerpo')
# three.js usa Y arriba: se pasa a Z arriba para Blender (da igual para la oclusión)
me.from_pydata([(P[i * 3], -P[i * 3 + 2], P[i * 3 + 1]) for i in range(n)], [], [tuple(I[k:k + 3]) for k in range(0, len(I), 3)])
me.update()
ob = bpy.data.objects.new('cuerpo', me); esc.collection.objects.link(ob)
for f in me.polygons: f.use_smooth = True
ca = me.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER'); me.color_attributes.active_color = ca
esc.render.engine = 'CYCLES'; esc.cycles.device = 'CPU'; esc.cycles.samples = 128
w = bpy.data.worlds.new('m'); esc.world = w; w.light_settings.distance = 0.25
bpy.context.view_layer.objects.active = ob; ob.select_set(True)
esc.render.bake.target = 'VERTEX_COLORS'
bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
suma, cuenta = [0.0] * n, [0] * n
for li, lp in enumerate(me.loops):
    suma[lp.vertex_index] += ca.data[li].color[0]; cuenta[lp.vertex_index] += 1
ao = [round(0.5 + 0.5 * (suma[i] / cuenta[i] if cuenta[i] else 1), 2) for i in range(n)]
with open(sal, 'w', encoding='utf-8') as f:
    f.write('// Oclusión ambiental del cuerpo base, cocinada con Blender (herramientas/cuerpo_ao_blender.py).\n')
    f.write('// Un valor por vértice (0,5 = rincón en sombra; 1 = al aire libre).\n')
    f.write('window.VALDE = window.VALDE || {};\nVALDE.cuerpoAO = ' + json.dumps(ao, separators=(',', ':')) + ';\n')
print('GUARDADO', sal, n, min(ao), max(ao))
