module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'lib.min.js',
    globalObject: 'this' // prevent error: `Uncaught ReferenceError: self is not define`
  },
  mode: 'production'
}
