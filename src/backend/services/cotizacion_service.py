# =============================================================================
# services/cotizacion_service.py - Logica de negocio
# =============================================================================

import sys, os, math, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from knowledge.base_conocimiento import RANGOS_PRECIO, PRECIOS_BASE
from knowledge.motor_inferencia  import encadenamiento_adelante, generar_resumen
from config import (
    TIEMPOS_ENTREGA, MULTIPLICADOR_TIEMPO_MATERIAL,
    ADVERTENCIAS_COMBINACION, EXTRAS_NO_APLICAN,
    RANGOS_NUMERICOS, PORCENTAJES_DESGLOSE,
    RECARGO_URGENCIA, RECARGO_INSTALACION_LOCAL,
    RECARGO_INSTALACION_CIUDAD, COSTO_VIDRIO_MIN,
    COSTO_VIDRIO_MAX, NEGOCIO, WHATSAPP_MENSAJE_TEMPLATE,
)
from models.schemas import (
    CotizacionResponse, ReglaDetalle, Desglose, TiempoEntrega
)


TIPO_LABELS = {
    "es_puerta":  "Puerta",
    "es_closet":  "Closet / Armario",
    "es_cocina":  "Mueble de cocina",
    "es_cama":    "Cama / Cabecera",
    "es_mesa":    "Mesa / Escritorio",
    "es_estante": "Estante / Repisa",
}
MATERIAL_LABELS = {
    "material_mdf":     "MDF",
    "material_triplex": "Triplex",
    "material_solida":  "Madera solida",
    "material_pino":    "Pino",
}
ACABADO_LABELS = {
    "acabado_natural": "Sin acabado",
    "acabado_lacado":  "Lacado",
    "acabado_barniz":  "Barniz",
    "acabado_pintado": "Pintado",
}
EXTRA_LABELS = {
    "tiene_cajones":        "Cajones",
    "tiene_vidrio":         "Vidrio",
    "tiene_espejo":         "Espejo",
    "puertas_corredizas":   "Puertas corredizas",
    "es_empotrado":         "Empotrado",
    "es_urgente":           "Urgente",
    "requiere_instalacion": "Instalacion en sitio",
    "fuera_de_ciudad":      "Fuera de ciudad",
}

# Mapa tipo -> clave para PRECIOS_BASE
TIPO_KEY = {
    "es_puerta":  "puerta",
    "es_closet":  "closet",
    "es_cocina":  "cocina",
    "es_cama":    "cama",
    "es_mesa":    "mesa",
    "es_estante": "estante",
}
MATERIAL_KEY = {
    "material_mdf":     "mdf",
    "material_triplex": "triplex",
    "material_solida":  "solida",
    "material_pino":    "pino",
}


def procesar_cotizacion(
    tipo_mueble: str,
    material:    str,
    acabado:     str,
    extras:      list,
) -> CotizacionResponse:

    # 1. Filtrar extras que no aplican al tipo seleccionado
    extras_invalidos = EXTRAS_NO_APLICAN.get(tipo_mueble, [])
    extras_limpios   = [e for e in extras if e not in extras_invalidos]

    # 2. Construir hechos para el motor
    hechos = _construir_hechos(tipo_mueble, material, acabado, extras_limpios)

    # 3. Ejecutar motor de inferencia
    resultado = encadenamiento_adelante(hechos)
    resumen   = generar_resumen(resultado, hechos)

    # 4. Calcular desglose de precio usando PRECIOS_BASE por tipo+material
    desglose = _calcular_desglose(
        tipo_mueble  = tipo_mueble,
        material     = material,
        precio_key   = resumen.get("precio_key", ""),
        extras       = extras_limpios,
        es_urgente   = "es_urgente" in extras_limpios,
        instalacion  = "requiere_instalacion" in extras_limpios,
        fuera_ciudad = "fuera_de_ciudad" in extras_limpios,
        tiene_vidrio = "tiene_vidrio" in extras_limpios,
    )

    # 5. Calcular tiempo de entrega
    tiempo = _calcular_tiempo(tipo_mueble, material, extras_limpios)

    # 6. Detectar advertencias de combinacion
    adv_combinacion = _detectar_advertencias_combinacion(
        tipo_mueble, material, acabado, extras_limpios
    )

    # 7. Construir URL de WhatsApp
    whatsapp_url = _construir_whatsapp(
        tipo_mueble, material, acabado, extras_limpios,
        resumen.get("precio_rango", ""),
        tiempo, adv_combinacion,
    )

    # 8. Armar respuesta
    return CotizacionResponse(
        hay_resultado            = resumen.get("hay_resultado", False),
        precio_label             = resumen.get("precio_label", ""),
        precio_rango             = resumen.get("precio_rango", ""),
        precio_color             = resumen.get("precio_color", "#666"),
        precio_key               = resumen.get("precio_key", ""),
        advertencias             = resumen.get("advertencias", []),
        advertencias_combinacion = adv_combinacion,
        reglas_detalle           = [
            ReglaDetalle(
                id          = r["id"],
                nombre      = r["nombre"],
                explicacion = r["explicacion"],
                certeza     = int(r["certeza"] * 100),
                condiciones = [p for p, v in r["condiciones"] if v is True],
            )
            for r in resultado["reglas_aplicadas"]
        ],
        desglose       = desglose,
        tiempo_entrega = tiempo,
        whatsapp_url   = whatsapp_url,
        nota_final     = resumen.get("nota_final", ""),
    )


