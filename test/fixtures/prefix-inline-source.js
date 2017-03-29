const sf = require('scopedify')

const prefix = sf`:host .foo {
  color: blue;
}
`
console.log(prefix)
