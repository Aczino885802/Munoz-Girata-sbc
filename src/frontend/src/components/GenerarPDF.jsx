// GenerarPDF.jsx
// Genera un PDF profesional de la cotizacion con logo y desglose

export function generarPDF(resultado, seleccion) {
  // Importacion dinamica para no cargar jsPDF si no se usa
  import('jspdf').then(({ jsPDF }) => {
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W    = 210
    const marL = 20
    const marR = 20
    let y      = 0

    // Colores
    const DARK  = [18,  13,  5  ]
    const WOOD  = [160, 100, 40 ]
    const LIGHT = [242, 232, 208]
    const GRAY  = [80,  60,  40 ]

    // Fondo oscuro header
    doc.setFillColor(...DARK)
    doc.rect(0, 0, W, 45, 'F')

    // Linea decorativa
    doc.setDrawColor(...WOOD)
    doc.setLineWidth(0.5)
    doc.line(marL, 44, W - marR, 44)

    // Nombre del taller
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.setTextColor(...LIGHT)
    doc.text('MADERAS', marL, 20)
    doc.setTextColor(...WOOD)
    doc.text('GERARDO', marL + 52, 20)

    // Subtitulo
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('COTIZACION ESTIMADA  —  SISTEMA EXPERTO DE CARPINTERIA', marL, 28)

    // Fecha
    const fecha = new Date().toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' })
    doc.setFontSize(7)
    doc.text(fecha.toUpperCase(), W - marR, 28, { align: 'right' })

    // Numero de cotizacion
    doc.text(`COT-${Date.now().toString().slice(-6)}`, W - marR, 35, { align: 'right' })

    y = 58

    // PRECIO PRINCIPAL
    doc.setFillColor(26, 19, 8)
    doc.rect(marL, y, W - marL - marR, 28, 'F')
    doc.setDrawColor(...WOOD)
    doc.setLineWidth(0.3)
    doc.rect(marL, y, W - marL - marR, 28, 'D')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...WOOD)
    doc.text((resultado.precio_label || '').toUpperCase(), marL + 6, y + 8)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(...LIGHT)
    doc.text(resultado.precio_rango || '—', marL + 6, y + 20)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('Estimado basado en tipo, material, acabado y condiciones del trabajo.', marL + 6, y + 26)

    y += 36

    // DESGLOSE
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...WOOD)
    doc.text('DESGLOSE ESTIMADO', marL, y)
    y += 4
    doc.setDrawColor(...WOOD)
    doc.line(marL, y, W - marR, y)
    y += 6

    const rows = [
      ['Materiales',             resultado.desglose?.materiales],
      ['Mano de obra',           resultado.desglose?.mano_obra ],
      ['Acabado',                resultado.desglose?.acabado   ],
      ['Extras / instalacion',   resultado.desglose?.extras    ],
    ]

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    rows.forEach(([label, val]) => {
      doc.setTextColor(...GRAY)
      doc.text(label, marL, y)
      doc.setTextColor(...LIGHT)
      doc.text(`$${Number(val || 0).toLocaleString()}`, W - marR, y, { align: 'right' })
      y += 7
    })

    doc.setDrawColor(...WOOD)
    doc.line(marL, y, W - marR, y)
    y += 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...LIGHT)
    doc.text('TOTAL ESTIMADO', marL, y)
    doc.setTextColor(...WOOD)
    doc.text(resultado.precio_rango || '—', W - marR, y, { align: 'right' })

    y += 14

    // ADVERTENCIAS
    if (resultado.advertencias?.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...WOOD)
      doc.text('CONSIDERACIONES', marL, y)
      y += 4
      doc.setDrawColor(...WOOD)
      doc.line(marL, y, W - marR, y)
      y += 6

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
      resultado.advertencias.forEach(adv => {
        doc.text(`• ${adv}`, marL + 3, y)
        y += 6
      })
      y += 4
    }

    // REGLAS APLICADAS
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...WOOD)
    doc.text('RAZONAMIENTO DEL SISTEMA EXPERTO', marL, y)
    y += 4
    doc.line(marL, y, W - marR, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    resultado.reglas_detalle?.forEach(r => {
      doc.setTextColor(...WOOD)
      doc.text(`[${r.id}]`, marL, y)
      doc.setTextColor(...LIGHT)
      doc.text(r.nombre, marL + 12, y)
      doc.setTextColor(...GRAY)
      doc.text(`CF: ${(r.certeza/100).toFixed(2)}`, W - marR, y, { align: 'right' })
      y += 5
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(...GRAY)
      const lines = doc.splitTextToSize(r.explicacion, W - marL - marR - 10)
      doc.text(lines, marL + 4, y)
      y += lines.length * 4.5 + 2
      doc.setFont('helvetica', 'normal')
    })

    // FOOTER DEL PDF
    y = 270
    doc.setFillColor(...DARK)
    doc.rect(0, y, W, 30, 'F')
    doc.setDrawColor(...WOOD)
    doc.line(0, y, W, y)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('Esta cotizacion es un estimado basado en el sistema experto de Maderas Gerardo.', marL, y + 8)
    doc.text('Los precios finales pueden variar segun medidas exactas, disponibilidad de materiales y visita tecnica.', marL, y + 14)
    doc.text('MADERAS GERARDO  |  Sistema Experto  |  Munoz - Girata  |  2026', marL, y + 22)

    doc.save(`Cotizacion_MaderasGerardo_${Date.now().toString().slice(-6)}.pdf`)
  })
}
