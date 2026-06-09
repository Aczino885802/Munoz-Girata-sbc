# =============================================================================
# models/schemas.py - Modelos de datos
# =============================================================================

from pydantic import BaseModel, field_validator
from typing import List, Optional


class CotizacionRequest(BaseModel):
    tipo_mueble:  str
    material:     str
    acabado:      Optional[str] = ""
    extras:       Optional[List[str]] = []

    @field_validator("tipo_mueble")
    @classmethod
    def validar_tipo(cls, v):
        validos = ["es_puerta","es_closet","es_cocina","es_cama","es_mesa","es_estante"]
        if v not in validos:
            raise ValueError(f"Tipo invalido: {v}")
        return v

    @field_validator("material")
    @classmethod
    def validar_material(cls, v):
        validos = ["material_mdf","material_triplex","material_solida","material_pino"]
        if v not in validos:
            raise ValueError(f"Material invalido: {v}")
        return v


class ReglaDetalle(BaseModel):
    id:          str
    nombre:      str
    explicacion: str
    certeza:     int
    condiciones: List[str]


class Desglose(BaseModel):
    materiales: int
    mano_obra:  int
    acabado:    int
    extras:     int
    total_min:  int
    total_max:  int


class TiempoEntrega(BaseModel):
    min_dias: int
    max_dias: int
    label:    str


class CotizacionResponse(BaseModel):
    hay_resultado:   bool
    precio_label:    str
    precio_rango:    str
    precio_color:    str
    precio_key:      str
    advertencias:    List[str]
    advertencias_combinacion: List[str]
    reglas_detalle:  List[ReglaDetalle]
    desglose:        Desglose
    tiempo_entrega:  TiempoEntrega
    whatsapp_url:    str
    nota_final:      str


class ErrorResponse(BaseModel):
    error:   str
    detalle: Optional[str] = None
