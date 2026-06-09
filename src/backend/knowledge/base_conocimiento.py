# =============================================================================
# BASE DE CONOCIMIENTO - Sistema Experto de Cotizacion de Carpinteria
# =============================================================================
# Dominio: Cotizacion de muebles y trabajos de carpinteria
# Fuente del conocimiento: Experiencia de carpintero profesional
# Autor: Munoz - Girata
# =============================================================================
# Cobertura de reglas:
#   Categoria A : 24 reglas base (6 tipos x 4 materiales)
#   Categoria B : 8 reglas de ajuste por acabado
#   Categoria C : 5 reglas de recargo por complejidad
#   Categoria D : 3 reglas de condiciones de entrega
#   TOTAL       : 40 reglas
# =============================================================================

PREDICADOS = {
    'es_puerta':          'El trabajo solicitado es una puerta (se mide por m2)',
    'es_closet':          'El trabajo solicitado es un closet o armario',
    'es_cocina':          'El trabajo solicitado es mueble de cocina (alacena/gabinetes)',
    'es_cama':            'El trabajo solicitado es una cama o cabecera',
    'es_mesa':            'El trabajo solicitado es una mesa o escritorio',
    'es_estante':         'El trabajo solicitado es un estante, repisa o biblioteca',
    'material_mdf':       'El material principal es MDF (economico, liso, pintable)',
    'material_triplex':   'El material principal es triplex/contrachapado',
    'material_solida':    'El material principal es madera solida (cedro, roble, etc.)',
    'material_pino':      'El material principal es madera de pino (semieconomico)',
    'acabado_natural':    'Sin acabado especial, madera en bruto o sellador basico',
    'acabado_lacado':     'Acabado con laca (brillante o mate, mayor costo)',
    'acabado_barniz':     'Acabado con barniz (resalta veta de madera solida)',
    'acabado_pintado':    'Acabado pintado con esmalte o vinilo',
    'tiene_cajones':      'El mueble incluye cajones con correderas',
    'tiene_vidrio':       'El mueble incluye puertas o paneles de vidrio',
    'tiene_espejo':       'El mueble incluye espejo',
    'es_empotrado':       'El mueble va empotrado o requiere ajuste a medida especial',
    'puertas_corredizas': 'Las puertas son corredizas (riel superior e inferior)',
    'es_urgente':             'El trabajo tiene urgencia (menos de 7 dias)',
    'requiere_instalacion':   'El carpintero debe instalar el mueble en sitio',
    'fuera_de_ciudad':        'La instalacion es fuera de la ciudad del taller',
    'precio_muy_bajo':    'Cotizacion en rango muy bajo (< $300.000)',
    'precio_bajo':        'Cotizacion en rango bajo ($300.000 - $600.000)',
    'precio_medio':       'Cotizacion en rango medio ($600.000 - $900.000)',
    'precio_alto':        'Cotizacion en rango alto ($900.000 - $1.500.000)',
    'precio_muy_alto':    'Cotizacion en rango muy alto (> $1.500.000)',
    'advertencia_vidrio':   'Costo adicional por vidrio (proveedor externo)',
    'recargo_urgencia':     'Recargo del 20% por urgencia',
    'recargo_instalacion':  'Costo adicional por instalacion y transporte',
}

