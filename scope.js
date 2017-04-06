var PREFIX_PREFIX = '_scope_'

module.exports = scope
module.exports.bindPrefix = bindPrefix
module.exports.PREFIX_PREFIX = PREFIX_PREFIX

function bindPrefix (node, prefix, scope) {
  if (node.nodeType === 1) {
    var prefixed = Array.prototype.slice
      .call(node.attributes)
      .map(function (v) { return v.name })
      .filter(function (v) { return RegExp('^' + PREFIX_PREFIX).test(v) })[0]
    if (scope === true ||      // if true, this node is scope root node
      (!scope && !prefixed) || // if true, this node has no prefix
      scope === prefixed) {    // if true, this node already has prefix same as scope root node
      node.setAttribute(prefix, '')
      Array.prototype.slice
        .call(node.childNodes)
        .forEach(function (node) {
          bindPrefix(node, prefix, scope && prefixed)
        })
    }
  }
}

function scope (prefix) {
  return function (node) {
    bindPrefix(node, prefix, true)
    return node
  }
}
