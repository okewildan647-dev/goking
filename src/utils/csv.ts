export function downloadCsv(filename: string, rows: Array<Array<string | number>>): void {
  const content = rows
    .map(row =>
      row
        .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\r\n')

  const blob = new Blob([`\uFEFF${content}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
