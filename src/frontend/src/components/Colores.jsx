// Colores.jsx — Catalogo completo migrado del diseño Figma a React JS
import { useState } from 'react'
import { Droplet, Sparkles, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Datos centralizados, no hardcoded en JSX
const COLORS = [
  { name:'Blanco Nieve',     hex:'#ffffff', family:'pintados',   finishes:['lacado','pintado'], durability:90,  shine:95  },
  { name:'Marfil',           hex:'#f5f3ef', family:'pintados',   finishes:['lacado','pintado'], durability:90,  shine:85  },
  { name:'Gris Perla',       hex:'#d4d4d4', family:'pintados',   finishes:['lacado','pintado'], durability:85,  shine:80  },
  { name:'Gris Grafito',     hex:'#6b6b6b', family:'pintados',   finishes:['lacado','pintado'], durability:90,  shine:90  },
  { name:'Negro Profundo',   hex:'#1a1208', family:'pintados',   finishes:['lacado','pintado'], durability:95,  shine:100 },
  { name:'Azul Noche',       hex:'#1e3a5f', family:'pintados',   finishes:['lacado','pintado'], durability:85,  shine:85  },
  { name:'Verde Bosque',     hex:'#2d5016', family:'pintados',   finishes:['lacado','pintado'], durability:85,  shine:80  },
  { name:'Terracota',        hex:'#a0522d', family:'pintados',   finishes:['pintado'],          durability:80,  shine:60  },
  { name:'Roble Natural',    hex:'#d4a574', family:'maderas',    finishes:['barniz'],           durability:95,  shine:70  },
  { name:'Miel',             hex:'#c8943a', family:'maderas',    finishes:['barniz'],           durability:90,  shine:75  },
  { name:'Nogal',            hex:'#5c4033', family:'maderas',    finishes:['barniz'],           durability:100, shine:65  },
  { name:'Caoba',            hex:'#8b4513', family:'maderas',    finishes:['barniz'],           durability:95,  shine:70  },
  { name:'Cerezo',           hex:'#9e4638', family:'maderas',    finishes:['barniz'],           durability:90,  shine:65  },
  { name:'Wengue',           hex:'#3d2817', family:'maderas',    finishes:['barniz'],           durability:100, shine:80  },
  { name:'Oro Antiguo',      hex:'#c8943a', family:'especiales', finishes:['lacado'],           durability:75,  shine:100 },
  { name:'Cobre Pulido',     hex:'#b87333', family:'especiales', finishes:['lacado'],           durability:70,  shine:95  },
  { name:'Plata Lunar',      hex:'#c0c0c0', family:'especiales', finishes:['lacado'],           durability:80,  shine:100 },
]

export default function Colores() {
  const [family, setFamily]   = useState('all')
  const [picked, setPicked]   = useState(null)
  const nav = useNavigate()

  const filtered = family === 'all' ? COLORS : COLORS.filter(c => c.family === family)

  const families = [
    { id:'all',        name:'Todos',      count: COLORS.length },
    { id:'pintados',   name:'Pintados',   count: COLORS.filter(c => c.family === 'pintados').length },
    { id:'maderas',    name:'Maderas',    count: COLORS.filter(c => c.family === 'maderas').length },
    { id:'especiales', name:'Especiales', count: COLORS.filter(c => c.family === 'especiales').length },
  ]

  return (
    <div className="bg-[#f5f3ef] min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-['Barlow_Condensed'] font-black text-6xl text-[#1a1208] mb-4">Catalogo de Colores</h1>
          <p className="text-[#1a1208]/60 text-lg max-w-2xl">
            Explora nuestra paleta completa de colores y acabados. Cada color esta diseñado para resaltar la belleza natural de la madera.
          </p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          {families.map(f => (
            <button key={f.id} onClick={() => setFamily(f.id)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300
                ${family === f.id ? 'border-[#c8943a] bg-[#c8943a] text-[#1a1208]' : 'border-[#1a1208]/20 text-[#1a1208] hover:border-[#c8943a]'}`}>
              {f.name} <span className="font-['IBM_Plex_Mono'] text-xs ml-2">({f.count})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Grid de colores */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(c => (
              <button key={c.name} onClick={() => setPicked(c)}
                className={`group bg-white p-6 rounded transition-all duration-300 border-t-4
                  ${picked?.name === c.name ? 'border-[#c8943a] shadow-xl' : 'border-transparent hover:border-[#c8943a]/50'}`}>
                <div className="w-full aspect-square rounded-lg mb-4 border-2 border-[#1a1208]/10 transition-all duration-300 group-hover:scale-105"
                  style={{backgroundColor:c.hex}}/>
                <h3 className="font-['Barlow_Condensed'] font-black text-xl text-[#1a1208] mb-2">{c.name}</h3>
                <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase">{c.hex}</div>
              </button>
            ))}
          </div>

          {/* Panel de detalle */}
          {picked && (
            <div className="sticky top-24 self-start">
              <div className="bg-white rounded-lg overflow-hidden border border-[#1a1208]/10">
                <div className="h-48 border-b border-[#1a1208]/10" style={{backgroundColor: picked.hex}}/>
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="font-['Barlow_Condensed'] font-black text-4xl text-[#1a1208] mb-2">{picked.name}</h2>
                    <div className="font-['IBM_Plex_Mono'] text-sm text-[#1a1208]/60 uppercase tracking-wider">{picked.family}</div>
                  </div>

                  {/* Barras de durabilidad y brillo */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-4 h-4 text-[#c8943a]"/>
                        <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">Durabilidad</span>
                      </div>
                      <div className="h-2 bg-[#1a1208]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c8943a] transition-all duration-500" style={{width: `${picked.durability}%`}}/>
                      </div>
                      <div className="text-right text-sm text-[#1a1208]/60 mt-1">{picked.durability}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#c8943a]"/>
                        <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">Brillo</span>
                      </div>
                      <div className="h-2 bg-[#1a1208]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c8943a] transition-all duration-500" style={{width: `${picked.shine}%`}}/>
                      </div>
                      <div className="text-right text-sm text-[#1a1208]/60 mt-1">{picked.shine}%</div>
                    </div>
                  </div>

                  {/* Tipos de acabado */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-4 h-4 text-[#c8943a]"/>
                      <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">Tipos de acabado</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {picked.finishes.map(f => (
                        <span key={f} className="px-3 py-1 bg-[#1a1208] text-[#c8943a] rounded-full text-sm font-['IBM_Plex_Mono'] uppercase">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1a1208]/10">
                    <button onClick={() => nav('/cotizador')}
                      className="w-full bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] py-3 rounded font-semibold transition-colors">
                      Cotizar con este Color
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
