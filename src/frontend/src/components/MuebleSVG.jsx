// MuebleSVG.jsx
// Ilustraciones SVG de cada mueble que cambian visualmente
// segun material, acabado y extras seleccionados

const COLORES_MADERA = {
  natural:         { fill: '#c8943a', stroke: '#7a4c10', veta: '#a06820' },
  material_mdf:    { fill: '#d4b896', stroke: '#8a6040', veta: '#b89870' },
  material_triplex:{ fill: '#c0a060', stroke: '#7a5828', veta: '#a08040' },
  material_pino:   { fill: '#e0c080', stroke: '#9a7030', veta: '#c0a050' },
  material_solida: { fill: '#8a5020', stroke: '#4a2808', veta: '#6a3810' },
}

const COLORES_ACABADO = {
  acabado_natural: null,
  acabado_pintado: '#e8e0d0',
  acabado_lacado:  '#f0ece4',
  acabado_barniz:  null,
}

function getColor(material, acabado) {
  const base = COLORES_MADERA[material] || COLORES_MADERA.natural
  const ap   = COLORES_ACABADO[acabado]
  if (ap) return { ...base, fill: ap }
  if (acabado === 'acabado_barniz') {
    return { ...base, fill: base.fill, opacity: 0.85 }
  }
  return base
}

// Vetas de madera reutilizables
function Vetas({ color, opacity = 0.3 }) {
  return (
    <g opacity={opacity} stroke={color} strokeWidth="0.6" fill="none">
      <path d="M0 8 Q20 6 40 8"/>
      <path d="M0 14 Q15 12 30 14 Q35 15 40 14"/>
      <path d="M0 20 Q22 18 40 20"/>
      <path d="M0 26 Q18 24 36 26"/>
    </g>
  )
}

// PUERTA
export function PuertaSVG({ material, acabado, extras = [] }) {
  const c = getColor(material, acabado)
  return (
    <svg viewBox="0 0 60 90" className="w-full h-full">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.2)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)"/>
        </linearGradient>
      </defs>
      {/* Marco */}
      <rect x="2" y="2" width="56" height="86" rx="1" fill={c.stroke} stroke={c.stroke} strokeWidth="1"/>
      {/* Puerta */}
      <rect x="5" y="5" width="50" height="80" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.8"/>
      <rect x="5" y="5" width="50" height="80" rx="1" fill="url(#pg)" opacity="0.4"/>
      {/* Vetas */}
      <g transform="translate(5, 5)">
        <Vetas color={c.veta} opacity={0.25}/>
      </g>
      {/* Panel superior */}
      <rect x="10" y="10" width="40" height="30" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.8" opacity="0.6"/>
      {/* Panel inferior */}
      <rect x="10" y="46" width="40" height="34" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.8" opacity="0.6"/>
      {/* Manija */}
      <circle cx="46" cy="45" r="2.5" fill={c.stroke}/>
      <line x1="46" y1="42" x2="46" y2="48" stroke={c.stroke} strokeWidth="1.2"/>
    </svg>
  )
}

