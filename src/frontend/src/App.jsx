import { useState, useRef } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Search, Check, Download, RotateCcw, ChevronDown, MessageCircle, Clock, AlertTriangle } from 'lucide-react'
import { useCotizador } from './hooks/useCotizador'
import { generarPDF } from './components/GenerarPDF'
import Landing from './pages/Landing'
import Proyectos from './pages/Proyectos'
import {
  NEGOCIO, TIPOS, MATERIALES, ACABADOS, EXTRAS,
  EXTRAS_NO_APLICAN, TIPO_LABELS, MATERIAL_LABELS, ACABADO_LABELS,
} from './config/constants'

// ─── TEXTURAS CSS por material ────────────────────────────────────
const TEXTURAS = {
  material_mdf:     'repeating-linear-gradient(45deg,#d4c4a8 0px,#d4c4a8 2px,#c9b89d 2px,#c9b89d 4px)',
  material_triplex: 'repeating-linear-gradient(0deg,#b8a080 0px,#b8a080 8px,#a89070 8px,#a89070 10px,#b8a080 10px,#b8a080 18px)',
  material_solida:  'repeating-linear-gradient(90deg,#8b6f47 0px,#8b6f47 3px,#74563a 3px,#74563a 4px,#8b6f47 4px,#8b6f47 8px,#9d7f52 8px,#9d7f52 12px)',
  material_pino:    'radial-gradient(circle at 30% 40%,#6b5739 0px,#6b5739 4px,transparent 4px),repeating-linear-gradient(90deg,#d4a574 0px,#d4a574 5px,#c99564 5px,#c99564 6px)',
}

// ─── COLORES por material ─────────────────────────────────────────
const COLORES = {
  material_mdf: [
    {n:'Blanco',h:'#ffffff'},{n:'Marfil',h:'#f5f3ef'},{n:'Gris Claro',h:'#d4d4d4'},
    {n:'Gris Oscuro',h:'#6b6b6b'},{n:'Negro',h:'#1a1208'},{n:'Azul Noche',h:'#1e3a5f'},
    {n:'Verde Bosque',h:'#2d5016'},{n:'Terracota',h:'#a0522d'},
  ],
  material_triplex: [
    {n:'Natural',h:'#d4a574'},{n:'Miel',h:'#c8943a'},{n:'Nogal',h:'#5c4033'},
    {n:'Caoba',h:'#8b4513'},{n:'Cerezo',h:'#9e4638'},{n:'Roble',h:'#b8860b'},
  ],
  material_solida: [
    {n:'Natural',h:'#8b6f47'},{n:'Miel',h:'#c8943a'},{n:'Nogal',h:'#5c4033'},
    {n:'Caoba',h:'#722f37'},{n:'Wengue',h:'#3d2817'},{n:'Roble Claro',h:'#b8860b'},
  ],
  material_pino: [
    {n:'Natural',h:'#d4a574'},{n:'Barniz Claro',h:'#e4b584'},{n:'Miel',h:'#c8943a'},
    {n:'Nogal',h:'#8b6f47'},{n:'Castano',h:'#6b5739'},
  ],
}

// ─── COLORES pagina ───────────────────────────────────────────────
import Colores from './components/Colores'
import Herrajes from './components/Herrajes'
import Extractores from './components/Extractores'

