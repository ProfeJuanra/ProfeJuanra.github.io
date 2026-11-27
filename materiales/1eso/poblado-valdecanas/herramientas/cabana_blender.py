"""
Modelo de la cabaña de Valdecañas hecho con Blender (sin ventanas):

    blender -b --factory-startup -P herramientas/cabana_blender.py -- assets/modelos/cabana.glb

Medidas de la estructura 30 (informe preliminar de 2008): planta elíptica de
10,56 × 2,59 m, suelo 0,30 m bajo el exterior. Paredes, postes, alturas y cubierta
son las mismas hipótesis que usa src/escena/cabanas.js.

Ejes de Blender: X = eje corto (hacia la puerta), Y = eje largo, Z = altura.
Origen: suelo exterior en el centro de la cabaña. Al exportar a glTF (+Y arriba),
Blender (x, y, z) pasa a three.js (x, z, -y).

La luz ambiental (oclusión) se «cocina» en los colores de vértice con Cycles:
el aleros oscurece la pared, el interior queda en penumbra, la base de los postes
se oscurece... y no cuesta nada al dibujar en los Chromebooks.
Las texturas (paja, barro, corteza) no van dentro del archivo: las pone la web.
"""
import bpy, bmesh, math, sys, random
from mathutils import Vector, noise

SALIDA = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/cabana.glb'
random.seed(30)

L, W = 10.56, 2.59                       # planta documentada
A, B = L / 2, W / 2
REBAJE = 0.30                            # suelo interior (documentado)
ALTO_PARED, ALTO_CAB, ALERO, PUERTA = 1.75, 1.6, 0.35, 0.9   # hipótesis (igual que en la web)
H_ALERO, H_CAB = ALTO_PARED, ALTO_PARED + ALTO_CAB
LR = L * 0.56                            # longitud del caballete
MEDIO = PUERTA / A / 2                   # semiángulo de la puerta (lado X positivo)

def contorno(th, m):
    a, b = A + m, B + m
    return Vector((b * math.sin(th), a * math.cos(th)))     # (across, along)

# ---------- escena limpia ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
esc = bpy.context.scene

def objeto(nombre, bm):
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nombre, me); esc.collection.objects.link(ob)
    return ob

# ---------- pared de ramas manteadas con barro ----------
def pared():
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap')
    N, NZ, G = 112, 7, 0.13           # divisiones y grosor
    z0, z1 = -REBAJE, H_ALERO + 0.05
    filas = []                          # [cara exterior, cara interior]
    for lado, m in (('ext', 0.1), ('int', 0.1 - G)):
        anillo = []
        for i in range(N + 1):
            th = i / N * 2 * math.pi
            col = []
            for j in range(NZ + 1):
                z = z0 + (z1 - z0) * j / NZ
                p = contorno(th, m)
                # irregularidad del manteado y leve panza hacia fuera a media altura
                r = 1 + 0.018 * noise.noise(Vector((p.x * 1.7, p.y * 1.7, z * 2.2))) + 0.006 * math.sin(math.pi * (z - z0) / (z1 - z0))
                col.append(bm.verts.new((p.x * r, p.y * r, z)))
            anillo.append(col)
        filas.append(anillo)
    ext, inn = filas
    largo = [0.0]
    for i in range(1, N + 1):
        largo.append(largo[-1] + (contorno(i / N * 2 * math.pi, 0.1) - contorno((i - 1) / N * 2 * math.pi, 0.1)).length)
    def hueco(i):
        thm = (i + 0.5) / N * 2 * math.pi
        return abs(thm - math.pi / 2) < MEDIO
    for i in range(N):
        if hueco(i): continue
        for j in range(NZ):
            for anillo, inv in ((ext, False), (inn, True)):
                vs = [anillo[i][j], anillo[i + 1][j], anillo[i + 1][j + 1], anillo[i][j + 1]]
                if inv: vs.reverse()
                f = bm.faces.new(vs)
                for lp in f.loops:
                    k = next(n for n in range(N + 1) if lp.vert in anillo[n])
                    jj = anillo[k].index(lp.vert)
                    lp[uv].uv = (largo[k] / 2, (jj / NZ) * (z1 - z0) / 1.2)
        # remate superior
        f = bm.faces.new([ext[i][NZ], ext[i + 1][NZ], inn[i + 1][NZ], inn[i][NZ]])
    # jambas de la puerta: cerrar los cantos
    for i in range(N):
        if hueco(i) and not hueco(i - 1):
            for j in range(NZ): bm.faces.new([ext[i][j], ext[i][j + 1], inn[i][j + 1], inn[i][j]])
        if hueco(i) and not hueco(i + 1):
            for j in range(NZ): bm.faces.new([inn[i + 1][j], inn[i + 1][j + 1], ext[i + 1][j + 1], ext[i + 1][j]])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return objeto('pared', bm)

