// Extractores.jsx — Catalogo completo migrado del diseño Figma a React JS
import { CheckCircle } from 'lucide-react'

const EXTRACTORES = [
  { key:'slim',     name:'Slim Hood Pro',         brand:'Teka',     width:60, extraction:850,  noise:52, price:1850000, compatible:['Cocina Integral','Modulo Superior'],         features:['LED integrado','Panel tactil','3 velocidades','Filtro metalico'] },
  { key:'island',   name:'Island Hood Premium',   brand:'Franke',   width:90, extraction:1200, noise:58, price:3450000, compatible:['Cocina Isla','Cocina Abierta'],              features:['Suspension acero','Control remoto','Iluminacion LED perimetral','Campana decorativa'] },
  { key:'cabinet',  name:'Cabinet Hood Classic',  brand:'Bosch',    width:60, extraction:650,  noise:48, price:1250000, compatible:['Cocina Integral','Modulo Superior','Cocina Empotrada'], features:['Instalacion oculta','Silencioso','Bajo consumo','Filtro carbono'] },
  { key:'wall',     name:'Wall Chimney Designer', brand:'Elica',    width:90, extraction:1100, noise:55, price:2950000, compatible:['Cocina Lineal','Cocina en L'],               features:['Diseño chimenea','Acero inoxidable','Iluminacion halogena','Filtros lavables'] },
  { key:'downdraft',name:'Downdraft Integrado',   brand:'Gaggenau', width:80, extraction:950,  noise:51, price:4750000, compatible:['Cocina Isla','Cocina Moderna'],              features:['Extraccion descendente','Elevacion automatica','Sistema oculto','Ultra premium'] },
  { key:'compact',  name:'Compact Hood Basic',    brand:'Haceb',    width:60, extraction:550,  noise:60, price:850000,  compatible:['Cocina Integral','Modulo Superior'],         features:['Economico','Instalacion facil','Filtro aluminio','Iluminacion basica'] },
]

// SVG tecnico por modelo
function SVGExtractor({ k }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full relative z-10 px-12">
      {k === 'slim' && <>
        <rect x="80" y="80" width="140" height="30" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="85" y="85" width="130" height="20" fill="none" stroke="#c8943a" strokeWidth="1"/>
        <circle cx="100" cy="95" r="2" fill="#c8943a"/>
        <circle cx="120" cy="95" r="2" fill="#c8943a"/>
        <circle cx="140" cy="95" r="2" fill="#c8943a"/>
        <rect x="90" y="110" width="30" height="3" fill="#c8943a" opacity="0.5"/>
        <rect x="135" y="110" width="30" height="3" fill="#c8943a" opacity="0.5"/>
      </>}
      {k === 'island' && <>
        <rect x="100" y="20" width="100" height="8" fill="#c8943a"/>
        <rect x="110" y="28" width="80" height="60" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="120" y="88" width="60" height="80" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <line x1="130" y1="100" x2="170" y2="100" stroke="#c8943a" strokeWidth="1"/>
        <line x1="130" y1="110" x2="170" y2="110" stroke="#c8943a" strokeWidth="1"/>
        <line x1="130" y1="120" x2="170" y2="120" stroke="#c8943a" strokeWidth="1"/>
      </>}
      {k === 'cabinet' && <>
        <rect x="80" y="60" width="140" height="100" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="90" y="130" width="120" height="25" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <line x1="100" y1="140" x2="180" y2="140" stroke="#c8943a" strokeWidth="1"/>
        <line x1="100" y1="145" x2="180" y2="145" stroke="#c8943a" strokeWidth="1"/>
        <circle cx="195" cy="142" r="3" fill="#c8943a"/>
      </>}
      {k === 'wall' && <>
        <rect x="120" y="30" width="60" height="50" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <path d="M 110 80 L 120 80 L 140 130 L 160 130 L 180 80 L 190 80" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="140" y="130" width="20" height="30" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <line x1="145" y1="140" x2="155" y2="140" stroke="#c8943a" strokeWidth="1"/>
      </>}
      {k === 'downdraft' && <>
        <rect x="100" y="120" width="100" height="15" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="110" y="125" width="80" height="8" fill="#c8943a" opacity="0.3"/>
        <path d="M 130 115 L 130 125" stroke="#c8943a" strokeWidth="2" markerEnd="url(#arrow)"/>
        <path d="M 150 115 L 150 125" stroke="#c8943a" strokeWidth="2" markerEnd="url(#arrow)"/>
        <path d="M 170 115 L 170 125" stroke="#c8943a" strokeWidth="2" markerEnd="url(#arrow)"/>
      </>}
      {k === 'compact' && <>
        <rect x="90" y="90" width="120" height="40" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <rect x="100" y="100" width="100" height="20" fill="none" stroke="#c8943a" strokeWidth="1"/>
        <circle cx="195" cy="110" r="4" fill="#c8943a"/>
      </>}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#c8943a"/>
        </marker>
      </defs>
    </svg>
  )
}

export default function Extractores() {
  return (
    <div className="bg-[#f5f3ef] min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-['Barlow_Condensed'] font-black text-6xl text-[#1a1208] mb-4">Extractores de Cocina</h1>
          <p className="text-[#1a1208]/60 text-lg max-w-2xl">
            Extractores compatibles con nuestras cocinas integrales. Seleccion curada de marcas premium con especificaciones tecnicas verificadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EXTRACTORES.map(e => (
            <div key={e.key} className="bg-white rounded-lg overflow-hidden border border-[#1a1208]/10 hover:border-[#c8943a] transition-all duration-300">
              {/* SVG con grain animado */}
              <div className="h-64 bg-[#1a1208] flex items-center justify-center border-b border-[#1a1208]/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage:'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245,243,239,0.1) 2px, rgba(245,243,239,0.1) 4px)',
                }}/>
                <SVGExtractor k={e.key}/>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider mb-2">{e.brand}</div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-3xl text-[#1a1208] mb-4">{e.name}</h3>
                </div>

                {/* Specs grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { val: `${e.width}cm`,        unit: 'Ancho' },
                    { val: `${e.extraction}`,     unit: 'm³/h' },
                    { val: `${e.noise}`,          unit: 'dB' },
                  ].map((s,i) => (
                    <div key={i} className="text-center p-4 bg-[#f5f3ef] rounded">
                      <div className="font-['Barlow_Condensed'] font-black text-3xl text-[#1a1208] mb-1">{s.val}</div>
                      <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">{s.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Compatibilidad */}
                <div className="mb-6">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase mb-2">Compatible con</div>
                  <div className="flex flex-wrap gap-2">
                    {e.compatible.map((c,i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 border border-green-300 text-green-800 rounded text-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/>{c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Caracteristicas */}
                <div className="mb-6">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase mb-2">Caracteristicas</div>
                  <ul className="space-y-1">
                    {e.features.map((f,i) => (
                      <li key={i} className="text-sm text-[#1a1208]/80 flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#c8943a] rounded-full"/>{f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Precio + CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-[#1a1208]/10">
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">Precio referencia</div>
                    <div className="font-['Barlow_Condensed'] font-black text-3xl text-[#c8943a]">${e.price.toLocaleString()}</div>
                  </div>
                  <button className="bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] px-6 py-3 rounded font-semibold transition-colors">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
