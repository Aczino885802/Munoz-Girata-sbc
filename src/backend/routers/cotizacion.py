# =============================================================================
# routers/cotizacion.py - Rutas HTTP
# =============================================================================
# Esta capa solo maneja HTTP: recibe requests, valida, delega al servicio.
# No contiene logica de negocio.
# =============================================================================

from fastapi import APIRouter, HTTPException
from models.schemas import CotizacionRequest, CotizacionResponse, ErrorResponse
from services.cotizacion_service import procesar_cotizacion

router = APIRouter(prefix="/api", tags=["cotizacion"])


@router.post(
    "/cotizar",
    response_model     = CotizacionResponse,
    responses          = {400: {"model": ErrorResponse}},
    summary            = "Generar cotizacion",
    description        = "Ejecuta el motor de inferencia y retorna cotizacion completa con desglose, tiempo y URL de WhatsApp.",
)
def cotizar(req: CotizacionRequest):
    try:
        return procesar_cotizacion(
            tipo_mueble = req.tipo_mueble,
            material    = req.material,
            acabado     = req.acabado or "",
            extras      = req.extras or [],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.get(
    "/reglas",
    summary     = "Listar reglas",
    description = "Retorna todas las reglas de la base de conocimiento.",
)
def listar_reglas():
    from knowledge.base_conocimiento import REGLAS
    return {
        "total":  len(REGLAS),
        "reglas": [
            {
                "id":          r["id"],
                "nombre":      r["nombre"],
                "descripcion": r["descripcion"],
                "certeza":     r["certeza"],
            }
            for r in REGLAS
        ],
    }


@router.get(
    "/negocio",
    summary     = "Info del negocio",
    description = "Retorna la configuracion publica del negocio.",
)
def info_negocio():
    from config import NEGOCIO
    return {k: v for k, v in NEGOCIO.items() if k != "whatsapp"}
