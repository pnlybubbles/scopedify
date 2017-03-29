const browserify = require('browserify')
const concat = require('concat-stream')
const through = require('through2')
const test = require('tape')
const path = require('path')
const fs = require('fs')
const vm = require('vm')
const cssResolve = require('style-resolve').sync
const jsdom = require('jsdom').jsdom()
const domify = require('domify')

const transform = require('../transform')
const sheetify = require('..')

test('prefix', function (t) {
  t.test('should return a prefixer when called in Node', function (t) {
    t.plan(1)
    const prefixer = sheetify`.foo { color: blue; }`
    const expected = sheetify.getPrefix('.foo { color: blue; }')
    const node = domify('<main></main>', jsdom.defaultView.document)
    prefixer(node)
    t.equal(node.attributes[0].name, expected, 'prefix is equal')
  })

  t.test('should return a prefixer with relative path in Node', function (t) {
    t.plan(1)
    const expath = path.join(__dirname, 'fixtures/prefix-import-source.css')
    const expected = sheetify.getPrefix(fs.readFileSync(expath, 'utf8'))
    const prefixer = sheetify('./fixtures/prefix-import-source.css')
    const node = domify('<main></main>', jsdom.defaultView.document)
    prefixer(node)
    t.equal(node.attributes[0].name, expected, 'prefix is equal')
  })

  t.test('should return a prefixer with a module name in Node', function (t) {
    t.plan(1)
    const expath = cssResolve('css-wipe')
    const expected = sheetify.getPrefix(fs.readFileSync(expath, 'utf8'))
    const prefixer = sheetify('css-wipe')
    const node = domify('<main></main>', jsdom.defaultView.document)
    prefixer(node)
    t.equal(node.attributes[0].name, expected, 'prefix is equal')
  })

  t.test('should prefix and inline template strings', function (t) {
    t.plan(3)

    const expath = path.join(__dirname, 'fixtures/prefix-inline-expected.css')
    const expected = fs.readFileSync(expath, 'utf8').trim()

    const ws = concat(function (buf) {
      const res = String(buf).trim()
      t.equal(res, expected, 'css is equal')
    })

    const bOpts = { browserField: false }
    const bpath = path.join(__dirname, 'fixtures/prefix-inline-source.js')
    browserify(bpath, bOpts)
      .transform(transform)
      .transform(function (file) {
        return through(function (buf, enc, next) {
          const str = buf.toString('utf8')
          this.push(str.replace(/sheetify\/insert/, 'insert-css'))
          next()
        })
      })
      .plugin('css-extract', { out: outFn })
      .bundle(parseBundle)

    function outFn () {
      return ws
    }

    function parseBundle (err, src) {
      t.ifError(err, 'no error')
      const c = { console: { log: log } }
      vm.runInNewContext(src.toString(), c)

      function log (msg) {
        t.equal(msg, '_scope_f918f624', 'echoes prefix')
      }
    }
  })

  t.test('should prefix and inline imported files', function (t) {
    t.plan(3)

    const expath = path.join(__dirname, 'fixtures/prefix-import-expected.css')
    const expected = fs.readFileSync(expath, 'utf8').trim()

    const ws = concat(function (buf) {
      const res = String(buf).trim()
      t.equal(res, expected, 'css is equal')
    })

    const bOpts = { browserField: false }
    const bpath = path.join(__dirname, 'fixtures/prefix-import-source.js')
    browserify(bpath, bOpts)
      .transform(transform)
      .transform(function (file) {
        return through(function (buf, enc, next) {
          const str = buf.toString('utf8')
          this.push(str.replace(/sheetify\/insert/, 'insert-css'))
          next()
        })
      })
      .plugin('css-extract', { out: outFn })
      .bundle(parseBundle)

    function outFn () {
      return ws
    }

    function parseBundle (err, src) {
      t.ifError(err, 'no error')
      const c = { console: { log: log } }
      vm.runInNewContext(src.toString(), c)

      function log (msg) {
        t.equal(msg, '_scope_f918f624', 'echoes prefix')
      }
    }
  })
})
