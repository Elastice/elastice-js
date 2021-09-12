
function formatKey (key, priv) {
  let name = 'PUBLIC'

  if (priv) {
    name = 'PRIVATE'
  }

  return '-----BEGIN ' + name + ' KEY-----\n' + key + '\n' + '-----END ' + name + ' KEY-----\n'
}

function formatData (data, signed) {
  const meta = {
    name: data.name,
    mime: data.mime,
    size: +data.size,
    project: data.project,
    path: data.path,
    stores: data.stores,
    tag: data.tag
  }

  if (signed) {
    meta.signed = true
  }

  return JSON.stringify(meta)
}

module.exports = { formatKey, formatData }
