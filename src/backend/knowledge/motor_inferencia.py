# =============================================================================
# MOTOR DE INFERENCIA - Sistema Experto de Cotización de Carpintería
# =============================================================================
# Implementa:
#   - Encadenamiento hacia adelante (forward chaining)
#   - Explicación del razonamiento
#   - Función porque() para justificar conclusiones
#   - Manejo de casos sin conclusión
#   - Detección de ciclos
# =============================================================================

import logging
from knowledge.base_conocimiento import REGLAS, PREDICADOS, RANGOS_PRECIO

# Configurar logging para seguimiento del proceso
logging.basicConfig(
    level=logging.INFO,
    format='[MOTOR] %(message)s'
)
logger = logging.getLogger(__name__)


# =============================================================================
# FUNCIÓN PRINCIPAL: ENCADENAMIENTO HACIA ADELANTE
# =============================================================================

def encadenamiento_adelante(hechos_iniciales: dict) -> dict:
    """
    Aplica encadenamiento hacia adelante sobre la base de conocimiento.

    El motor recorre todas las reglas repetidamente hasta que no haya
    nuevos hechos que derivar (punto fijo). En cada iteración busca
    reglas cuyas condiciones estén todas satisfechas en los hechos
    actuales y cuya conclusión aún no haya sido derivada.

    Parámetros:
        hechos_iniciales (dict): Predicados conocidos al inicio.
                                 Ejemplo: {'es_closet': True, 'material_mdf': True}

    Retorna:
        dict con claves:
            'hechos_finales'    → dict con todos los hechos (iniciales + derivados)
            'reglas_aplicadas'  → lista de reglas que se dispararon (en orden)
            'conclusiones'      → lista de conclusiones de precio encontradas
            'advertencias'      → lista de advertencias y recargos
            'hay_conclusion'    → bool, True si se derivó algún precio
    """
    # Copiar hechos iniciales para no modificarlos
    hechos = dict(hechos_iniciales)
    reglas_aplicadas = []
    iteracion = 0
    MAX_ITERACIONES = 50  # Protección contra ciclos infinitos

    logger.info(f"Iniciando inferencia con {len(hechos)} hechos iniciales")
    logger.info(f"Hechos: {[k for k, v in hechos.items() if v]}")

    # --- Bucle de punto fijo ---
    while iteracion < MAX_ITERACIONES:
        iteracion += 1
        nuevos_hechos = False

        for regla in REGLAS:
            # Evitar disparar la misma regla dos veces
            if regla['id'] in [r['id'] for r in reglas_aplicadas]:
                continue

            # Verificar si TODAS las condiciones se cumplen
            if _condiciones_satisfechas(regla['condiciones'], hechos):
                conclusion_pred, conclusion_val = regla['conclusion']

                # Solo agregar si es un hecho nuevo
                if hechos.get(conclusion_pred) != conclusion_val:
                    hechos[conclusion_pred] = conclusion_val
                    reglas_aplicadas.append(regla)
                    nuevos_hechos = True
                    logger.info(
                        f"[Iter {iteracion}] Regla {regla['id']} disparada → "
                        f"{conclusion_pred} = {conclusion_val}"
                    )

        # Si no hubo nuevos hechos, llegamos al punto fijo
        if not nuevos_hechos:
            logger.info(f"Punto fijo alcanzado en iteración {iteracion}")
            break

    if iteracion >= MAX_ITERACIONES:
        logger.warning("Se alcanzó el límite máximo de iteraciones (posible ciclo)")

    # --- Recopilar conclusiones de precio ---
    conclusiones_precio = [
        pred for pred in RANGOS_PRECIO.keys()
        if hechos.get(pred, False)
    ]

    # Si hay múltiples niveles de precio, quedarse con el más alto
    if len(conclusiones_precio) > 1:
        orden = ['precio_muy_bajo', 'precio_bajo', 'precio_medio',
                 'precio_alto', 'precio_muy_alto']
        conclusiones_precio = [
            max(conclusiones_precio, key=lambda x: orden.index(x))
        ]

    # --- Recopilar advertencias y recargos ---
    advertencias = []
    if hechos.get('advertencia_vidrio'):
        advertencias.append('advertencia_vidrio')
    if hechos.get('recargo_urgencia'):
        advertencias.append('recargo_urgencia')
    if hechos.get('recargo_instalacion'):
        advertencias.append('recargo_instalacion')

    hay_conclusion = len(conclusiones_precio) > 0

    if not hay_conclusion:
        logger.warning("No se pudo derivar ninguna conclusión de precio")

    return {
        'hechos_finales':   hechos,
        'reglas_aplicadas': reglas_aplicadas,
        'conclusiones':     conclusiones_precio,
        'advertencias':     advertencias,
        'hay_conclusion':   hay_conclusion,
    }