# ---------- cubierta vegetal con grosor y alero deshilachado ----------
def techo():
    bm = bmesh.new(); uv = bm.loops.layers.uv.new('UVMap')
    N, NR, GROSOR = 112, 8, 0.28
    rejilla, largo = [], 0.0
    prev = None
    for i in range(N + 1):
        th = i / N * 2 * math.pi
        e = contorno(th, 0.1 + ALERO)
        al = max(-LR / 2, min(LR / 2, e.y / (A + 0.1 + ALERO) * LR / 2 * 1.15))
        k = Vector((0.0, al))
        if prev is not None: largo += (e - prev).length
        prev = e
        col = []
        for j in range(NR + 1):
            t = j / NR
            p = e.lerp(k, t)
            z = (H_ALERO - 0.12) + (H_CAB + 0.12 - (H_ALERO - 0.12)) * t
            z -= 0.10 * math.sin(math.pi * t)                       # ligera comba del entramado
            z += 0.04 * noise.noise(Vector((p.x * 2.5, p.y * 2.5, 3.1)))
            if j == 0:                                               # alero irregular: manojos más o menos largos
                z -= 0.06 + 0.07 * (noise.noise(Vector((p.x * 6, p.y * 6, 8.0))) + 1)
            col.append(bm.verts.new((p.x, p.y, z)))
        rejilla.append((col, largo))
    for i in range(N):
        (c0, l0), (c1, l1) = rejilla[i], rejilla[i + 1]
        for j in range(NR):
            f = bm.faces.new([c0[j], c1[j], c1[j + 1], c0[j + 1]])
            uvs = [(l0 / 2.5, j / NR), (l1 / 2.5, j / NR), (l1 / 2.5, (j + 1) / NR), (l0 / 2.5, (j + 1) / NR)]
            for lp, u in zip(f.loops, uvs): lp[uv].uv = u
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.002)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = objeto('techo', bm)
    for f in ob.data.polygons: f.use_smooth = True
    mod = ob.modifiers.new('grosor', 'SOLIDIFY'); mod.thickness = GROSOR; mod.offset = -1
    # cumbrera: rollo de paja sobre el caballete
    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.16, depth=LR + 0.5, end_fill_type='NOTHING', location=(0, 0, H_CAB + 0.06), rotation=(math.pi / 2, 0, 0))
    cum = bpy.context.active_object; cum.name = 'techo_cumbrera'; cum.scale = (1.35, 1, 0.55)
    bpy.ops.object.transform_apply(scale=True)
    # UV como el resto de la cubierta: la paja corre a lo largo del caballete
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cylinder_project(direction='ALIGN_TO_OBJECT', scale_to_bounds=False); bpy.ops.object.mode_set(mode='OBJECT')
    return ob, cum

