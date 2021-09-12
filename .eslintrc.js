module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [],
  extends: [
    'standard'
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  rules: {
    'no-async-promise-executor': 0,
    'no-useless-escape': 0
  },
  globals: {
    fetch: true
  },
  settings: {
  }
}