# RANGOS BASE DE PRECIO (en pesos colombianos COP)
PRECIOS_BASE = {
    'puerta_mdf':      {'min': 120000,  'max': 280000,  'unidad': 'm2'},
    'puerta_triplex':  {'min': 100000,  'max': 250000,  'unidad': 'm2'},
    'puerta_pino':     {'min': 150000,  'max': 320000,  'unidad': 'm2'},
    'puerta_solida':   {'min': 280000,  'max': 550000,  'unidad': 'm2'},
    'closet_mdf':      {'min': 300000,  'max': 580000,  'unidad': 'unidad'},
    'closet_triplex':  {'min': 260000,  'max': 520000,  'unidad': 'unidad'},
    'closet_pino':     {'min': 280000,  'max': 550000,  'unidad': 'unidad'},
    'closet_solida':   {'min': 700000,  'max': 1400000, 'unidad': 'unidad'},
    'cocina_mdf':      {'min': 500000,  'max': 900000,  'unidad': 'unidad'},
    'cocina_triplex':  {'min': 420000,  'max': 800000,  'unidad': 'unidad'},
    'cocina_pino':     {'min': 460000,  'max': 850000,  'unidad': 'unidad'},
    'cocina_solida':   {'min': 1000000, 'max': 2000000, 'unidad': 'unidad'},
    'cama_mdf':        {'min': 250000,  'max': 500000,  'unidad': 'unidad'},
    'cama_triplex':    {'min': 220000,  'max': 450000,  'unidad': 'unidad'},
    'cama_pino':       {'min': 270000,  'max': 520000,  'unidad': 'unidad'},
    'cama_solida':     {'min': 550000,  'max': 1100000, 'unidad': 'unidad'},
    'mesa_mdf':        {'min': 180000,  'max': 380000,  'unidad': 'unidad'},
    'mesa_triplex':    {'min': 150000,  'max': 320000,  'unidad': 'unidad'},
    'mesa_pino':       {'min': 170000,  'max': 350000,  'unidad': 'unidad'},
    'mesa_solida':     {'min': 380000,  'max': 750000,  'unidad': 'unidad'},
    'estante_mdf':     {'min': 80000,   'max': 220000,  'unidad': 'unidad'},
    'estante_triplex': {'min': 70000,   'max': 200000,  'unidad': 'unidad'},
    'estante_pino':    {'min': 90000,   'max': 240000,  'unidad': 'unidad'},
    'estante_solida':  {'min': 220000,  'max': 480000,  'unidad': 'unidad'},
}