def _construir_hechos(tipo, material, acabado, extras):
    hechos = {}
    for t in ["es_puerta","es_closet","es_cocina","es_cama","es_mesa","es_estante"]:
        hechos[t] = (t == tipo)
    for m in ["material_mdf","material_triplex","material_solida","material_pino"]:
        hechos[m] = (m == material)
    for a in ["acabado_natural","acabado_lacado","acabado_barniz","acabado_pintado"]:
        hechos[a] = (a == acabado)
    for e in ["tiene_cajones","tiene_vidrio","tiene_espejo","es_empotrado",
              "puertas_corredizas","es_urgente","requiere_instalacion","fuera_de_ciudad"]:
        hechos[e] = (e in extras)
    return hechos


def _calcular_desglose(
    tipo_mueble, material, precio_key, extras,
    es_urgente, instalacion, fuera_ciudad, tiene_vidrio
):
    # Intentar usar PRECIOS_BASE especifico por tipo+material
    tipo_k     = TIPO_KEY.get(tipo_mueble, "")
    material_k = MATERIAL_KEY.get(material, "")
    clave_base = f"{tipo_k}_{material_k}"
    precio_base = PRECIOS_BASE.get(clave_base)

    if precio_base:
        # Usar el precio especifico del tipo+material
        base_min = precio_base["min"]
        base_max = precio_base["max"]
    else:
        # Fallback al rango generico
        rango    = RANGOS_NUMERICOS.get(precio_key, {"min": 0, "max": 0})
        base_min = rango["min"]
        base_max = rango["max"]

    base = int((base_min + base_max) / 2)

    # Aplicar recargo por urgencia
    if es_urgente:
        base     = int(base * (1 + RECARGO_URGENCIA))
        base_min = int(base_min * (1 + RECARGO_URGENCIA))
        base_max = int(base_max * (1 + RECARGO_URGENCIA))

    mat  = int(base * PORCENTAJES_DESGLOSE["materiales"])
    mano = int(base * PORCENTAJES_DESGLOSE["mano_obra"])
    ac   = int(base * PORCENTAJES_DESGLOSE["acabado"])
    ext  = int(base * PORCENTAJES_DESGLOSE["extras"])

    # Agregar costo de instalacion
    if instalacion:
        costo_inst = RECARGO_INSTALACION_CIUDAD if fuera_ciudad else RECARGO_INSTALACION_LOCAL
        ext += costo_inst

    # Agregar costo promedio de vidrio
    if tiene_vidrio:
        ext += int((COSTO_VIDRIO_MIN + COSTO_VIDRIO_MAX) / 2)

    return Desglose(
        materiales = mat,
        mano_obra  = mano,
        acabado    = ac,
        extras     = ext,
        total_min  = base_min,
        total_max  = base_max,
    )


def _calcular_tiempo(tipo, material, extras):
    base = TIEMPOS_ENTREGA.get(tipo, {"min": 5, "max": 10})
    mult = MULTIPLICADOR_TIEMPO_MATERIAL.get(material, 1.0)

    dias_min = math.ceil(base["min"] * mult)
    dias_max = math.ceil(base["max"] * mult)

    if "tiene_cajones" in extras:
        dias_min += 2
        dias_max += 3
    if "puertas_corredizas" in extras:
        dias_min += 2
        dias_max += 4
    if "es_empotrado" in extras:
        dias_min += 1
        dias_max += 2

    if dias_min <= 7:
        label = f"{dias_min}–{dias_max} dias"
    elif dias_min <= 14:
        label = f"1–2 semanas"
    else:
        label = f"{math.ceil(dias_min/7)}–{math.ceil(dias_max/7)} semanas"

    return TiempoEntrega(
        min_dias = dias_min,
        max_dias = dias_max,
        label    = label,
    )


def _detectar_advertencias_combinacion(tipo, material, acabado, extras):
    advertencias = []
    claves = [
        (tipo, material),
        (tipo, acabado),
        (material, acabado),
    ]
    for clave in claves:
        msg = ADVERTENCIAS_COMBINACION.get(clave)
        if msg:
            advertencias.append(msg)
    return advertencias


def _construir_whatsapp(tipo, material, acabado, extras, precio, tiempo, advertencias):
    tipo_label     = TIPO_LABELS.get(tipo, tipo)
    material_label = MATERIAL_LABELS.get(material, material)
    acabado_label  = ACABADO_LABELS.get(acabado, "Sin acabado")
    extras_labels  = [EXTRA_LABELS.get(e, e) for e in extras if e not in ["es_urgente","requiere_instalacion","fuera_de_ciudad"]]
    extras_str     = ", ".join(extras_labels) if extras_labels else "Ninguno"

    adv_str = ""
    if advertencias:
        adv_str = "⚠️ *Nota:* " + advertencias[0] + "\n\n"

    mensaje = WHATSAPP_MENSAJE_TEMPLATE.format(
        nombre_negocio = NEGOCIO["nombre"],
        tipo           = tipo_label,
        material       = material_label,
        acabado        = acabado_label,
        extras         = extras_str,
        precio         = precio,
        tiempo         = tiempo.label,
        advertencias   = adv_str,
    )

    numero  = NEGOCIO["whatsapp"]
    encoded = urllib.parse.quote(mensaje)
    return f"https://wa.me/{numero}?text={encoded}"