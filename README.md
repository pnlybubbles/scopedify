# scopedify
[![js-standard-style][standard-image]][standard-url]

Scoped modular CSS bundler for browserify. (folked from [sheetify](https://github.com/stackcss/sheetify))

Works with [npm](http://npmjs.org/) modules
like [browserify](http://browserify.org/) does.

## Example
Given some inline CSS:

```js
const css = require('scopedify')
const html = require('bel')

const scope = css`
  .base h1 {
    text-align: center;
  }
`

const tree = scope(html`
  <section class='base'>
    <h1>My beautiful, centered title</h1>
  </section>
`)

document.body.appendChild(tree)
```

Compile with browserify using `-t scopedify/transform`:

```sh
$ browserify -t scopedify/transform index.js > bundle.js
```

CSS selectors are namespaced based on the content hash:

```css
.base[_scope_a68eaa6a] h1[_scope_a68eaa6a] {
  text-align: center;
}
```

And the rendered HTML includes the namespace:

```html
<section class="base" _scope_a68eaa6a>
  <h1 _scope_a68eaa6a>My beautiful, centered title</h1>
</section>
```

## Nested namespaces

CSS cascading will not be occured outer the scope.
Components will no longer be polluted with ancestors' styles.

*Note:* CSS inheritance (color, text-align, ...) will be occured normally.
Use `initial` to reset [inherited properties](https://www.w3.org/TR/CSS21/propidx.html).

```js
const css = require('scopedify')
const html = require('bel')

const componentScope = css`
  .base h1 {
    background-color: #aaf;
  }
`

const component = componentScope(html`
  <p class="base">
    <h1>Blue background, no border</h1>
  </p>
`)

const treeScope = css`
  .base h1 {
    border: solid 4px #faa;
  }
`

const tree = treeScope(html`
  <section class='base'>
    <h1>Red Bordered</h1>
    ${component}
  </section>
`)

document.body.appendChild(tree)
```

Rendered html:
```html
<section class="base" _scope_b29bc9f1>
  <h1 _scope_b29bc9f1>Red Bordered</h1>
  <p class="base" _scope_43e26b4d>
    <h1 _scope_43e26b4d>Blue background, no border</h1>
  </p>
</section>
```

## Multiple namespaces

If the given html is already scoped, the new scope will be added to nodes which has same scope as root in given html.

```js
const css = require('scopedify')
const html = require('bel')

const componentScope = css`
  .base h1 {
    background-color: #aaf;
  }
`

const component = componentScope(html`
  <p class="base">
    <h1>Blue background, no border</h1>
  </p>
`)

const Scope1 = css`
  .base h1 {
    border: solid 4px #faa;
  }
`

const Scope2 = css`
  .base h1 {
    transform: scale(0.5);
  }
`

const tree = Scope2(Scope1(html`
  <section class='base'>
    <h1>Red Bordered</h1>
    ${component}
  </section>
`))

document.body.appendChild(tree)
```

Rendered html:
```
<section class="base" _scope_b29bc9f1 _scope_136a89ad>
  <h1 _scope_b29bc9f1 _scope_136a89ad>Red Bordered</h1>
  <p class="base" _scope_43e26b4d>
    <h1 _scope_43e26b4d>Blue background, no border</h1>
  </p>
</section>
```

## External files
To include an external CSS file you can pass a path to scopedify as
`scopedify('./my-file.css')`:

```js
const css = require('scopedify')
const html = require('bel')

const scope = css('./my-styles.css')

const tree = scope(html`
  <section class=${prefix}>
    <h1>My beautiful, centered title</h1>
  </section>
`)

document.body.appendChild(tree)
```

## Disable namespaces

To disable namespaces for throughout a file:

```js
css('./my-styles.css', { noscope: false })
```

Selectors are not namespaced under `:root` pseudo selector:

```css
:root a {
  color: red;
}
```

## Use npm packages
To consume a package from npm that has `.css` file in its `main` or `style`
field:

```js
const css = require('scopedify')

css('normalize.css')
```
Packages from npm will not be namespaced by default.

## Write to separate file on disk
See [sheetify#write-to-separate-file-on-disk](https://github.com/stackcss/sheetify#write-to-separate-file-on-disk)

## Plugins
See [sheetify#plugins](https://github.com/stackcss/sheetify#plugins)

It is compatible with sheetify plugins.

## API
See [sheetify#api](https://github.com/stackcss/sheetify#api)

## FAQ
See [sheetify#faq](https://github.com/stackcss/sheetify#faq)

## Installation

```sh
$ npm install scopedify
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[2]: https://github.com/stackcss/css-extract