REGLAS = [
    # CATEGORIA A: PUERTAS
    {'id':'A01','nombre':'Puerta en MDF','descripcion':'Puerta en MDF es la opcion mas economica','condiciones':[('es_puerta',True),('material_mdf',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.95,'explicacion':'Puerta en MDF → precio muy bajo (< $300.000 por m2)'},
    {'id':'A02','nombre':'Puerta en triplex','descripcion':'Puerta en triplex es economica y resistente a la humedad','condiciones':[('es_puerta',True),('material_triplex',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.93,'explicacion':'Puerta en triplex → precio muy bajo (< $300.000 por m2)'},
    {'id':'A03','nombre':'Puerta en pino','descripcion':'Puerta en pino tiene mejor acabado natural','condiciones':[('es_puerta',True),('material_pino',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Puerta en pino → precio bajo ($300.000–$600.000 por m2)'},
    {'id':'A04','nombre':'Puerta en madera solida','descripcion':'Puerta en madera solida es trabajo premium','condiciones':[('es_puerta',True),('material_solida',True)],'conclusion':('precio_medio',True),'certeza':0.92,'explicacion':'Puerta en madera solida → precio medio ($600.000–$900.000)'},

    # CATEGORIA A: CLOSETS
    {'id':'A05','nombre':'Closet en MDF','descripcion':'Closet en MDF es la opcion mas solicitada','condiciones':[('es_closet',True),('material_mdf',True)],'conclusion':('precio_bajo',True),'certeza':0.92,'explicacion':'Closet en MDF → precio bajo ($300.000–$600.000)'},
    {'id':'A06','nombre':'Closet en triplex','descripcion':'Closet en triplex es economico en modulos grandes','condiciones':[('es_closet',True),('material_triplex',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Closet en triplex → precio bajo ($300.000–$600.000)'},
    {'id':'A07','nombre':'Closet en pino','descripcion':'Closet en pino tiene mejor apariencia natural','condiciones':[('es_closet',True),('material_pino',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Closet en pino → precio bajo ($300.000–$600.000)'},
    {'id':'A08','nombre':'Closet en madera solida','descripcion':'Closet en madera solida es de alta durabilidad','condiciones':[('es_closet',True),('material_solida',True)],'conclusion':('precio_alto',True),'certeza':0.93,'explicacion':'Closet en madera solida → precio alto ($900.000–$1.500.000)'},

    # CATEGORIA A: COCINAS
    {'id':'A09','nombre':'Cocina en MDF','descripcion':'Cocina en MDF es la mas demandada','condiciones':[('es_cocina',True),('material_mdf',True)],'conclusion':('precio_medio',True),'certeza':0.92,'explicacion':'Cocina en MDF → precio medio ($600.000–$900.000)'},
    {'id':'A10','nombre':'Cocina en triplex','descripcion':'Cocina en triplex es buena para zonas con humedad','condiciones':[('es_cocina',True),('material_triplex',True)],'conclusion':('precio_bajo',True),'certeza':0.89,'explicacion':'Cocina en triplex → precio bajo ($300.000–$600.000)'},
    {'id':'A11','nombre':'Cocina en pino','descripcion':'Cocina en pino tiene apariencia rustica','condiciones':[('es_cocina',True),('material_pino',True)],'conclusion':('precio_medio',True),'certeza':0.88,'explicacion':'Cocina en pino → precio medio ($600.000–$900.000)'},
    {'id':'A12','nombre':'Cocina en madera solida','descripcion':'Cocina en madera solida es proyecto premium','condiciones':[('es_cocina',True),('material_solida',True)],'conclusion':('precio_muy_alto',True),'certeza':0.94,'explicacion':'Cocina en madera solida → precio muy alto (> $1.500.000)'},

    # CATEGORIA A: CAMAS
    {'id':'A13','nombre':'Cama en MDF','descripcion':'Cama en MDF es la opcion mas economica','condiciones':[('es_cama',True),('material_mdf',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Cama en MDF → precio bajo ($300.000–$600.000)'},
    {'id':'A14','nombre':'Cama en triplex','descripcion':'Cama en triplex es resistente y economica','condiciones':[('es_cama',True),('material_triplex',True)],'conclusion':('precio_bajo',True),'certeza':0.88,'explicacion':'Cama en triplex → precio bajo ($300.000–$600.000)'},
    {'id':'A15','nombre':'Cama en pino','descripcion':'Cama en pino tiene buena resistencia','condiciones':[('es_cama',True),('material_pino',True)],'conclusion':('precio_bajo',True),'certeza':0.89,'explicacion':'Cama en pino → precio bajo ($300.000–$600.000)'},
    {'id':'A16','nombre':'Cama en madera solida','descripcion':'Cama en madera solida es duradera y costosa','condiciones':[('es_cama',True),('material_solida',True)],'conclusion':('precio_alto',True),'certeza':0.91,'explicacion':'Cama en madera solida → precio alto ($900.000–$1.500.000)'},

    # CATEGORIA A: MESAS
    {'id':'A17','nombre':'Mesa en MDF','descripcion':'Mesa en MDF es la opcion mas rapida y economica','condiciones':[('es_mesa',True),('material_mdf',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Mesa en MDF → precio bajo ($300.000–$600.000)'},
    {'id':'A18','nombre':'Mesa en triplex','descripcion':'Mesa en triplex es economica y resistente','condiciones':[('es_mesa',True),('material_triplex',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.88,'explicacion':'Mesa en triplex → precio muy bajo (< $300.000)'},
    {'id':'A19','nombre':'Mesa en pino','descripcion':'Mesa en pino tiene buena apariencia','condiciones':[('es_mesa',True),('material_pino',True)],'conclusion':('precio_bajo',True),'certeza':0.89,'explicacion':'Mesa en pino → precio bajo ($300.000–$600.000)'},
    {'id':'A20','nombre':'Mesa en madera solida','descripcion':'Mesa en madera solida es duradera','condiciones':[('es_mesa',True),('material_solida',True)],'conclusion':('precio_medio',True),'certeza':0.90,'explicacion':'Mesa en madera solida → precio medio ($600.000–$900.000)'},

    # CATEGORIA A: ESTANTES
    {'id':'A21','nombre':'Estante en MDF','descripcion':'Estante en MDF es el trabajo mas sencillo','condiciones':[('es_estante',True),('material_mdf',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.95,'explicacion':'Estante en MDF → precio muy bajo (< $300.000)'},
    {'id':'A22','nombre':'Estante en triplex','descripcion':'Estante en triplex es bueno para carga pesada','condiciones':[('es_estante',True),('material_triplex',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.93,'explicacion':'Estante en triplex → precio muy bajo (< $300.000)'},
    {'id':'A23','nombre':'Estante en pino','descripcion':'Estante en pino tiene mejor apariencia','condiciones':[('es_estante',True),('material_pino',True)],'conclusion':('precio_muy_bajo',True),'certeza':0.91,'explicacion':'Estante en pino → precio muy bajo (< $300.000)'},
    {'id':'A24','nombre':'Estante en madera solida','descripcion':'Estante en madera solida es duradero','condiciones':[('es_estante',True),('material_solida',True)],'conclusion':('precio_bajo',True),'certeza':0.90,'explicacion':'Estante en madera solida → precio bajo ($300.000–$600.000)'},

    # CATEGORIA B: ACABADOS
    {'id':'B01','nombre':'Acabado pintado sobre precio muy bajo','descripcion':'El pintado requiere lija, imprimante y pintura','condiciones':[('acabado_pintado',True),('precio_muy_bajo',True)],'conclusion':('precio_bajo',True),'certeza':0.87,'explicacion':'Acabado pintado → escala precio muy bajo a precio bajo'},
    {'id':'B02','nombre':'Acabado lacado sobre precio muy bajo','descripcion':'El lacado requiere fondos especiales','condiciones':[('acabado_lacado',True),('precio_muy_bajo',True)],'conclusion':('precio_bajo',True),'certeza':0.88,'explicacion':'Acabado lacado → escala precio muy bajo a precio bajo'},
    {'id':'B03','nombre':'Acabado lacado sobre precio bajo','descripcion':'El lacado eleva significativamente el costo','condiciones':[('acabado_lacado',True),('precio_bajo',True)],'conclusion':('precio_medio',True),'certeza':0.88,'explicacion':'Acabado lacado → escala precio bajo a precio medio'},
    {'id':'B04','nombre':'Acabado lacado sobre precio medio','descripcion':'Lacado en trabajo medio lleva al rango alto','condiciones':[('acabado_lacado',True),('precio_medio',True)],'conclusion':('precio_alto',True),'certeza':0.85,'explicacion':'Acabado lacado → escala precio medio a precio alto'},
    {'id':'B05','nombre':'Acabado barniz sobre precio muy bajo','descripcion':'El barniz requiere varias capas','condiciones':[('acabado_barniz',True),('precio_muy_bajo',True)],'conclusion':('precio_bajo',True),'certeza':0.86,'explicacion':'Acabado barniz → escala precio muy bajo a precio bajo'},
    {'id':'B06','nombre':'Acabado barniz sobre precio bajo','descripcion':'El barniz sobre trabajo economico sube a medio','condiciones':[('acabado_barniz',True),('precio_bajo',True)],'conclusion':('precio_medio',True),'certeza':0.86,'explicacion':'Acabado barniz → escala precio bajo a precio medio'},
    {'id':'B07','nombre':'Acabado barniz sobre madera solida','descripcion':'Barniz en madera solida es el acabado mas costoso','condiciones':[('acabado_barniz',True),('material_solida',True)],'conclusion':('precio_alto',True),'certeza':0.90,'explicacion':'Barniz en madera solida → precio alto ($900.000–$1.500.000)'},
    {'id':'B08','nombre':'Acabado pintado sobre precio bajo','descripcion':'Pintado sobre trabajo economico sube moderadamente','condiciones':[('acabado_pintado',True),('precio_bajo',True)],'conclusion':('precio_medio',True),'certeza':0.84,'explicacion':'Acabado pintado → escala precio bajo a precio medio'},

    # CATEGORIA C: COMPLEJIDAD
    {'id':'C01','nombre':'Recargo por cajones en trabajo economico','descripcion':'Los cajones requieren correderas metalicas','condiciones':[('tiene_cajones',True),('precio_bajo',True)],'conclusion':('precio_medio',True),'certeza':0.90,'explicacion':'Cajones con correderas → escala precio bajo a precio medio'},
    {'id':'C02','nombre':'Recargo por cajones en trabajo muy economico','descripcion':'Cajones sobre trabajo basico sube a rango bajo','condiciones':[('tiene_cajones',True),('precio_muy_bajo',True)],'conclusion':('precio_bajo',True),'certeza':0.89,'explicacion':'Cajones → escala precio muy bajo a precio bajo'},
    {'id':'C03','nombre':'Recargo por puertas corredizas','descripcion':'Las puertas corredizas requieren riel y guias','condiciones':[('puertas_corredizas',True),('precio_bajo',True)],'conclusion':('precio_medio',True),'certeza':0.89,'explicacion':'Puertas corredizas → escala precio bajo a precio medio'},
    {'id':'C04','nombre':'Recargo por puertas corredizas en precio medio','descripcion':'Puertas corredizas en medio llevan a alto','condiciones':[('puertas_corredizas',True),('precio_medio',True)],'conclusion':('precio_alto',True),'certeza':0.88,'explicacion':'Puertas corredizas → escala precio medio a precio alto'},
    {'id':'C05','nombre':'Advertencia por vidrio','descripcion':'El vidrio implica proveedor externo y herrajes especiales','condiciones':[('tiene_vidrio',True)],'conclusion':('advertencia_vidrio',True),'certeza':1.0,'explicacion':'Vidrio en el mueble → costo adicional $60.000–$200.000 segun dimension'},

    # CATEGORIA D: ENTREGA
    {'id':'D01','nombre':'Recargo por urgencia','descripcion':'Trabajo urgente implica horas extra','condiciones':[('es_urgente',True)],'conclusion':('recargo_urgencia',True),'certeza':1.0,'explicacion':'Trabajo urgente → recargo del 20% sobre el precio final'},
    {'id':'D02','nombre':'Recargo por instalacion en sitio','descripcion':'La instalacion genera costo adicional fijo','condiciones':[('requiere_instalacion',True)],'conclusion':('recargo_instalacion',True),'certeza':1.0,'explicacion':'Instalacion en sitio → costo adicional $80.000 local, $180.000 fuera de ciudad'},
    {'id':'D03','nombre':'Recargo adicional por instalacion fuera de ciudad','descripcion':'Fuera de ciudad suma transporte y posible hospedaje','condiciones':[('fuera_de_ciudad',True),('requiere_instalacion',True)],'conclusion':('precio_alto',True),'certeza':0.85,'explicacion':'Instalacion fuera de ciudad → recargo alto adicional al precio base'},
]

ETIQUETAS = {
    'es_puerta':            'Puerta',
    'es_closet':            'Closet / Armario',
    'es_cocina':            'Mueble de cocina',
    'es_cama':              'Cama / Cabecera',
    'es_mesa':              'Mesa / Escritorio',
    'es_estante':           'Estante / Repisa',
    'material_mdf':         'MDF',
    'material_triplex':     'Triplex / Contrachapado',
    'material_solida':      'Madera solida (cedro, roble)',
    'material_pino':        'Pino',
    'acabado_natural':      'Sin acabado / Natural',
    'acabado_lacado':       'Lacado (brillante o mate)',
    'acabado_barniz':       'Barnizado',
    'acabado_pintado':      'Pintado',
    'tiene_cajones':        'Incluye cajones',
    'tiene_vidrio':         'Incluye vidrio',
    'tiene_espejo':         'Incluye espejo',
    'es_empotrado':         'Va empotrado / medida exacta',
    'puertas_corredizas':   'Puertas corredizas',
    'es_urgente':           'Urgente (menos de 7 dias)',
    'requiere_instalacion': 'Requiere instalacion en sitio',
    'fuera_de_ciudad':      'Instalacion fuera de ciudad',
}

# RANGOS DE PRECIO PARA LA INTERFAZ (en pesos colombianos COP)
RANGOS_PRECIO = {
    'precio_muy_bajo': {'label': 'Muy economico', 'rango': '< $300.000',               'color': '#27ae60'},
    'precio_bajo':     {'label': 'Economico',      'rango': '$300.000 - $600.000',      'color': '#2ecc71'},
    'precio_medio':    {'label': 'Precio medio',   'rango': '$600.000 - $900.000',      'color': '#f39c12'},
    'precio_alto':     {'label': 'Precio alto',    'rango': '$900.000 - $1.500.000',    'color': '#e67e22'},
    'precio_muy_alto': {'label': 'Premium',        'rango': '> $1.500.000',             'color': '#e74c3c'},
}