
const { sign, verify } = require('crypto')
const { formatKey } = require('./utils')

const algorithm = null

function getSignature ({ data, key }) {
  data = Buffer.from(data)
  key = formatKey(key, true)

  return sign(algorithm, data, key).toString('hex')
}

function verifySignature ({ data, signature, key }) {
  data = Buffer.from(data)
  signature = Buffer.from(signature, 'hex')
  key = formatKey(key)

  return verify(algorithm, data, key, signature)
}

module.exports = { sig: getSignature, verify: verifySignature }
