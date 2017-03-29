const html = require('bel')
const css = require('scopedify')

const nestedScope = css('./nested.css')

const nested = nestedScope(html`
<div class="base">
  <span class="title">inner</span>
</div>
`)

const viewScope = css('./view.css')

const view = viewScope(html`
<main class="base">
  <div class="title">outer</div>
  ${nested}
  <div>
    <div class="title">outer</div>
  </div>
</main>
`)

css`
:root div {
  margin: 20px;
}
`

document.body.appendChild(view)
