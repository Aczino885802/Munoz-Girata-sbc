// useCotizador.js - Hook de estado del cotizador
import { useState, useCallback, useMemo } from 'react'
import {
  EXTRAS_NO_APLICAN,
  ADVERTENCIAS_COMBINACION,
  API_URL,
} from '../config/constants'

const INITIAL = { tipo: '', material: '', acabado: '', extras: [] }

export function useCotizador() {
  const [seleccion, setSeleccion] = useState(INITIAL)
  const [resultado, setResultado] = useState(null)
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState('')
  const [historial, setHistorial] = useState([])

  // Extras disponibles segun tipo seleccionado
  const extrasDisponibles = useMemo(() => {
    const noAplican = EXTRAS_NO_APLICAN[seleccion.tipo] || []
    return noAplican
  }, [seleccion.tipo])

  // Advertencias de combinacion en tiempo real (sin esperar al backend)
  const advertenciasCombinacion = useMemo(() => {
    const msgs = []
    const claves = [
      `${seleccion.material}+${seleccion.acabado}`,
      `${seleccion.tipo}+${seleccion.material}`,
    ]
    claves.forEach(k => {
      if (ADVERTENCIAS_COMBINACION[k]) msgs.push(ADVERTENCIAS_COMBINACION[k])
    })
    return msgs
  }, [seleccion.tipo, seleccion.material, seleccion.acabado])

  const setTipo = useCallback(v => {
    setSeleccion(s => {
      // Limpiar extras que no aplican al nuevo tipo
      const noAplican = EXTRAS_NO_APLICAN[v] || []
      const extrasLimpios = s.extras.filter(e => !noAplican.includes(e))
      return { ...s, tipo: v, extras: extrasLimpios }
    })
    setResultado(null)
  }, [])

  const setMaterial = useCallback(v => {
    setSeleccion(s => ({ ...s, material: v }))
    setResultado(null)
  }, [])

  const setAcabado = useCallback(v => {
    setSeleccion(s => ({ ...s, acabado: v }))
    setResultado(null)
  }, [])

  const toggleExtra = useCallback(v => {
    setSeleccion(s => ({
      ...s,
      extras: s.extras.includes(v)
        ? s.extras.filter(e => e !== v)
        : [...s.extras, v],
    }))
  }, [])

  const cotizar = useCallback(async () => {
    if (!seleccion.tipo || !seleccion.material) {
      setError('Selecciona el tipo de trabajo y el material para continuar.')
      return
    }
    setError('')
    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/api/cotizar`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          tipo_mueble: seleccion.tipo,
          material:    seleccion.material,
          acabado:     seleccion.acabado,
          extras:      seleccion.extras,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error del servidor')
      }

      const data = await res.json()
      setResultado(data)

      setHistorial(h => [{
        tipo:     seleccion.tipo,
        material: seleccion.material,
        acabado:  seleccion.acabado,
        precio:   data.precio_rango,
        color:    data.precio_color,
        tiempo:   data.tiempo_entrega?.label,
        ts:       new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        id:       Date.now(),
      }, ...h].slice(0, 8))

    } catch (e) {
      setError(e.message || 'Error de conexion. Verifica que el servidor este corriendo.')
    } finally {
      setCargando(false)
    }
  }, [seleccion])

  const resetear = useCallback(() => {
    setSeleccion(INITIAL)
    setResultado(null)
    setError('')
  }, [])

  return {
    seleccion, resultado, cargando, error, historial,
    extrasDisponibles, advertenciasCombinacion,
    setTipo, setMaterial, setAcabado, toggleExtra,
    cotizar, resetear,
  }
}
