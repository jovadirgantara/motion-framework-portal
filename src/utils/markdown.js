// Minimal markdown-to-HTML renderer for framework content bodies.
// Supports: **bold**, `inline code`, ``` code blocks, | tables |, - lists, > blockquotes, \n paragraphs.
// Not a full parser — handles the subset used in framework-components.json.

export function renderMarkdown(text) {
  if (!text) return ''

  let html = text

  // Fenced code blocks
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<pre><code>${escaped.trim()}</code></pre>`
  })

  // Tables (simple: lines with | ... |)
  html = html.replace(/((?:\|.+\|\n?)+)/g, (match) => {
    const rows = match.trim().split('\n').filter(r => r.trim())
    let tableHtml = '<table>'
    rows.forEach((row, i) => {
      if (row.match(/^\|[-| ]+\|$/)) return // separator row
      const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1)
      const tag = i === 0 ? 'th' : 'td'
      tableHtml += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>'
    })
    tableHtml += '</table>'
    return tableHtml
  })

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Unordered lists (lines starting with - or *)
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[-*] /, '')}</li>`).join('')
    return `<ul>${items}</ul>`
  })

  // Ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol>${items}</ol>`
  })

  // Checkboxes (- [ ] and - [x])
  html = html.replace(/- \[ \] /g, '☐ ')
  html = html.replace(/- \[x\] /gi, '☑ ')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Line breaks → paragraphs (double newline)
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<')) return block // already wrapped
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')

  return html
}
