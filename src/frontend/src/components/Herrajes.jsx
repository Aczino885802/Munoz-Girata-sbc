// Herrajes.jsx — Catalogo completo migrado del diseño Figma a React JS
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

const HERRAJES = [
  { name:'Bisagra Concealed Premium', category:'bisagras',   brand:'Blum',         reference:'BC-110',  price:12500,  colors:['Niquel','Negro'],            description:'Bisagra de cazoleta con cierre suave, apertura 110°' },
  { name:'Bisagra Piano Continua',    category:'bisagras',   brand:'Hafele',       reference:'BP-1800', price:45000,  colors:['Niquel','Bronce'],           description:'Bisagra continua de alta resistencia, 1.8m' },
  { name:'Bisagra Invisible',         category:'bisagras',   brand:'Soss',         reference:'SI-208',  price:85000,  colors:['Niquel'],                    description:'Bisagra oculta de alta gama, carga 36kg' },
  { name:'Corredera Telescopica',     category:'correderas', brand:'Blum Tandem',  reference:'CT-550',  price:95000,  colors:['Plata'],                     description:'Extension total con freno, carga 65kg' },
  { name:'Corredera Basica',          category:'correderas', brand:'Hafele',       reference:'CB-400',  price:18000,  colors:['Blanco','Gris'],             description:'Extension parcial, carga 25kg' },
  { name:'Corredera Push-Open',       category:'correderas', brand:'Grass',        reference:'PO-500',  price:125000, colors:['Plata'],                     description:'Apertura por presion, cierre suave' },
  { name:'Manija Barra Recta',        category:'manijas',    brand:'Hafele Design',reference:'MBR-320', price:28000,  colors:['Acero','Negro Mate','Dorado'], description:'Barra de 320mm, diseño minimalista' },
  { name:'Manija Empotrada',          category:'manijas',    brand:'Sugatsune',    reference:'ME-80',   price:45000,  colors:['Acero','Negro'],             description:'Manija empotrada de alta precision' },
  { name:'Manija Cuero Premium',      category:'manijas',    brand:'Turnstyle',    reference:'MCP-160', price:95000,  colors:['Caramelo','Negro','Gris'],   description:'Cuero genuino con estructura de acero' },
  { name:'Riel Sliding Superior',     category:'rieles',     brand:'Hettich',      reference:'RSS-2400',price:185000, colors:['Aluminio'],                  description:'Sistema superior para puertas corredizas, 2.4m' },
  { name:'Riel Granero Industrial',   category:'rieles',     brand:'Design Forge', reference:'RGI-3000',price:320000, colors:['Negro Mate','Hierro'],       description:'Estilo granero con ruedas visibles, carga 90kg' },
]

// SVG tecnico por categoria — separado para limpieza
function SVGHerraje({ cat }) {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32 relative z-10">
      {cat === 'bisagras' && <>
        <rect x="40" y="60" width="60" height="80" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <circle cx="70" cy="100" r="8" fill="#c8943a"/>
        <rect x="100" y="60" width="60" height="80" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <circle cx="130" cy="100" r="8" fill="#c8943a"/>
        <line x1="100" y1="70" x2="100" y2="130" stroke="#c8943a" strokeWidth="3"/>
      </>}
      {cat === 'correderas' && <>
        <rect x="30" y="80" width="140" height="40" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <circle cx="60" cy="100" r="6" fill="#c8943a"/>
        <circle cx="100" cy="100" r="6" fill="#c8943a"/>
        <circle cx="140" cy="100" r="6" fill="#c8943a"/>
        <path d="M 30 90 L 50 90 M 120 90 L 170 90" stroke="#c8943a" strokeWidth="2"/>
      </>}
      {cat === 'manijas' && <>
        <rect x="60" y="90" width="80" height="20" rx="10" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <line x1="60" y1="100" x2="50" y2="100" stroke="#c8943a" strokeWidth="2"/>
        <line x1="140" y1="100" x2="150" y2="100" stroke="#c8943a" strokeWidth="2"/>
        <circle cx="50" cy="100" r="3" fill="#c8943a"/>
        <circle cx="150" cy="100" r="3" fill="#c8943a"/>
      </>}
      {cat === 'rieles' && <>
        <line x1="20" y1="80" x2="180" y2="80" stroke="#c8943a" strokeWidth="3"/>
        <rect x="70" y="65" width="60" height="30" fill="none" stroke="#c8943a" strokeWidth="2"/>
        <circle cx="85" cy="80" r="8" fill="#c8943a"/>
        <circle cx="115" cy="80" r="8" fill="#c8943a"/>
        <line x1="70" y1="95" x2="70" y2="140" stroke="#c8943a" strokeWidth="2"/>
        <line x1="130" y1="95" x2="130" y2="140" stroke="#c8943a" strokeWidth="2"/>
      </>}
    </svg>
  )
}

