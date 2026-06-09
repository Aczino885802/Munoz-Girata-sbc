# Maderas Gerardo - Sistema Experto de Cotizacion

Sistema basado en conocimiento para cotizacion de muebles de carpinteria.
Proyecto final de Inteligencia Artificial II - Fundacion Universitaria Los Libertadores, 2026.

**Autores:** Munoz y Girata
**Dominio:** Carpinteria artesanal - Taller Maderas Gerardo, Bogota, Colombia

## Descripcion

Aplicacion web que permite a los clientes de un taller de carpinteria cotizar muebles a medida. El sistema utiliza un motor de inferencia con encadenamiento hacia adelante y 40 reglas de produccion con factores de certeza para determinar precios, tiempos de entrega y advertencias de compatibilidad.

## Tecnologias

- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic
- **Frontend:** React, Vite, JavaScript, Tailwind CSS, lucide-react, jsPDF
- **Motor de inferencia:** Python puro, encadenamiento hacia adelante

## Instrucciones de instalacion

### Requisitos previos
- Python 3.10 o superior
- Node.js 18 o superior
- npm

### Backend
```bash
cd src/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd src/frontend
npm install
npm run dev
```

La aplicacion estara disponible en http://localhost:5173

## Como ejecutar la aplicacion

1. Abrir una terminal y ejecutar el backend (puerto 8000)
2. Abrir otra terminal y ejecutar el frontend (puerto 5173)
3. Abrir el navegador en http://localhost:5173
4. Navegar al Cotizador y seleccionar tipo de mueble, material, color y extras
5. Presionar "Generar Cotizacion" para ver el resultado del motor de inferencia

## Estructura del proyecto

```
Munoz_Girata_proyecto_final_sbc/
├── README.md
├── requirements.txt
├── src/
│   ├── backend/         # API REST + Motor de inferencia
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── knowledge/   # Base de conocimiento + Motor
│   │   ├── models/      # Esquemas Pydantic
│   │   ├── routers/     # Endpoints HTTP
│   │   └── services/    # Logica de negocio
│   └── frontend/        # Interfaz web React
│       └── src/
│           ├── App.jsx
│           ├── hooks/
│           ├── components/
│           ├── pages/
│           └── config/
├── docs/
│   ├── documentacion_tecnica.pdf
│   └── manual_usuario.pdf
└── tests/
    └── casos_prueba.md
```
