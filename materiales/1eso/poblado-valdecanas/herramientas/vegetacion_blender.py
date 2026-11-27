"""
Vegetación de Valdecañas hecha con Blender (sin ventanas):

    blender -b --factory-startup -P herramientas/vegetacion_blender.py -- assets/modelos/vegetacion.glb

Especies deducidas por paralelos regionales (igual que src/escena/vegetacion.js):
encina, alcornoque, árboles de ribera, matorral de jara y retama, y matas de hierba.
Medidas de cada árbol a escala 1 (la web las escala por instancia).

Cada especie da dos objetos (tronco y copa). La copa es un conjunto de «matas» de hojas
deformadas con ruido. La luz ambiental (oclusión) se cocina en los colores de vértice
en gris: la web multiplica ese gris por el verde de cada árbol.
Ejes de Blender: Z arriba; al exportar a glTF pasa a Y arriba.
"""
import bpy, bmesh, math, sys, random
from mathutils import Vector, noise, Matrix

SALIDA = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/vegetacion.glb'
random.seed(2008)
bpy.ops.wm.read_factory_settings(use_empty=True)
esc = bpy.context.scene

def nuevo(nombre, bm):
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nombre, me); esc.collection.objects.link(ob)
    return ob

def rama(bm, p0, p1, r0, r1, lados=6):
    """Cilindro troncocónico entre dos puntos, añadido a un bmesh."""
    eje = (p1 - p0); largo = eje.length
    rot = Vector((0, 0, 1)).rotation_difference(eje.normalized()).to_matrix().to_4x4()
    anillos = []
    for k, (t, r) in enumerate(((0, r0), (0.5, (r0 + r1) / 2 * 1.04), (1, r1))):
        anillo = []
        for i in range(lados):
            a = i / lados * 2 * math.pi
            v = Vector((math.cos(a) * r, math.sin(a) * r, t * largo))
            v = rot @ v + p0
            v += Vector((noise.noise(v * 3), noise.noise(v * 3 + Vector((5, 1, 2))), 0)) * r * 0.25
            anillo.append(bm.verts.new(v))
        anillos.append(anillo)
    for a, b in zip(anillos, anillos[1:]):
        for i in range(lados):
            bm.faces.new([a[i], a[(i + 1) % lados], b[(i + 1) % lados], b[i]])

def mata(bm, centro, radio, semilla, achatar=0.85):
    """Mata de hojas: icosfera deformada con ruido (silueta irregular)."""
    tmp = bmesh.new()
    bmesh.ops.create_icosphere(tmp, subdivisions=1, radius=1)
    mapa = {}
    for v in tmp.verts:
        d = v.co.normalized()
        k = 1 + 0.28 * noise.noise(d * 2.3 + Vector((semilla, 0, 0))) + 0.1 * noise.noise(d * 6 + Vector((0, semilla, 0)))
        mapa[v] = bm.verts.new(centro + Vector((d.x * radio * k, d.y * radio * k, d.z * radio * k * achatar)))
    for f in tmp.faces:
        bm.faces.new([mapa[v] for v in f.verts])
    tmp.free()

def arbol(nombre, alto_tronco, r_tronco, copa, n_matas, ramas, achatar=0.85, cuello=0.55):
    """copa = (semieje horizontal, semieje vertical); centro de la copa a alto_tronco + cuello*semieje."""
    rx, rz = copa
    cz = alto_tronco + cuello * rz
    bt = bmesh.new()
    rama(bt, Vector((0, 0, -0.15)), Vector((0, 0, alto_tronco + 0.3)), r_tronco, r_tronco * 0.7, 7)
    puntas = []
    for i in range(ramas):
        a = i / ramas * 2 * math.pi + random.uniform(-.3, .3)
        fin = Vector((math.cos(a) * rx * 0.55, math.sin(a) * rx * 0.55, cz + random.uniform(-.2, .4) * rz))
        rama(bt, Vector((0, 0, alto_tronco * random.uniform(.8, 1.0))), fin, r_tronco * 0.55, r_tronco * 0.18, 5)
        puntas.append(fin)
    tronco = nuevo(nombre + '_tronco', bt)
    bc = bmesh.new()
    for i in range(n_matas):
        # repartidas en la envolvente de la copa, más densas arriba y en el borde
        u = random.random() * 2 * math.pi; v = math.acos(random.uniform(-0.55, 1))
        rr = random.uniform(0.55, 0.9)
        c = Vector((math.cos(u) * math.sin(v) * rx * rr, math.sin(u) * math.sin(v) * rx * rr, cz + math.cos(v) * rz * rr))
        mata(bc, c, random.uniform(0.32, 0.5) * rx, i * 1.7, achatar)
    for p in puntas: mata(bc, p, 0.45 * rx, 9.1, achatar)
    copa_ob = nuevo(nombre + '_copa', bc)
    for f in copa_ob.data.polygons: f.use_smooth = True
    return tronco, copa_ob

