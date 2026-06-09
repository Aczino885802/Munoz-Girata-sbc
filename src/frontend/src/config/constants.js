// config/constants.js
// Todas las constantes del frontend en un solo lugar
// Si algo cambia, se cambia aqui y se refleja en toda la app

export const NEGOCIO = {
  nombre:    'Maderas Gerardo',
  whatsapp:  '573012593219',
  ciudad:    'Bogota, Colombia',
  desde:     1998,
  proyectos: '+500',
  garantia:  '100%',
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const TIPOS = [
  { id: 'es_puerta',  label: 'Puerta'          },
  { id: 'es_closet',  label: 'Closet'          },
  { id: 'es_cocina',  label: 'Cocina'          },
  { id: 'es_cama',    label: 'Cama'            },
  { id: 'es_mesa',    label: 'Mesa'            },
  { id: 'es_estante', label: 'Estante'         },
]

export const MATERIALES = [
  { id: 'material_mdf',     label: 'MDF',          desc: 'Economico',  color: '#d4b896' },
  { id: 'material_triplex', label: 'Triplex',       desc: 'Resistente', color: '#c0a060' },
  { id: 'material_solida',  label: 'Madera solida', desc: 'Premium',    color: '#5a2808' },
  { id: 'material_pino',    label: 'Pino',          desc: 'Natural',    color: '#e0c080' },
]

export const ACABADOS = [
  { id: 'acabado_natural', label: 'Natural', desc: 'Sin trat.'    },
  { id: 'acabado_lacado',  label: 'Lacado',  desc: 'Brillante'   },
  { id: 'acabado_barniz',  label: 'Barniz',  desc: 'Resalta veta' },
  { id: 'acabado_pintado', label: 'Pintado', desc: 'Esmalte'     },
]

export const EXTRAS = [
  { id: 'tiene_cajones',        label: 'Cajones'            },
  { id: 'tiene_vidrio',         label: 'Vidrio'             },
  { id: 'tiene_espejo',         label: 'Espejo'             },
  { id: 'puertas_corredizas',   label: 'Puertas corredizas' },
  { id: 'es_empotrado',         label: 'Empotrado'          },
  { id: 'es_urgente',           label: 'Urgente < 7 dias'   },
  { id: 'requiere_instalacion', label: 'Instalacion'        },
  { id: 'fuera_de_ciudad',      label: 'Fuera ciudad'       },
]

// Extras que no aplican segun tipo — misma logica que el backend
export const EXTRAS_NO_APLICAN = {
  es_puerta:  ['tiene_cajones', 'puertas_corredizas'],
  es_mesa:    ['puertas_corredizas', 'tiene_espejo'],
  es_estante: ['puertas_corredizas', 'tiene_espejo'],
  es_cama:    ['puertas_corredizas'],
}

// Advertencias de combinacion — misma logica que el backend
export const ADVERTENCIAS_COMBINACION = {
  'material_mdf+acabado_barniz':      'El barniz no resalta bien en MDF. Se recomienda lacado o pintado.',
  'material_triplex+acabado_barniz':  'El barniz en triplex da resultado irregular. Se recomienda pintado.',
  'es_cocina+material_mdf':           'El MDF en cocinas puede deteriorarse con humedad. Considere MDF lacado.',
  'es_puerta+material_mdf':           'Las puertas en MDF requieren marco solido. Verifique uso interior/exterior.',
}

export const TIPO_LABELS    = Object.fromEntries(TIPOS.map(t => [t.id, t.label]))
export const MATERIAL_LABELS = Object.fromEntries(MATERIALES.map(m => [m.id, m.label]))
export const ACABADO_LABELS  = Object.fromEntries(ACABADOS.map(a => [a.id, a.label]))
export const EXTRA_LABELS    = Object.fromEntries(EXTRAS.map(e => [e.id, e.label]))

// Estilos compartidos — evitar repeticion en componentes
export const STYLES = {
  surface:  { background: '#fff', border: '1px solid #e8e0d0' },
  secHdr:   { padding: '9px 14px', background: '#f5f3ef', borderBottom: '1px solid #e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  secTitle: { fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: '#1a1208' },
  secStep:  { fontFamily: 'IBM Plex Mono,monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#c8943a', textTransform: 'uppercase' },
  topbar:   { background: '#1a1208', padding: '5px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nav:      { background: '#2a1a08', height: 36, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 2 },
}

export const COLORS = {
  primary:    '#c8943a',
  dark:       '#1a1208',
  surface:    '#fff',
  bg:         '#f5f3ef',
  border:     '#e8e0d0',
  textMuted:  '#8a7050',
  textDark:   '#3a2810',
}
