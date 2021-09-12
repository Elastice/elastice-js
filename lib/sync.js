
const axios = require('axios')
const defaultConfig = require('./config')

function up (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'post',
      url: newConfig.API_BASE + '/file/up',
      data
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

function meta (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'get',
      url: newConfig.API_BASE + `/file/meta?key=${data.key}`
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

function list (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'get',
      url: newConfig.API_BASE + `/file/list?project=${data.project}`
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

function down (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'delete',
      url: newConfig.API_BASE + `/file/down?key=${data.key}&signature=${data.signature}`
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

function sign (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  const query = Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'get',
      url: newConfig.API_BASE + '/file/sign' + '?' + query
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

function signed (data, instanceConfig) {
  const newConfig = { ...defaultConfig, ...instanceConfig }

  return new Promise(async (resolve, reject) => {
    axios({
      method: 'post',
      url: newConfig.API_BASE + '/file/sign',
      data
    }).then(function (response) {
      resolve(response)
    })
      .catch(function (err) {
        reject(err)
      })
  })
}

module.exports = { up, meta, list, down, sign, signed }
