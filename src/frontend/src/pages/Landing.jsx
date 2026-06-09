import { Link } from 'react-router-dom'
import { Ruler, Award, Settings, Clock } from 'lucide-react'

const WHY_US = [
  { icon: Ruler,    title: 'Precision Artesanal',  desc: 'Cada pieza medida y cortada con precision milimetrica combinando tecnologia con tecnicas tradicionales de carpinteria.' },
  { icon: Award,    title: 'Materiales Premium',   desc: 'Maderas seleccionadas, MDF de alta densidad y acabados certificados que garantizan durabilidad y belleza.' },
  { icon: Settings, title: 'Sistema Experto',      desc: 'Motor de cotizacion con 40 reglas de produccion para garantizar combinaciones optimas de material, acabado y herrajes.' },
  { icon: Clock,    title: 'Entrega Garantizada',  desc: 'Tiempos de fabricacion calculados con precision. Instalacion profesional incluida en Bogota y alrededores.' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero oscuro */}
      <section className="relative bg-[#1a1208] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(245,243,239,0.1) 2px,rgba(245,243,239,0.1) 4px)',
          animation:'grain 20s linear infinite',
        }}/>
        <div className="relative max-w-[1600px] mx-auto px-8 py-32">
          <div className="text-center mb-16">
            <h1 className="font-['Barlow_Condensed'] font-black text-[clamp(4rem,12vw,10rem)] leading-[0.9] mb-4">
              <span className="block text-white">MADERAS</span>
              <span className="block text-[#c8943a]">GERARDO</span>
            </h1>
            <p className="text-[#f5f3ef]/80 text-xl max-w-2xl mx-auto mt-8">
              Taller artesanal de carpinteria premium. Muebles a medida con acabados de lujo desde 1998.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
            {[{n:'+25',l:'Anos de experiencia'},{n:'+500',l:'Proyectos completados'},{n:'40',l:'Reglas de produccion'}].map(s=>(
              <div key={s.n} className="text-center p-6 border border-white/10 rounded">
                <div className="font-['Barlow_Condensed'] font-black text-5xl text-[#c8943a] mb-2">{s.n}</div>
                <div className="font-['IBM_Plex_Mono'] text-xs text-[#f5f3ef]/60 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/cotizador" className="inline-block bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] px-12 py-4 rounded font-semibold text-lg transition-all duration-300">
              Cotizar Mi Proyecto
            </Link>
          </div>
        </div>
        <nav className="border-t border-white/10 bg-[#1a1208]/50">
          <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-center gap-8">
            {['/cotizador','/colores','/herrajes','/extractores','/proyectos'].map((p,i)=>(
              <Link key={p} to={p} className="py-4 text-[#f5f3ef] hover:text-[#c8943a] transition-colors font-medium">
                {['Cotizador','Colores','Herrajes','Extractores','Proyectos'][i]}
              </Link>
            ))}
          </div>
        </nav>
      </section>

      {/* Por que elegirnos */}
      <section className="bg-[#f5f3ef] py-24">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="font-['Barlow_Condensed'] font-black text-5xl text-[#1a1208] text-center mb-4">Por Que Elegirnos</h2>
          <p className="text-center text-[#1a1208]/60 mb-16 max-w-2xl mx-auto">
            Combinamos tradicion artesanal con tecnologia moderna para crear muebles excepcionales
          </p>
          <div className="grid grid-cols-4 gap-6">
            {WHY_US.map((c,i)=>(
              <div key={i} className="bg-white p-8 rounded border-t-4 border-transparent hover:border-[#c8943a] transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#1a1208] rounded flex items-center justify-center mb-6 group-hover:bg-[#c8943a] transition-all duration-300">
                  <c.icon className="w-7 h-7 text-[#c8943a] group-hover:text-[#1a1208]"/>
                </div>
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl text-[#1a1208] mb-3">{c.title}</h3>
                <p className="text-[#1a1208]/70 leading-relaxed text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`@keyframes grain{0%{transform:translateX(0)}100%{transform:translateX(4px)}}`}</style>
    </div>
  )
}
