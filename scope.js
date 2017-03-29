const PREFIX_PREFIX = '_scope_'

module.exports = scope
module.exports.bindPrefix = bindPrefix
module.exports.PREFIX_PREFIX = PREFIX_PREFIX

function bindPrefix (node, prefix) {
  if (node.nodeType === 1 &&
    !Array.from(node.attributes).some((v) => RegExp(`^${PREFIX_PREFIX}`).test(v.name))) {
    node.setAttribute(prefix, '')
    Array.from(node.childNodes).forEach((node) => {
      bindPrefix(node, prefix)
    })
  }
}

function scope (prefix) {
  return function (node) {
    bindPrefix(node, prefix)
    return node
  }
}
