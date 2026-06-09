# =============================================================================
# config.py - Configuracion central del sistema
# Maderas Gerardo - Sistema Experto de Cotizacion
# =============================================================================
# Todas las constantes del sistema en un solo lugar.
# Para produccion, usar variables de entorno con python-dotenv.
# =============================================================================

import os

# -----------------------------------------------------------------------------
# CONFIGURACION DEL SERVIDOR
# -----------------------------------------------------------------------------
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Origenes permitidos para CORS (frontend React)
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

# -----------------------------------------------------------------------------
# INFORMACION DEL NEGOCIO
# -----------------------------------------------------------------------------
NEGOCIO = {
    "nombre":    "Maderas Gerardo",
    "whatsapp":  os.getenv("WHATSAPP_NUMBER", "573012593219"),
    "ciudad":    "Bogota, Colombia",
    "desde":     1998,
    "garantia":  "100%",
    "proyectos": "+500",
}

# -----------------------------------------------------------------------------
# LOGICA DE NEGOCIO - Tiempos de entrega estimados (en dias)
# -----------------------------------------------------------------------------
TIEMPOS_ENTREGA = {
    "es_puerta":  { "min": 3,  "max": 7  },
    "es_closet":  { "min": 7,  "max": 15 },
    "es_cocina":  { "min": 15, "max": 30 },
    "es_cama":    { "min": 5,  "max": 10 },
    "es_mesa":    { "min": 3,  "max": 7  },
    "es_estante": { "min": 2,  "max": 5  },
}

# Multiplicador de tiempo segun material
MULTIPLICADOR_TIEMPO_MATERIAL = {
    "material_mdf":     1.0,
    "material_triplex": 1.0,
    "material_pino":    1.2,
    "material_solida":  1.5,
}

# -----------------------------------------------------------------------------
# LOGICA DE NEGOCIO - Compatibilidades y advertencias
# -----------------------------------------------------------------------------

# Combinaciones que generan advertencia (no invalidas, solo recomendacion)
ADVERTENCIAS_COMBINACION = {
    ("material_mdf", "acabado_barniz"): (
        "El barniz no resalta bien en MDF porque no tiene veta natural. "
        "Se recomienda lacado o pintado para este material."
    ),
    ("material_triplex", "acabado_barniz"): (
        "El barniz en triplex da un resultado irregular. "
        "Se recomienda sellador o pintado."
    ),
    ("es_cocina", "material_mdf"): (
        "El MDF en cocinas puede deteriorarse con la humedad. "
        "Considere MDF lacado o madera solida para mayor durabilidad."
    ),
    ("es_puerta", "material_mdf"): (
        "Las puertas en MDF requieren marco solido para mayor resistencia. "
        "Verifique el uso (interior/exterior) antes de confirmar."
    ),
}

# Extras que no aplican a ciertos tipos de mueble
EXTRAS_NO_APLICAN = {
    "es_puerta":  ["tiene_cajones", "puertas_corredizas"],
    "es_mesa":    ["puertas_corredizas", "tiene_espejo"],
    "es_estante": ["puertas_corredizas", "tiene_espejo"],
    "es_cama":    ["puertas_corredizas"],
}

# -----------------------------------------------------------------------------
# RANGOS DE PRECIO NUMERICOS (para calculos internos)
# -----------------------------------------------------------------------------
RANGOS_NUMERICOS = {
    "precio_muy_bajo": { "min": 60,   "max": 150  },
    "precio_bajo":     { "min": 150,  "max": 350  },
    "precio_medio":    { "min": 350,  "max": 700  },
    "precio_alto":     { "min": 700,  "max": 1200 },
    "precio_muy_alto": { "min": 1200, "max": 2000 },
}

# Porcentajes del desglose de precio
PORCENTAJES_DESGLOSE = {
    "materiales": 0.40,
    "mano_obra":  0.38,
    "acabado":    0.14,
    "extras":     0.08,
}

# Recargo por urgencia
RECARGO_URGENCIA = 0.20

# Recargo por instalacion local
RECARGO_INSTALACION_LOCAL = 55   # USD promedio
RECARGO_INSTALACION_CIUDAD = 115  # USD promedio fuera de ciudad

# Costo adicional por vidrio
COSTO_VIDRIO_MIN = 50
COSTO_VIDRIO_MAX = 150

# -----------------------------------------------------------------------------
# MENSAJES DE WHATSAPP
# -----------------------------------------------------------------------------
WHATSAPP_MENSAJE_TEMPLATE = (
    "Hola {nombre_negocio}, me interesa cotizar un trabajo.\n\n"
    "📋 *Detalle del proyecto:*\n"
    "• Tipo: {tipo}\n"
    "• Material: {material}\n"
    "• Acabado: {acabado}\n"
    "• Extras: {extras}\n\n"
    "💰 *Estimado del sistema:* {precio}\n\n"
    "⏱ *Tiempo estimado:* {tiempo} dias\n\n"
    "{advertencias}"
    "Quedo atento a su respuesta. Gracias."
)