# ---------- especies ----------
objetos = []
objetos += arbol('encina', 1.8, 0.28, (3.2, 2.4), 16, 4)
objetos += arbol('alcornoque', 2.2, 0.33, (3.6, 2.6), 17, 4)
objetos += arbol('ribera', 3.6, 0.25, (2.4, 4.2), 15, 3, achatar=1.15, cuello=0.6)

# Matorral (jara y retama): varias matas pequeñas a ras de suelo
bm = bmesh.new()
for i in range(7):
    a = i / 7 * 2 * math.pi
    mata(bm, Vector((math.cos(a) * 0.45, math.sin(a) * 0.45, 0.25 + random.uniform(0, .2))), random.uniform(.35, .5), i * 3.3, 0.7)
mata(bm, Vector((0, 0, 0.5)), 0.55, 21, 0.75)
mato = nuevo('matorral', bm); [setattr(f, 'use_smooth', True) for f in mato.data.polygons]
objetos.append(mato)

# Mata de hierba: muchas hojas finas de un solo triángulo, cortas y algo inclinadas
bm = bmesh.new()
for i in range(16):
    a = random.uniform(0, 2 * math.pi); h = random.uniform(0.07, 0.19); inc = random.uniform(0.03, 0.09)
    d = Vector((math.cos(a), math.sin(a), 0)); lado = Vector((-d.y, d.x, 0)) * 0.009
    base = d * random.uniform(0, .07)
    vs = [bm.verts.new(base - lado), bm.verts.new(base + lado), bm.verts.new(base + d * inc + Vector((0, 0, h)))]
    bm.faces.new(vs)
hierba = nuevo('hierba', bm)
objetos.append(hierba)

# Suelo auxiliar para la oclusión (no se exporta)
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=12)
suelo = nuevo('suelo_aux', bm)

# ---------- materiales con nombre (la web pone el color) ----------
for o in objetos:
    tipo = 'corteza' if o.name.endswith('_tronco') else ('hierba' if o.name == 'hierba' else 'hojas')
    m = bpy.data.materials.get(tipo) or bpy.data.materials.new(tipo)
    o.data.materials.append(m)

# ---------- cocinar oclusión en colores de vértice ----------
esc.render.engine = 'CYCLES'; esc.cycles.device = 'CPU'; esc.cycles.samples = 64
mundo = bpy.data.worlds.new('mundo'); esc.world = mundo; mundo.light_settings.distance = 1.6
def cocinar(o, minimo):
    ca = o.data.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
    o.data.color_attributes.active_color = ca
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    esc.render.bake.target = 'VERTEX_COLORS'
    bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
    return ca
for o in objetos:
    if o.name == 'hierba':
        # degradado sencillo: base oscura, punta clara
        ca = o.data.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
        for poly in o.data.polygons:
            for li in poly.loop_indices:
                z = o.data.vertices[o.data.loops[li].vertex_index].co.z
                v = 0.6 + 0.4 * min(1, z / 0.18); ca.data[li].color = (v, v, v, 1)
        continue
    ca = cocinar(o, 0.3)
    for i, c in enumerate(ca.data):
        v = 0.3 + 0.7 * c.color[0]
        if o.name.endswith('_copa'):                 # algo de variación en el verde (mismo gris)
            vi = o.data.loops[i].vertex_index; p = o.data.vertices[vi].co
            v *= 0.9 + 0.12 * noise.noise(p * 1.3)
        c.color = (v, v, v, 1)
    print('cocinado', o.name, len(o.data.vertices))

bpy.data.objects.remove(suelo, do_unlink=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=SALIDA, export_format='GLB', use_selection=True, export_yup=True,
    export_apply=True, export_colors=True, export_normals=True, export_texcoords=False,
    export_materials='EXPORT', export_image_format='NONE')
print('GUARDADO', SALIDA)
