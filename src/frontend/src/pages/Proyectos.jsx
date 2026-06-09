import { useState } from 'react'
import { X } from 'lucide-react'

const PROJECTS = [
  { id:1, title:'Cocina Integral Moderna Chapinero', type:'cocina', material:'MDF Lacado Blanco', year:2024, location:'Chapinero, Bogota', image:'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', description:'Cocina integral con isla central, acabados en blanco lacado mate, herrajes Blum y cubierta en cuarzo.' },
  { id:2, title:'Closet Walk-in Rosales', type:'closet', material:'Madera Solida Nogal', year:2024, location:'Rosales, Bogota', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', description:'Vestier completo en madera de nogal con acabado barniz natural e iluminacion LED integrada.' },
  { id:3, title:'Biblioteca Empotrada Usaquen', type:'estante', material:'Roble Natural', year:2023, location:'Usaquen, Bogota', image:'https://images.unsplash.com/photo-1544379166-7ff2ee45d3d3?w=800&h=600&fit=crop', description:'Biblioteca de piso a techo en roble natural con escalera corrediza y sistema de rieles ocultos.' },
  { id:4, title:'Escritorio Ejecutivo Zona G', type:'escritorio', material:'Nogal + Acero', year:2024, location:'Zona G, Bogota', image:'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop', description:'Escritorio minimalista con cubierta en nogal macizo y estructura en acero negro mate.' },
  { id:5, title:'Puertas Interiores Casa Campestre', type:'puerta', material:'Pino Castano', year:2023, location:'La Calera', image:'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&h=600&fit=crop', description:'Conjunto de 8 puertas en pino macizo con acabado castano, herrajes de bronce y diseno rustico premium.' },
  { id:6, title:'Cama King + Mesas de Noche', type:'cama', material:'Madera Solida + Tapizado', year:2024, location:'Santa Barbara, Bogota', image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop', description:'Juego de alcoba king con cabecera tapizada y estructura en madera maciza.' },
  { id:7, title:'Cocina Lineal Cedro Golf', type:'cocina', material:'Triplex Cerezo', year:2023, location:'Cedro Golf, Bogota', image:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop', description:'Cocina lineal de 4.2m en triplex con acabado cerezo y campana chimenea.' },
  { id:8, title:'Closet Juvenil Chico', type:'closet', material:'MDF Gris + Roble', year:2024, location:'Chico, Bogota', image:'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop', description:'Closet modular con combinacion de MDF lacado gris y detalles en roble natural.' },
  { id:9, title:'Estanteria Industrial Galerias', type:'estante', material:'Pino + Hierro', year:2023, location:'Galerias, Bogota', image:'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', description:'Sistema modular de repisas en pino natural con estructura de hierro negro estilo industrial.' },
]

const TYPES = [
  {id:'all',label:'Todos'},{id:'cocina',label:'Cocinas'},{id:'closet',label:'Closets'},
  {id:'estante',label:'Estantes'},{id:'escritorio',label:'Escritorios'},{id:'cama',label:'Camas'},{id:'puerta',label:'Puertas'},
]

export default function Proyectos() {
  const [tipo, setTipo] = useState('all')
  const [selected, setSelected] = useState(null)
  const filtered = tipo === 'all' ? PROJECTS : PROJECTS.filter(p => p.type === tipo)

  return (
    <div className="bg-[#f5f3ef] min-h-screen py-12">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-['Barlow_Condensed'] font-black text-6xl text-[#1a1208] mb-4">Proyectos Realizados</h1>
          <p className="text-[#1a1208]/60 text-lg max-w-2xl">
            Mas de 500 proyectos completados en 25 anos. Cada pieza cuenta una historia de precision artesanal.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setTipo(t.id)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium
                ${tipo === t.id ? 'border-[#c8943a] bg-[#c8943a] text-[#1a1208]' : 'border-[#1a1208]/20 text-[#1a1208] hover:border-[#c8943a]'}`}>
              {t.label}
              <span className="font-['IBM_Plex_Mono'] text-xs ml-2 opacity-60">
                ({tipo==='all'||t.id==='all' ? (t.id==='all'?PROJECTS.length:PROJECTS.filter(p=>p.type===t.id).length) : PROJECTS.filter(p=>p.type===t.id).length})
              </span>
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p)}
              className="break-inside-avoid bg-white rounded-lg overflow-hidden border border-[#1a1208]/10 hover:border-[#c8943a] transition-all duration-300 cursor-pointer group">
              <div className="relative overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208] via-transparent to-transparent opacity-60"/>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider mb-2">{p.type} · {p.year}</div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-2xl text-white">{p.title}</h3>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between text-sm">
                <span className="text-[#1a1208]/60">{p.material}</span>
                <span className="text-[#1a1208]/60">{p.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-[#1a1208]/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image} alt={selected.title} className="w-full h-96 object-cover"/>
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#c8943a] transition-colors group">
                <X className="w-5 h-5 text-[#1a1208] group-hover:text-white"/>
              </button>
            </div>
            <div className="p-8">
              <div className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider mb-2">{selected.type} · {selected.year}</div>
              <h2 className="font-['Barlow_Condensed'] font-black text-4xl text-[#1a1208] mb-4">{selected.title}</h2>
              <p className="text-lg text-[#1a1208]/80 leading-relaxed mb-6">{selected.description}</p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase mb-2">Material</div>
                  <div className="text-[#1a1208] font-medium">{selected.material}</div>
                </div>
                <div>
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase mb-2">Ubicacion</div>
                  <div className="text-[#1a1208] font-medium">{selected.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