// CLOSET
export function ClosetSVG({ material, acabado, extras = [] }) {
  const c           = getColor(material, acabado)
  const cajones     = extras.includes('tiene_cajones')
  const espejo      = extras.includes('tiene_espejo')
  const corredizas  = extras.includes('puertas_corredizas')
  return (
    <svg viewBox="0 0 90 80" className="w-full h-full">
      {/* Cuerpo */}
      <rect x="2" y="4" width="86" height="72" rx="1" fill={c.stroke} stroke={c.stroke} strokeWidth="1"/>
      <rect x="4" y="6" width="82" height="68" rx="1" fill={c.fill}/>
      {/* Vetas */}
      <g transform="translate(4, 6)">
        <Vetas color={c.veta} opacity={0.2}/>
      </g>
      {/* Division central */}
      <line x1="45" y1="6" x2="45" y2="74" stroke={c.stroke} strokeWidth="1"/>
      {/* Espejo izquierdo */}
      {espejo && <rect x="7" y="10" width="35" height="40" rx="1" fill="#b0c8d8" opacity="0.5" stroke={c.stroke} strokeWidth="0.5"/>}
      {!espejo && <rect x="7" y="10" width="35" height="40" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.6" opacity="0.5"/>}
      {/* Puerta derecha */}
      <rect x="48" y="10" width="35" height="40" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.6" opacity="0.5"/>
      {/* Corredizas */}
      {corredizas && <>
        <line x1="4" y1="8" x2="86" y2="8" stroke={c.stroke} strokeWidth="1.5" opacity="0.6"/>
        <line x1="4" y1="72" x2="86" y2="72" stroke={c.stroke} strokeWidth="1.5" opacity="0.6"/>
      </>}
      {/* Manijas */}
      <circle cx="40" cy="32" r="1.8" fill={c.stroke}/>
      <circle cx="50" cy="32" r="1.8" fill={c.stroke}/>
      {/* Cajones */}
      {cajones ? <>
        <rect x="7" y="54" width="35" height="12" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
        <rect x="48" y="54" width="35" height="12" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
        <line x1="20" y1="60" x2="30" y2="60" stroke={c.stroke} strokeWidth="1.2"/>
        <line x1="60" y1="60" x2="70" y2="60" stroke={c.stroke} strokeWidth="1.2"/>
      </> : <>
        <line x1="7" y1="54" x2="86" y2="54" stroke={c.stroke} strokeWidth="0.6" opacity="0.4"/>
      </>}
    </svg>
  )
}

// COCINA
export function CocinaSVG({ material, acabado, extras = [] }) {
  const c       = getColor(material, acabado)
  const cajones = extras.includes('tiene_cajones')
  const vidrio  = extras.includes('tiene_vidrio')
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Mesada */}
      <rect x="2" y="36" width="96" height="6" rx="1" fill="#b0b0a8" stroke="#888" strokeWidth="0.5"/>
      {/* Gabinetes bajos */}
      <rect x="2" y="42" width="96" height="34" rx="1" fill={c.stroke}/>
      <rect x="4" y="44" width="92" height="30" rx="1" fill={c.fill}/>
      <Vetas color={c.veta} opacity={0.15}/>
      {/* Division gabinetes bajos */}
      <line x1="36" y1="44" x2="36" y2="74" stroke={c.stroke} strokeWidth="0.8"/>
      <line x1="68" y1="44" x2="68" y2="74" stroke={c.stroke} strokeWidth="0.8"/>
      {/* Cajones */}
      {cajones && <>
        <rect x="6" y="46" width="28" height="10" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.6"/>
        <line x1="15" y1="51" x2="26" y2="51" stroke={c.stroke} strokeWidth="1"/>
      </>}
      {/* Manijas bajas */}
      <line x1="16" y1="62" x2="28" y2="62" stroke={c.stroke} strokeWidth="1.2"/>
      <line x1="48" y1="62" x2="60" y2="62" stroke={c.stroke} strokeWidth="1.2"/>
      <line x1="78" y1="62" x2="90" y2="62" stroke={c.stroke} strokeWidth="1.2"/>
      {/* Gabinetes altos */}
      <rect x="2" y="2" width="96" height="30" rx="1" fill={c.stroke}/>
      <rect x="4" y="4" width="92" height="26" rx="1" fill={c.fill}/>
      {/* Vidrio en gabinetes altos */}
      {vidrio ? <>
        <rect x="6" y="6" width="28" height="22" rx="1" fill="#b0c8d8" opacity="0.4" stroke={c.stroke} strokeWidth="0.5"/>
        <rect x="38" y="6" width="26" height="22" rx="1" fill="#b0c8d8" opacity="0.4" stroke={c.stroke} strokeWidth="0.5"/>
      </> : <>
        <rect x="6" y="6" width="28" height="22" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.6" opacity="0.5"/>
        <rect x="38" y="6" width="26" height="22" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.6" opacity="0.5"/>
      </>}
      {/* Manijas altas */}
      <line x1="16" y1="20" x2="26" y2="20" stroke={c.stroke} strokeWidth="1"/>
      <line x1="46" y1="20" x2="56" y2="20" stroke={c.stroke} strokeWidth="1"/>
    </svg>
  )
}