# ---------- postes y vigas de madera ----------
def maderas():
    obs = []
    def palo(p0, p1, r, nombre):
        v = Vector(p1) - Vector(p0)
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=r, depth=v.length, location=(Vector(p0) + Vector(p1)) / 2)
        o = bpy.context.active_object; o.name = nombre
        o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(v.normalized())
        bm = bmesh.new(); bm.from_mesh(o.data)              # tronco algo irregular y más estrecho arriba
        for vt in bm.verts:
            t = (vt.co.z / v.length) + 0.5
            s = 1.0 - 0.18 * t + 0.08 * noise.noise(vt.co * 9)
            vt.co.x *= s; vt.co.y *= s
        bm.to_mesh(o.data); bm.free()
        obs.append(o)
    N = 56
    for i in range(0, N, 4):
        th = i / N * 2 * math.pi
        if abs(th - math.pi / 2) < MEDIO + 0.05: continue
        p = contorno(th, 0.16)
        inc = Vector((random.uniform(-.03, .03), random.uniform(-.03, .03), 0))
        palo((p.x, p.y, -REBAJE), (p.x + inc.x, p.y + inc.y, H_ALERO - 0.18), 0.075, 'poste')
    for al in (-LR / 2, 0, LR / 2):
        palo((0, al, -REBAJE), (0, al, H_CAB - 0.1), 0.095, 'poste')
    j1, j2 = contorno(math.pi / 2 - MEDIO, 0.12), contorno(math.pi / 2 + MEDIO, 0.12)
    for p in (j1, j2): palo((p.x, p.y, -REBAJE), (p.x, p.y, H_ALERO), 0.085, 'jamba')
    palo((j1.x, j1.y, H_ALERO), (j2.x, j2.y, H_ALERO), 0.075, 'dintel')
    palo((0, -LR / 2 - 0.1, H_CAB - 0.12), (0, LR / 2 + 0.1, H_CAB - 0.12), 0.09, 'caballete')   # bajo la cubierta
    return obs

# ---------- suelo para que la oclusión tenga dónde apoyarse (no se exporta) ----------
def suelo():
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=2, y_segments=2, size=14)
    ob = objeto('suelo_aux', bm)
    bm2 = bmesh.new()
    bmesh.ops.create_circle(bm2, cap_ends=True, segments=48, radius=1)
    for v in bm2.verts: v.co.x *= B + 0.1; v.co.y *= A + 0.1; v.co.z = -REBAJE + 0.001
    fondo = objeto('fondo_aux', bm2)
    return [ob, fondo]

p = pared(); t, cum = techo(); mad = maderas(); aux = suelo()

# Unir las maderas y la cumbrera en un objeto por material
def unir(lista, nombre):
    bpy.ops.object.select_all(action='DESELECT')
    for o in lista: o.select_set(True)
    bpy.context.view_layer.objects.active = lista[0]
    bpy.ops.object.join(); lista[0].name = nombre; return lista[0]
madera = unir(mad, 'madera')
bpy.ops.object.select_all(action='DESELECT'); t.select_set(True); bpy.context.view_layer.objects.active = t
bpy.ops.object.modifier_apply(modifier='grosor')
cum.select_set(True); bpy.ops.object.join(); t.name = 'techo'
# Más detalle en la pared y la madera para que la oclusión se vea suave
for o in (madera,):
    m = o.modifiers.new('sub', 'SUBSURF'); m.levels = 1; m.subdivision_type = 'SIMPLE'
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier='sub')

# UV de la madera a lo largo de cada palo (cilíndrica sencilla)
bpy.ops.object.select_all(action='DESELECT'); madera.select_set(True); bpy.context.view_layer.objects.active = madera
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.cylinder_project(scale_to_bounds=False); bpy.ops.object.mode_set(mode='OBJECT')

# ---------- materiales (solo nombres; la web pone las texturas) ----------
for o, n in ((p, 'pared'), (t, 'techo'), (madera, 'madera')):
    mat = bpy.data.materials.new(n); o.data.materials.clear(); o.data.materials.append(mat)
    mat.diffuse_color = (0.8, 0.8, 0.8, 1)

# ---------- cocinar la oclusión ambiental en colores de vértice ----------
esc.render.engine = 'CYCLES'
esc.cycles.device = 'CPU'; esc.cycles.samples = 96
mundo = bpy.data.worlds.new('mundo'); esc.world = mundo
mundo.light_settings.distance = 2.2
for o in (p, t, madera):
    ca = o.data.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
    o.data.color_attributes.active_color = ca
    o.data.attributes.default_color_name = 'Col'
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    esc.render.bake.target = 'VERTEX_COLORS'
    bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
    # suavizar contraste: 0,35 en la sombra más fuerte → 1 al aire libre
    for c in ca.data:
        v = c.color[0]; v = 0.35 + 0.65 * v
        c.color = (v, v, v, 1)
    print('cocinado', o.name, len(o.data.vertices), 'vértices')

for o in aux: bpy.data.objects.remove(o, do_unlink=True)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=SALIDA, export_format='GLB', use_selection=True,
    export_yup=True, export_apply=True, export_colors=True, export_normals=True,
    export_texcoords=True, export_materials='EXPORT', export_image_format='NONE')
print('GUARDADO', SALIDA)