export default function Herrajes() {
  const [cat,   setCat]   = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => HERRAJES.filter(h => {
    const matchCat   = cat === 'all' || h.category === cat
    const matchQuery = !query ||
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.brand.toLowerCase().includes(query.toLowerCase()) ||
      h.reference.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  }), [cat, query])

  const categories = [
    { id:'all',        name:'Todos',      count: HERRAJES.length },
    { id:'bisagras',   name:'Bisagras',   count: HERRAJES.filter(h => h.category === 'bisagras').length },
    { id:'correderas', name:'Correderas', count: HERRAJES.filter(h => h.category === 'correderas').length },
    { id:'manijas',    name:'Manijas',    count: HERRAJES.filter(h => h.category === 'manijas').length },
    { id:'rieles',     name:'Rieles',     count: HERRAJES.filter(h => h.category === 'rieles').length },
  ]

  return (
    <div className="bg-[#f5f3ef] min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-['Barlow_Condensed'] font-black text-6xl text-[#1a1208] mb-4">Catalogo de Herrajes</h1>
          <p className="text-[#1a1208]/60 text-lg max-w-2xl">
            Herrajes premium de marcas reconocidas mundialmente. Precision, durabilidad y diseño excepcional.
          </p>
        </div>

        {/* Buscador + filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1208]/40"/>
            <input type="text" placeholder="Buscar por nombre, marca o referencia..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#1a1208]/10 rounded focus:outline-none focus:ring-2 focus:ring-[#c8943a] transition-all"/>
          </div>
          <div className="flex gap-4 flex-wrap">
            {categories.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`px-6 py-3 rounded-full border-2 transition-all duration-300
                  ${cat === c.id ? 'border-[#c8943a] bg-[#c8943a] text-[#1a1208]' : 'border-[#1a1208]/20 text-[#1a1208] hover:border-[#c8943a]'}`}>
                {c.name} <span className="font-['IBM_Plex_Mono'] text-xs ml-2">({c.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <div key={h.reference} className="bg-white rounded-lg overflow-hidden border border-[#1a1208]/10 hover:border-[#c8943a] transition-all duration-300">
              <div className="h-48 bg-[#1a1208] flex items-center justify-center border-b border-[#1a1208]/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage:'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245,243,239,0.1) 2px, rgba(245,243,239,0.1) 4px)',
                }}/>
                <SVGHerraje cat={h.category}/>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider mb-2">{h.brand} · {h.reference}</div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-2xl text-[#1a1208] mb-2">{h.name}</h3>
                  <p className="text-sm text-[#1a1208]/60 leading-relaxed">{h.description}</p>
                </div>
                <div className="mb-4">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase mb-2">Colores</div>
                  <div className="flex gap-2 flex-wrap">
                    {h.colors.map(c => (
                      <span key={c} className="px-3 py-1 bg-[#1a1208]/5 text-[#1a1208] rounded text-xs">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1a1208]/10">
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase">Referencia</div>
                    <div className="font-['Barlow_Condensed'] font-black text-2xl text-[#c8943a]">${h.price.toLocaleString()}</div>
                  </div>
                  <button className="bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] px-4 py-2 rounded font-medium transition-colors text-sm">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#1a1208]/40 text-lg">No se encontraron herrajes con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  )
}