// CAMA
export function CamaSVG({ material, acabado, extras = [] }) {
  const c = getColor(material, acabado)
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full">
      {/* Cabecera */}
      <rect x="2" y="4" width="18" height="52" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.8"/>
      <Vetas color={c.veta} opacity={0.2}/>
      {/* Pie de cama */}
      <rect x="80" y="20" width="18" height="36" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.8"/>
      {/* Base */}
      <rect x="20" y="32" width="60" height="24" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
      {/* Colchon */}
      <rect x="20" y="20" width="60" height="14" rx="2" fill="#e8e0d0" stroke="#b0a888" strokeWidth="0.5" opacity="0.8"/>
      {/* Almohadas */}
      <rect x="24" y="22" width="18" height="8" rx="2" fill="white" opacity="0.6" stroke="#ccc" strokeWidth="0.4"/>
      <rect x="46" y="22" width="18" height="8" rx="2" fill="white" opacity="0.6" stroke="#ccc" strokeWidth="0.4"/>
      {/* Patas */}
      <rect x="20" y="56" width="4" height="10" rx="1" fill={c.stroke}/>
      <rect x="76" y="56" width="4" height="10" rx="1" fill={c.stroke}/>
      {/* Detalle cabecera */}
      <rect x="5" y="8" width="12" height="32" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.6" opacity="0.5"/>
    </svg>
  )
}

// MESA
export function MesaSVG({ material, acabado, extras = [] }) {
  const c = getColor(material, acabado)
  return (
    <svg viewBox="0 0 90 70" className="w-full h-full">
      {/* Tablero */}
      <rect x="2" y="16" width="86" height="10" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.8"/>
      <rect x="2" y="16" width="86" height="10" rx="1" fill="none" stroke={c.stroke} strokeWidth="0.4" opacity="0.4"/>
      {/* Vetas en tablero */}
      <line x1="2" y1="19" x2="88" y2="19" stroke={c.veta} strokeWidth="0.5" opacity="0.4"/>
      <line x1="2" y1="22" x2="88" y2="22" stroke={c.veta} strokeWidth="0.5" opacity="0.3"/>
      {/* Patas */}
      <rect x="8"  y="26" width="5" height="38" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
      <rect x="77" y="26" width="5" height="38" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
      <rect x="20" y="26" width="4" height="28" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" opacity="0.8"/>
      <rect x="66" y="26" width="4" height="28" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.6" opacity="0.8"/>
      {/* Travesano */}
      <rect x="8" y="48" width="74" height="3" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.5" opacity="0.6"/>
    </svg>
  )
}

// ESTANTE
export function EstanteSVG({ material, acabado, extras = [] }) {
  const c = getColor(material, acabado)
  return (
    <svg viewBox="0 0 80 90" className="w-full h-full">
      {/* Laterales */}
      <rect x="2"  y="2" width="6" height="86" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
      <rect x="72" y="2" width="6" height="86" rx="1" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
      {/* Repisas */}
      {[2, 24, 46, 68].map((y, i) => (
        <g key={i}>
          <rect x="2" y={y} width="76" height="5" rx="0.5" fill={c.fill} stroke={c.stroke} strokeWidth="0.7"/>
          <line x1="2" y1={y+2} x2="78" y2={y+2} stroke={c.veta} strokeWidth="0.4" opacity="0.3"/>
        </g>
      ))}
      {/* Fondo */}
      <rect x="8" y="2" width="64" height="84" rx="0" fill={c.stroke} opacity="0.2"/>
      {/* Objetos decorativos en repisas */}
      <rect x="12" y="12" width="8" height="10" rx="0.5" fill={c.stroke} opacity="0.3"/>
      <rect x="22" y="14" width="6" height="8" rx="0.5" fill={c.stroke} opacity="0.25"/>
      <rect x="14" y="34" width="10" height="10" rx="0.5" fill={c.stroke} opacity="0.3"/>
      <rect x="50" y="56" width="8" height="10" rx="0.5" fill={c.stroke} opacity="0.25"/>
    </svg>
  )
}

// Mapa de componentes por tipo
export const MUEBLE_SVG = {
  es_puerta:  PuertaSVG,
  es_closet:  ClosetSVG,
  es_cocina:  CocinaSVG,
  es_cama:    CamaSVG,
  es_mesa:    MesaSVG,
  es_estante: EstanteSVG,
}