# =============================================================================
# FUNCIÓN: VERIFICAR CONDICIONES
# =============================================================================

def _condiciones_satisfechas(condiciones: list, hechos: dict) -> bool:
    """
    Verifica si todas las condiciones de una regla están presentes
    en los hechos actuales.

    Una condición (predicado, valor_esperado) se cumple cuando:
      - El predicado existe en hechos con el mismo valor esperado, O
      - El valor esperado es False y el predicado no está en hechos
        (ausencia equivale a False)

    Parámetros:
        condiciones: lista de tuplas (predicado, valor_esperado)
        hechos: dict con predicados conocidos

    Retorna:
        True si TODAS las condiciones se cumplen, False en caso contrario
    """
    for predicado, valor_esperado in condiciones:
        valor_actual = hechos.get(predicado, False)
        if valor_actual != valor_esperado:
            return False
    return True


# =============================================================================
# FUNCIÓN: EXPLICAR RAZONAMIENTO
# =============================================================================

def explicar_razonamiento(resultado: dict) -> str:
    """
    Genera una explicación legible del razonamiento seguido por el motor.

    Parámetros:
        resultado: dict retornado por encadenamiento_adelante()

    Retorna:
        str con la explicación completa en lenguaje natural
    """
    reglas = resultado['reglas_aplicadas']
    conclusiones = resultado['conclusiones']
    advertencias = resultado['advertencias']

    if not resultado['hay_conclusion']:
        return (
            "⚠️ El sistema no pudo derivar una cotización con los datos proporcionados.\n"
            "Por favor verifique que ingresó el tipo de mueble, el material y al menos un acabado."
        )

    lineas = []
    lineas.append("═" * 55)
    lineas.append("  RAZONAMIENTO DEL SISTEMA EXPERTO")
    lineas.append("═" * 55)
    lineas.append(f"\n📋 Reglas aplicadas ({len(reglas)} en total):\n")

    for i, regla in enumerate(reglas, 1):
        lineas.append(f"  {i}. [{regla['id']}] {regla['nombre']}")
        lineas.append(f"     → {regla['explicacion']}")
        lineas.append(f"     Certeza: {int(regla['certeza'] * 100)}%\n")

    # Conclusión principal
    if conclusiones:
        precio_key = conclusiones[0]
        info = RANGOS_PRECIO[precio_key]
        lineas.append("─" * 55)
        lineas.append(f"\n💰 CONCLUSIÓN: {info['label'].upper()}")
        lineas.append(f"   Rango estimado: {info['rango']}")

    # Advertencias y recargos
    if advertencias:
        lineas.append("\n⚠️  AJUSTES ADICIONALES:")
        msgs = {
            'recargo_urgencia':    '  • +20% por trabajo urgente (< 7 días)',
            'recargo_instalacion': '  • +$30–$150 por instalación en sitio',
            'advertencia_vidrio':  '  • +$50–$150 adicionales por vidrio (proveedor externo)',
        }
        for adv in advertencias:
            if adv in msgs:
                lineas.append(msgs[adv])

    lineas.append("\n" + "═" * 55)
    return "\n".join(lineas)


# =============================================================================
# FUNCIÓN: PORQUE (explicación de una conclusión específica)
# =============================================================================

