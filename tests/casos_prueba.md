# Casos de Prueba - Sistema Experto Maderas Gerardo

## Tabla de validacion

| Caso | Descripcion | Hechos iniciales | Reglas esperadas | Conclusion esperada | Resultado obtenido | Estado |
|------|-------------|------------------|------------------|--------------------|--------------------|--------|
| 1 | Cotizacion basica - puerta economica | tipo=puerta, material=MDF, extras=ninguno | R-A1 (puerta_mdf) | Precio muy economico, entrega 1-2 semanas | Precio muy economico ($280,000-$420,000), entrega 1-2 semanas | PASS |
| 2 | Cotizacion compleja - cocina premium con extras | tipo=cocina, material=madera_solida, extras=[cajones, vidrio, urgente, instalacion] | R-A15 (cocina_solida), R-C1 (cajones), R-C5 (vidrio), R-D1 (urgencia), R-D2 (instalacion) | Precio alto, advertencia vidrio, recargo urgencia 20%, recargo instalacion, entrega reducida | Precio alto ($1,850,000-$2,770,000), advertencia vidrio + recargos aplicados, entrega 3-5 dias | PASS |
| 3 | Caso sin conclusion - datos incompletos | tipo=null, material=null | Ninguna regla se activa | Error: "Selecciona tipo y material" | Error de validacion mostrado al usuario, motor no se ejecuta | PASS |
| 4 | Combinacion con advertencia - MDF en cocina | tipo=cocina, material=MDF, extras=[empotrado] | R-A13 (cocina_mdf), advertencia combinacion | Precio economico + advertencia: MDF no recomendado para cocina ni empotrado | Precio economico + advertencias de humedad y empotrado mostradas en amarillo | PASS |
| 5 | Caso de borde - todos los extras en estante de pino | tipo=estante, material=pino, extras=[cajones, vidrio, espejo, corredizas, empotrado, urgente, instalacion, fuera_ciudad] | R-A24 (estante_pino), R-C1-C5 (extras), R-D1-D3 (logistica) | Precio medio-alto con multiples recargos, advertencias de compatibilidad | Precio medio-alto + recargos acumulados + advertencias de combinaciones + tiempo reducido por urgencia | PASS |

## Descripcion detallada de cada caso

### Caso 1 - Cotizacion basica
Valida que el motor funcione correctamente con la combinacion mas simple posible. Se espera que solo se active una regla base (puerta + MDF) y el sistema devuelva un precio en el rango mas bajo sin advertencias.

### Caso 2 - Cotizacion compleja
Prueba que el motor puede manejar multiples reglas activandose en cadena. Se combinan reglas de clasificacion base, reglas de extras y reglas de logistica. Valida que los recargos se acumulan correctamente y las advertencias aparecen cuando corresponde.

### Caso 3 - Caso sin conclusion
Verifica el manejo de errores cuando el usuario no proporciona los datos minimos. El sistema debe rechazar la solicitud antes de ejecutar el motor de inferencia y mostrar un mensaje claro al usuario.

### Caso 4 - Combinacion con advertencia
Prueba el sistema de advertencias en tiempo real. La combinacion de MDF con cocina y empotrado activa multiples advertencias de compatibilidad que se muestran al usuario antes de generar la cotizacion.

### Caso 5 - Caso de borde
Estresa el motor con todas las opciones posibles seleccionadas. Valida que el sistema maneja correctamente la acumulacion de recargos sin errores y que las reglas de logistica (urgencia, instalacion, fuera de ciudad) se aplican en el orden correcto.
