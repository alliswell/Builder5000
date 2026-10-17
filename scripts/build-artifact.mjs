// Packs the production build into one self-contained page for publishing as a
// claude.ai artifact: CSS and JS inlined, no <html>/<head>/<body> (the
// artifact host adds its own document skeleton). Run via `npm run build:artifact`.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const ASSETS = 'dist/assets'
const OUT = 'dist/artifact.html'

const files = readdirSync(ASSETS)
const read = (ext) => files
  .filter(f => f.endsWith(ext))
  .map(f => readFileSync(`${ASSETS}/${f}`, 'utf8'))
  .join('\n')

const css = read('.css')
// Keep the HTML parser from closing the inline script early
const js = read('.js').replace(/<\/script/gi, '<\\/script')
if (js.includes('<!--')) throw new Error('Bundle contains "<!--", which breaks inline <script> parsing')

const html = `<title>Table Configurator</title>
<style>
:root { color-scheme: dark; }
html, body { background: #171717; }
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`

writeFileSync(OUT, html)
console.log(`${OUT} (${(html.length / 1024).toFixed(0)} KB)`)