def porque(conclusion: str, resultado: dict) -> str:
    """
    Explica por qué el sistema llegó a una conclusión específica,
    rastreando la cadena de reglas que la produjeron.

    Parámetros:
        conclusion: predicado a explicar (ej: 'precio_medio')
        resultado:  dict retornado por encadenamiento_adelante()

    Retorna:
        str con la justificación de esa conclusión
    """
    reglas = resultado['reglas_aplicadas']

    # Buscar la regla que produjo esta conclusión
    regla_directa = None
    for regla in reglas:
        pred, val = regla['conclusion']
        if pred == conclusion and val is True:
            regla_directa = regla
            break

    if regla_directa is None:
        return (
            f"La conclusión '{conclusion}' no fue derivada por el sistema "
            f"en esta sesión de inferencia."
        )

    lineas = []
    etiqueta = RANGOS_PRECIO.get(conclusion, {}).get('label', conclusion)
    lineas.append(f"\n🔍 ¿Por qué '{etiqueta}'?")
    lineas.append("─" * 45)
    lineas.append(f"\nRegla responsable: [{regla_directa['id']}] {regla_directa['nombre']}")
    lineas.append(f"\nLa regla se activó porque se cumplieron estas condiciones:")

    for pred, val in regla_directa['condiciones']:
        descripcion = PREDICADOS.get(pred, pred)
        estado = "✓ Verdadero" if val else "✗ Falso (ausente)"
        lineas.append(f"  • {descripcion}")
        lineas.append(f"    Estado: {estado}")

    lineas.append(f"\nConclusión derivada: {regla_directa['explicacion']}")
    lineas.append(f"Factor de certeza: {int(regla_directa['certeza'] * 100)}%")

    # Rastrear si la conclusión fue modificada por otra regla posterior
    for regla in reglas:
        conds = [p for p, v in regla['condiciones'] if p == conclusion and v is True]
        if conds and regla != regla_directa:
            lineas.append(
                f"\n📌 Nota: Esta conclusión fue además usada como condición "
                f"en [{regla['id']}] {regla['nombre']}"
            )

    return "\n".join(lineas)


# =============================================================================
# FUNCIÓN: GENERAR RESUMEN COTIZACIÓN (para la interfaz)
# =============================================================================

def generar_resumen(resultado: dict, hechos_iniciales: dict) -> dict:
    """
    Genera un resumen estructurado de la cotización para mostrar en la interfaz.

    Retorna:
        dict con toda la información necesaria para renderizar el resultado
    """
    conclusiones = resultado['conclusiones']
    advertencias = resultado['advertencias']
    reglas = resultado['reglas_aplicadas']

    resumen = {
        'hay_resultado': resultado['hay_conclusion'],
        'precio_label':  '',
        'precio_rango':  '',
        'precio_color':  '#95a5a6',
        'precio_key':    '',
        'reglas_count':  len(reglas),
        'reglas_lista':  [],
        'advertencias':  [],
        'explicacion':   explicar_razonamiento(resultado),
        'nota_final':    '',
    }

    if conclusiones:
        precio_key = conclusiones[0]
        info = RANGOS_PRECIO[precio_key]
        resumen['precio_label'] = info['label']
        resumen['precio_rango'] = info['rango']
        resumen['precio_color'] = info['color']
        resumen['precio_key']   = precio_key

    # Lista de reglas disparadas (para la interfaz)
    for regla in reglas:
        resumen['reglas_lista'].append({
            'id':          regla['id'],
            'nombre':      regla['nombre'],
            'explicacion': regla['explicacion'],
            'certeza':     int(regla['certeza'] * 100),
        })

    # Mensajes de advertencia legibles
    msgs_advertencias = {
        'recargo_urgencia':    '⏰ Recargo del 20% por urgencia (trabajo en menos de 7 días)',
        'recargo_instalacion': '🚚 Costo adicional de $30–$150 por instalación en sitio',
        'advertencia_vidrio':  '🪟 Costo extra de $50–$150 por vidrio (requiere proveedor externo)',
    }
    for adv in advertencias:
        if adv in msgs_advertencias:
            resumen['advertencias'].append(msgs_advertencias[adv])

    # Nota final si no hay conclusión
    if not resultado['hay_conclusion']:
        resumen['nota_final'] = (
            "No fue posible generar una cotización. "
            "Asegúrese de seleccionar tipo de mueble, material y acabado."
        )

    return resumen


# =============================================================================
# PRUEBA RÁPIDA DESDE CONSOLA
# =============================================================================

if __name__ == '__main__':
    print("\n" + "=" * 55)
    print("  PRUEBA DEL MOTOR DE INFERENCIA")
    print("=" * 55)

    # Caso de prueba: Closet MDF con cajones
    hechos_prueba = {
        'es_closet':       True,
        'material_mdf':    True,
        'tiene_cajones':   True,
        'tiene_espejo':    False,
        'acabado_lacado':  True,
        'es_urgente':      True,
    }

    print("\nHechos de entrada:")
    for k, v in hechos_prueba.items():
        if v:
            print(f"  ✓ {k}")

    resultado = encadenamiento_adelante(hechos_prueba)

    print("\n" + explicar_razonamiento(resultado))

    if resultado['conclusiones']:
        print(porque(resultado['conclusiones'][0], resultado))