// ─── LAYOUT ──────────────────────────────────────────────────────
function Layout({ children }) {
  const location = useLocation()
  const navLinks = [
    {to:'/cotizador',label:'Cotizador'},{to:'/colores',label:'Colores'},
    {to:'/herrajes',label:'Herrajes'},{to:'/extractores',label:'Extractores'},
    {to:'/proyectos',label:'Proyectos'},
  ]
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3ef]">
      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-[#f5f3ef] border-b border-[#1a1208]/10">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-['Barlow_Condensed'] font-black text-2xl text-[#1a1208]">MADERAS</span>
            <span className="font-['Barlow_Condensed'] font-black text-2xl text-[#c8943a]">GERARDO</span>
          </Link>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1208]/40"/>
            <input placeholder="Buscar productos, materiales..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1208]/10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#c8943a]"/>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[{l:'Experiencia',v:'+25 anos'},{l:'Proyectos',v:'+500'},{l:'Reglas SBC',v:'40'}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60 uppercase tracking-wider">{s.l}</div>
                <div className="font-['Barlow_Condensed'] font-black text-xl text-[#1a1208]">{s.v}</div>
              </div>
            ))}
          </div>
          <Link to="/cotizador" className="bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] px-6 py-2.5 rounded font-semibold transition-all">
            Cotizar Ahora
          </Link>
        </div>
      </header>

      {/* Navbar oscuro — solo en paginas interiores */}
      {location.pathname !== '/' && (
        <nav className="bg-[#1a1208] border-b border-white/10">
          <div className="max-w-[1600px] mx-auto px-8 flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`py-4 font-medium transition-all border-b-2 text-sm
                  ${location.pathname === l.to ? 'text-[#c8943a] border-[#c8943a]' : 'text-[#f5f3ef] border-transparent hover:text-[#c8943a]'}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1a1208] text-[#f5f3ef] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 py-12 grid grid-cols-3 gap-12">
          <div>
            <div className="flex flex-col leading-none mb-6">
              <span className="font-['Barlow_Condensed'] font-black text-3xl text-white">MADERAS</span>
              <span className="font-['Barlow_Condensed'] font-black text-3xl text-[#c8943a]">GERARDO</span>
            </div>
            <p className="text-sm text-[#f5f3ef]/70 leading-relaxed">
              Taller artesanal de carpinteria premium en Bogota desde 1998. Especialistas en muebles a medida.
            </p>
          </div>
          <div>
            <h4 className="font-['Barlow_Condensed'] font-black text-lg mb-4 text-white">Servicios</h4>
            <ul className="space-y-2 text-sm text-[#f5f3ef]/70">
              {navLinks.map(l=><li key={l.to}><Link to={l.to} className="hover:text-[#c8943a] transition-colors">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-['Barlow_Condensed'] font-black text-lg mb-4 text-white">Contacto</h4>
            <div className="space-y-2 text-sm text-[#f5f3ef]/70">
              <p>{NEGOCIO.ciudad}</p>
              <p>WhatsApp: +{NEGOCIO.whatsapp}</p>
              <p className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] mt-4 uppercase tracking-wider">
                Lun - Vie: 8am - 6pm<br/>Sab: 9am - 2pm
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs text-[#f5f3ef]/40 font-['IBM_Plex_Mono'] uppercase tracking-wider">
          © 2026 {NEGOCIO.nombre} · Est. {NEGOCIO.desde} · Inteligencia Artificial II — Munoz & Girata
        </div>
      </footer>
    </div>
  )
}

// ─── MUEBLE SVG ───────────────────────────────────────────────────
function MuebleSVG({ tipo, fill = '#c8a060', selected = false }) {
  const s = selected ? '#c8943a' : '#8a6030'
  if (tipo === 'es_puerta') return (
    <svg width="70" height="90" viewBox="0 0 40 50" fill="none">
      <rect x="2" y="1" width="36" height="48" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="5" y="5" width="30" height="19" fill="none" stroke={s} strokeWidth=".7" opacity=".5"/>
      <rect x="5" y="27" width="30" height="19" fill="none" stroke={s} strokeWidth=".7" opacity=".5"/>
      <circle cx="33" cy="25" r="2" fill={s}/>
    </svg>
  )
  if (tipo === 'es_closet') return (
    <svg width="90" height="80" viewBox="0 0 50 45" fill="none">
      <rect x="1" y="3" width="48" height="40" fill={fill} stroke={s} strokeWidth="1.2"/>
      <line x1="25" y1="3" x2="25" y2="43" stroke={s} strokeWidth="1.2"/>
      <rect x="3" y="6" width="20" height="24" fill="none" stroke={s} strokeWidth=".7" opacity=".4"/>
      <rect x="27" y="6" width="20" height="24" fill="none" stroke={s} strokeWidth=".7" opacity=".4"/>
      <circle cx="22" cy="18" r="1.5" fill={s}/><circle cx="28" cy="18" r="1.5" fill={s}/>
      <rect x="3" y="33" width="20" height="8" fill="none" stroke={s} strokeWidth=".6" opacity=".4"/>
      <rect x="27" y="33" width="20" height="8" fill="none" stroke={s} strokeWidth=".6" opacity=".4"/>
    </svg>
  )
  if (tipo === 'es_cocina') return (
    <svg width="110" height="80" viewBox="0 0 60 45" fill="none">
      <rect x="1" y="3" width="58" height="16" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="1" y="24" width="58" height="18" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="1" y="19" width="58" height="5" fill={s} opacity=".25"/>
      <line x1="20" y1="24" x2="20" y2="42" stroke={s} strokeWidth="1"/>
      <line x1="40" y1="24" x2="40" y2="42" stroke={s} strokeWidth="1"/>
      <rect x="3" y="5" width="26" height="12" fill="none" stroke={s} strokeWidth=".6" opacity=".4"/>
      <rect x="31" y="5" width="26" height="12" fill="none" stroke={s} strokeWidth=".6" opacity=".4"/>
    </svg>
  )
  if (tipo === 'es_cama') return (
    <svg width="110" height="70" viewBox="0 0 60 38" fill="none">
      <rect x="1" y="5" width="10" height="28" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="49" y="14" width="10" height="19" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="11" y="17" width="38" height="16" fill={fill} stroke={s} strokeWidth="1"/>
      <rect x="11" y="8" width="38" height="11" fill="#e8e0d0" stroke={s} strokeWidth=".6" opacity=".8"/>
      <rect x="13" y="9" width="14" height="8" fill="white" opacity=".7"/>
      <rect x="30" y="9" width="14" height="8" fill="white" opacity=".7"/>
    </svg>
  )
  if (tipo === 'es_mesa') return (
    <svg width="100" height="70" viewBox="0 0 55 38" fill="none">
      <rect x="1" y="10" width="53" height="6" fill={fill} stroke={s} strokeWidth="1.2"/>
      <rect x="4" y="16" width="5" height="20" fill={fill} stroke={s} strokeWidth="1"/>
      <rect x="46" y="16" width="5" height="20" fill={fill} stroke={s} strokeWidth="1"/>
      <rect x="13" y="16" width="4" height="14" fill={fill} stroke={s} strokeWidth=".8"/>
      <rect x="38" y="16" width="4" height="14" fill={fill} stroke={s} strokeWidth=".8"/>
      <rect x="4" y="28" width="47" height="3" fill={fill} stroke={s} strokeWidth=".6" opacity=".7"/>
    </svg>
  )
  return (
    <svg width="70" height="90" viewBox="0 0 38 52" fill="none">
      <rect x="1" y="1" width="5" height="50" fill={fill} stroke={s} strokeWidth="1"/>
      <rect x="32" y="1" width="5" height="50" fill={fill} stroke={s} strokeWidth="1"/>
      {[1,12,23,34,44].map(y => <rect key={y} x="1" y={y} width="36" height="5" fill={fill} stroke={s} strokeWidth="1"/>)}
    </svg>
  )
}

// ─── COTIZADOR PAGE ───────────────────────────────────────────────
function CotizadorPage() {
  const {
    seleccion, resultado, cargando, error, historial,
    extrasDisponibles, advertenciasCombinacion,
    setTipo, setMaterial, setAcabado, toggleExtra,
    cotizar, resetear,
  } = useCotizador()

  const [color,     setColor]     = useState(null)
  const [colorName, setColorName] = useState('')
  const [techOpen,  setTechOpen]  = useState(false)
  const resultRef = useRef()

  const previewBg = seleccion.material && color
    ? `${TEXTURAS[seleccion.material]}, ${color}`
    : seleccion.material
    ? TEXTURAS[seleccion.material]
    : '#f5f3ef'

  const colores = seleccion.material ? COLORES[seleccion.material] || [] : []

  const handleCotizar = async () => {
    await cotizar()
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth' }), 300)
  }

  return (
    <div className="bg-[#f5f3ef] min-h-screen">
      <div className="max-w-[1800px] mx-auto p-8">
        <div className="grid gap-8 items-start" style={{gridTemplateColumns:'200px 1fr 280px'}}>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4 sticky top-24">
            <div className="bg-white p-4 rounded border border-[#1a1208]/10">
              <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/50 uppercase tracking-wider mb-3">Seleccion actual</div>
              {[
                {l:'Tipo',     v: seleccion.tipo     ? TIPO_LABELS[seleccion.tipo]         : null },
                {l:'Material', v: seleccion.material  ? MATERIAL_LABELS[seleccion.material] : null },
                {l:'Color',    v: colorName || null },
                {l:'Acabado',  v: seleccion.acabado   ? ACABADO_LABELS[seleccion.acabado]   : null },
              ].map(({l,v}) => (
                <div key={l} className="mb-3">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase">{l}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {v && <Check className="w-3 h-3 text-[#c8943a]"/>}
                    <span className={`text-sm ${v ? 'text-[#1a1208] font-medium' : 'text-[#1a1208]/25'}`}>{v || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
            {resultado && (
              <div className="bg-[#1a1208] p-4 rounded">
                <div className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider mb-2">Resultado</div>
                <div className="font-['Barlow_Condensed'] font-black text-2xl text-white mb-1">{resultado.precio_rango}</div>
                <div className="font-['IBM_Plex_Mono'] text-xs text-white/50">{resultado.tiempo_entrega?.label}</div>
              </div>
            )}
            {historial.length > 0 && (
              <div className="bg-white p-4 rounded border border-[#1a1208]/10">
                <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider mb-3">Historial</div>
                {historial.slice(0,4).map(h => (
                  <div key={h.id} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-['Barlow_Condensed'] font-bold text-xs text-[#1a1208] uppercase">{TIPO_LABELS[h.tipo]} — {MATERIAL_LABELS[h.material]}</p>
                      <p className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40">{h.ts}</p>
                    </div>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a]">{h.precio}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CENTRO ── */}
          <div className="space-y-8">

            {/* PASO 01 — TIPO */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider">Paso 01 · Tipo de trabajo</span>
                <div className="flex-1 h-px bg-[#1a1208]/10"/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {TIPOS.map(t => {
                  const sel = seleccion.tipo === t.id
                  return (
                    <button key={t.id} onClick={() => { setTipo(t.id); setColor(null); setColorName('') }}
                      className={`relative bg-white p-5 rounded border-t-4 text-left transition-all duration-300
                        ${sel ? 'border-[#c8943a] shadow-lg shadow-[#c8943a]/10' : 'border-transparent hover:border-[#c8943a]/40'}`}>
                      {sel && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#c8943a] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white"/>
                        </div>
                      )}
                      <div className="h-28 bg-[#f5f3ef] rounded mb-4 flex items-center justify-center">
                        <MuebleSVG tipo={t.id} fill={sel && color ? color : sel ? '#c8943a' : '#d4b896'} selected={sel}/>
                      </div>
                      <h4 className={`font-['Barlow_Condensed'] font-black text-xl mb-1 ${sel ? 'text-[#c8943a]' : 'text-[#1a1208]'}`}>{t.label}</h4>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* VISUALIZADOR */}
            {seleccion.tipo && (
              <div className="relative bg-[#1a1208] rounded-lg overflow-hidden" style={{minHeight:420}}>
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(245,243,239,0.1) 2px,rgba(245,243,239,0.1) 4px)',
                  animation:'grain 20s linear infinite',
                }}/>
                <div className="relative z-10 flex items-center justify-center p-12" style={{minHeight:420}}>
                  <div className="relative">
                    <div className="transition-all duration-700" style={{
                      width: seleccion.tipo==='es_puerta'?180:seleccion.tipo==='es_cocina'||seleccion.tipo==='es_cama'?380:280,
                      height: seleccion.tipo==='es_puerta'?340:seleccion.tipo==='es_estante'?380:seleccion.tipo==='es_cama'?220:280,
                      background: seleccion.material ? previewBg : 'transparent',
                      border: seleccion.material ? 'none' : '3px solid #c8943a',
                      borderRadius:4, position:'relative', overflow:'hidden',
                    }}>
                      {/* Detalles internos */}
                      {seleccion.material && (
                        <div style={{position:'absolute',inset:0}}>
                          {seleccion.tipo==='es_puerta' && <>
                            <div style={{position:'absolute',top:'8%',left:'7%',right:'7%',height:'38%',border:'1px solid rgba(0,0,0,0.12)',background:'rgba(255,255,255,0.12)'}}/>
                            <div style={{position:'absolute',top:'52%',left:'7%',right:'7%',bottom:'5%',border:'1px solid rgba(0,0,0,0.12)',background:'rgba(255,255,255,0.12)'}}/>
                            <div style={{position:'absolute',right:'12%',top:'47%',width:14,height:14,borderRadius:'50%',background:'rgba(0,0,0,0.25)'}}/>
                          </>}
                          {seleccion.tipo==='es_closet' && <>
                            <div style={{position:'absolute',inset:'0 50% 0 0',borderRight:'2px solid rgba(0,0,0,0.15)'}}/>
                            <div style={{position:'absolute',top:'6%',left:'4%',width:'44%',height:'55%',border:'1px solid rgba(0,0,0,0.1)',background:'rgba(255,255,255,0.1)'}}/>
                            <div style={{position:'absolute',top:'6%',right:'4%',width:'44%',height:'55%',border:'1px solid rgba(0,0,0,0.1)',background:'rgba(255,255,255,0.1)'}}/>
                            <div style={{position:'absolute',top:'65%',left:'4%',width:'44%',bottom:'4%',border:'1px solid rgba(0,0,0,0.1)',background:'rgba(0,0,0,0.1)'}}/>
                            <div style={{position:'absolute',top:'65%',right:'4%',width:'44%',bottom:'4%',border:'1px solid rgba(0,0,0,0.1)',background:'rgba(0,0,0,0.1)'}}/>
                          </>}
                          {!seleccion.material && (
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <span style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:3,textTransform:'uppercase'}}>Elige un material</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Anotaciones */}
                    {seleccion.material && (
                      <div style={{position:'absolute',right:'-180px',top:30,display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:60,height:1,borderTop:'2px dashed rgba(200,148,58,0.5)'}}/>
                        <span style={{fontFamily:'monospace',fontSize:10,color:'#c8943a'}}>{MATERIAL_LABELS[seleccion.material]}</span>
                      </div>
                    )}
                    {color && (
                      <div style={{position:'absolute',right:'-180px',top:60,display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:60,height:1,borderTop:'2px dashed rgba(200,148,58,0.5)'}}/>
                        <div style={{width:10,height:10,borderRadius:'50%',background:color,border:'1px solid rgba(255,255,255,0.3)'}}/>
                        <span style={{fontFamily:'monospace',fontSize:10,color:'#c8943a'}}>{colorName}</span>
                      </div>
                    )}
                    {seleccion.acabado && (
                      <div style={{position:'absolute',right:'-180px',top:90,display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:60,height:1,borderTop:'2px dashed rgba(200,148,58,0.5)'}}/>
                        <span style={{fontFamily:'monospace',fontSize:10,color:'#c8943a'}}>{ACABADO_LABELS[seleccion.acabado]}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{position:'absolute',bottom:12,left:0,right:0,textAlign:'center'}}>
                  <span style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.25)',letterSpacing:3,textTransform:'uppercase'}}>
                    {[TIPO_LABELS[seleccion.tipo], MATERIAL_LABELS[seleccion.material], colorName, ACABADO_LABELS[seleccion.acabado]].filter(Boolean).join('  ·  ') || 'Configurando...'}
                  </span>
                </div>
              </div>
            )}

            {/* PASO 02 — MATERIAL */}
            {seleccion.tipo && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider">Paso 02 · Material</span>
                  <div className="flex-1 h-px bg-[#1a1208]/10"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {MATERIALES.map(m => {
                    const sel = seleccion.material === m.id
                    return (
                      <button key={m.id} onClick={() => { setMaterial(m.id); setColor(null); setColorName('') }}
                        className={`bg-white p-5 rounded border-t-4 text-left flex items-center gap-4 transition-all duration-300
                          ${sel ? 'border-[#c8943a] shadow-lg shadow-[#c8943a]/10' : 'border-transparent hover:border-[#c8943a]/40'}`}>
                        <div className="w-20 h-20 rounded border border-[#1a1208]/10 flex-shrink-0" style={{background:TEXTURAS[m.id]}}/>
                        <div className="flex-1">
                          <h4 className={`font-['Barlow_Condensed'] font-black text-xl mb-1 ${sel ? 'text-[#c8943a]' : 'text-[#1a1208]'}`}>{m.label}</h4>
                          <p className="text-xs text-[#1a1208]/50">{m.desc}</p>
                        </div>
                        {sel && <Check className="w-5 h-5 text-[#c8943a] flex-shrink-0"/>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* PASO 03 — COLOR */}
            {seleccion.material && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider">Paso 03 · Color y tono</span>
                  <div className="flex-1 h-px bg-[#1a1208]/10"/>
                </div>
                <div className="bg-white p-6 rounded">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {colores.map(c => (
                      <button key={c.h} onClick={() => { setColor(c.h); setColorName(c.n) }} title={c.n} className="group relative">
                        <div className={`w-12 h-12 rounded-full border-2 transition-all duration-300
                          ${color===c.h ? 'border-[#1a1208] ring-4 ring-[#c8943a] scale-110' : 'border-[#1a1208]/20 hover:border-[#c8943a] hover:scale-105'}`}
                          style={{background:c.h}}/>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#1a1208]/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-['IBM_Plex_Mono']">
                          {c.n}
                        </span>
                      </button>
                    ))}
                  </div>
                  {colorName && (
                    <div className="flex items-center gap-2 mt-8 pt-4 border-t border-[#1a1208]/5">
                      <div className="w-4 h-4 rounded border border-[#1a1208]/20" style={{background:color}}/>
                      <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/60">{colorName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PASO 04 — ACABADO + EXTRAS */}
            {color && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider">Paso 04 · Acabado y detalles</span>
                  <div className="flex-1 h-px bg-[#1a1208]/10"/>
                </div>
                <div className="bg-white p-6 rounded space-y-6">
                  {/* Acabados */}
                  <div className="grid grid-cols-4 gap-3">
                    {ACABADOS.map(a => {
                      const sel = seleccion.acabado === a.id
                      return (
                        <button key={a.id} onClick={() => setAcabado(a.id)}
                          className={`p-3 rounded border-t-4 text-center transition-all duration-200
                            ${sel ? 'border-[#c8943a] bg-[#fdf8f0]' : 'border-transparent bg-[#f5f3ef] hover:border-[#c8943a]/40'}`}>
                          <div className={`font-['Barlow_Condensed'] font-black text-sm mb-1 ${sel ? 'text-[#c8943a]' : 'text-[#1a1208]'}`}>{a.label}</div>
                          <div className="text-xs text-[#1a1208]/40">{a.desc}</div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Extras */}
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider mb-3">Extras opcionales</div>
                    {advertenciasCombinacion.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {advertenciasCombinacion.map((w,i) => (
                          <div key={i} className="flex gap-2 items-start p-3 bg-amber-50 border-l-4 border-amber-400">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
                            <p className="text-xs text-amber-800">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {EXTRAS.filter(e => !extrasDisponibles.includes(e.id)).map(e => {
                        const sel = seleccion.extras.includes(e.id)
                        return (
                          <button key={e.id} onClick={() => toggleExtra(e.id)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200
                              ${sel ? 'border-[#c8943a] bg-[#c8943a] text-[#1a1208]' : 'border-[#1a1208]/15 text-[#1a1208]/70 hover:border-[#c8943a]'}`}>
                            {e.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-['IBM_Plex_Mono']">{error}</div>}
                  <button onClick={handleCotizar} disabled={cargando}
                    className="w-full bg-[#c8943a] hover:bg-[#b8843a] disabled:opacity-40 text-[#1a1208] py-4 rounded font-['Barlow_Condensed'] font-black text-lg tracking-widest uppercase transition-all">
                    {cargando ? 'Procesando motor de inferencia...' : 'Generar Cotizacion'}
                  </button>
                </div>
              </div>
            )}

            {/* RESULTADO */}
            {resultado && (
              <div ref={resultRef} className="bg-white rounded border-t-4 border-[#c8943a] overflow-hidden">
                <div className="bg-[#1a1208] px-6 py-4 flex items-center justify-between">
                  <span className="font-['Barlow_Condensed'] font-black text-lg text-white uppercase tracking-wide">Resultado del sistema experto</span>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#c8943a] uppercase tracking-wider">Motor SBC — 40 reglas</span>
                </div>
                <div className="p-6 border-b border-[#1a1208]/10 bg-[#fdf8f4]">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider mb-2">Precio estimado</div>
                  <div className="font-['Barlow_Condensed'] font-black text-5xl text-[#1a1208] mb-2">{resultado.precio_rango}</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-[#1a1208]/40"/>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40">Entrega: {resultado.tiempo_entrega?.label}</span>
                  </div>
                </div>
                {[...resultado.advertencias||[], ...resultado.advertencias_combinacion||[]].map((w,i) => (
                  <div key={i} className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-amber-800">{w}</p>
                  </div>
                ))}
                <div className="p-6 border-b border-[#1a1208]/10">
                  <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider mb-4">Desglose</div>
                  {[['Materiales',resultado.desglose?.materiales],['Mano de obra',resultado.desglose?.mano_obra],['Acabado',resultado.desglose?.acabado],['Extras / inst.',resultado.desglose?.extras]].map(([l,v])=>(
                    <div key={l} className="flex justify-between text-sm mb-2">
                      <span className="text-[#1a1208]/50">{l}</span>
                      <span className="text-[#1a1208] font-medium font-['IBM_Plex_Mono']">${v?.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-[#1a1208]/10">
                    <span className="font-['Barlow_Condensed'] font-bold text-[#1a1208] uppercase tracking-wide">Total estimado</span>
                    <span className="font-['Barlow_Condensed'] font-black text-xl text-[#c8943a]">{resultado.precio_rango}</span>
                  </div>
                </div>
                <div className="p-6 border-b border-[#1a1208]/10">
                  <button onClick={() => setTechOpen(!techOpen)}
                    className="w-full flex items-center justify-between text-[#1a1208]/50 hover:text-[#1a1208] transition-colors">
                    <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider">Explicacion tecnica — Motor de inferencia</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${techOpen ? 'rotate-180' : ''}`}/>
                  </button>
                  {techOpen && (
                    <div className="mt-4 space-y-2">
                      {resultado.reglas_detalle?.slice(0,8).map(r => (
                        <div key={r.id} className="p-3 bg-[#f5f3ef] rounded text-xs font-['IBM_Plex_Mono'] leading-relaxed">
                          <span className="text-[#8a5020]">SI </span>
                          <span className="text-[#1a1208]/70">{r.condiciones?.join(' AND ') || r.nombre}</span>
                          <span className="text-[#8a5020]"> ENTONCES </span>
                          <span className="text-[#1a1208]/70">{r.nombre}</span>
                          <span className="text-[#c8943a]"> (CF: {(r.certeza/100).toFixed(2)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <a href={resultado.whatsapp_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1da554] text-white py-3 rounded font-semibold transition-colors">
                    <MessageCircle className="w-4 h-4"/>Enviar por WhatsApp a Gerardo
                  </a>
                  <button onClick={() => generarPDF(resultado, seleccion)}
                    className="flex items-center justify-center gap-2 w-full bg-[#c8943a] hover:bg-[#b8843a] text-[#1a1208] py-3 rounded font-semibold transition-colors">
                    <Download className="w-4 h-4"/>Descargar PDF
                  </button>
                  <button onClick={resetear}
                    className="flex items-center justify-center gap-2 w-full bg-[#1a1208]/5 hover:bg-[#1a1208]/10 text-[#1a1208] py-3 rounded font-medium transition-colors">
                    <RotateCcw className="w-4 h-4"/>Nueva cotizacion
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── PANEL DERECHO ── */}
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#c8943a] text-[#1a1208] px-4 py-2.5 rounded-t font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider font-medium">
              Tu cotizacion — Sistema experto
            </div>
            <div className="bg-white rounded-b border border-[#1a1208]/10 overflow-hidden">
              <div className="h-40 transition-all duration-700" style={{background: seleccion.material ? previewBg : '#f5f3ef'}}>
                {!seleccion.tipo && (
                  <div className="h-full flex items-center justify-center">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/25 uppercase tracking-wider">Elige un tipo</span>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                {[
                  {l:'Tipo',     v: seleccion.tipo     ? TIPO_LABELS[seleccion.tipo]         : null},
                  {l:'Material', v: seleccion.material  ? MATERIAL_LABELS[seleccion.material] : null},
                  {l:'Color',    v: colorName || null},
                  {l:'Acabado',  v: seleccion.acabado   ? ACABADO_LABELS[seleccion.acabado]   : null},
                  {l:'Extras',   v: seleccion.extras.length > 0 ? `${seleccion.extras.length} seleccionados` : null},
                ].map(({l,v}) => (
                  <div key={l} className="flex justify-between items-center border-b border-[#1a1208]/5 pb-2">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase">{l}</span>
                    <span className={`text-sm font-medium ${v ? 'text-[#1a1208]' : 'text-[#1a1208]/20'}`}>{v || '—'}</span>
                  </div>
                ))}
                {resultado ? (
                  <div className="pt-2">
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 uppercase tracking-wider mb-1">Precio estimado</div>
                    <div className="font-['Barlow_Condensed'] font-black text-3xl text-[#1a1208]">{resultado.precio_rango}</div>
                    <div className="font-['IBM_Plex_Mono'] text-xs text-[#1a1208]/40 mt-1">{resultado.tiempo_entrega?.label}</div>
                    <a href={resultado.whatsapp_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1da554] text-white py-2.5 rounded font-medium transition-colors mt-4 text-sm">
                      <MessageCircle className="w-4 h-4"/>Contactar por WhatsApp
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-[#1a1208]/25 text-center font-['IBM_Plex_Mono'] pt-2">
                    {cargando ? 'Procesando...' : 'Completa los pasos para ver la cotizacion'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes grain{0%{transform:translateX(0)}100%{transform:translateX(4px)}}`}</style>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"            element={<Landing/>}/>
          <Route path="/cotizador"   element={<CotizadorPage/>}/>
          <Route path="/colores"     element={<Colores/>}/>
          <Route path="/herrajes"    element={<Herrajes/>}/>
          <Route path="/extractores" element={<Extractores/>}/>
          <Route path="/proyectos"   element={<Proyectos/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
