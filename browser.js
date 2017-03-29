var message = (
  'It appears that you\'re trying to require scopedify in the browser ' +
  'but it wasn\'t caught by the browserify transform. Either the transform ' +
  'has not been enabled, or the require statement could not be statically ' +
  'resolved.'
)

module.exports = function scopedifyUntransformedBrowserError () {
  throw new Error(message)
}
