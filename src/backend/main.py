# =============================================================================
# main.py - Punto de entrada de la aplicacion
# Maderas Gerardo - Sistema Experto de Cotizacion
# =============================================================================

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS, HOST, PORT, DEBUG, NEGOCIO
from routers.cotizacion import router as cotizacion_router

app = FastAPI(
    title       = f"{NEGOCIO['nombre']} — API",
    description = "Sistema experto de cotizacion de carpinteria",
    version     = "2.0.0",
    docs_url    = "/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = CORS_ORIGINS,
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)

app.include_router(cotizacion_router)

@app.get("/", tags=["health"])
def health():
    return {
        "status":  "ok",
        "sistema": NEGOCIO["nombre"],
        "version": "2.0.0",
    }

if __name__ == "__main__":
    import uvicorn
    print(f"\n{'='*50}")
    print(f"  {NEGOCIO['nombre']} — Motor de Inferencia v2.0")
    print(f"  Servidor en: http://localhost:{PORT}")
    print(f"  Documentacion: http://localhost:{PORT}/docs")
    print(f"{'='*50}\n")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)
