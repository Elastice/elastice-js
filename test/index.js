
process.env.NODE_ENV = 'test'

const chai = require('chai')
const mime = require('mime-types')
const fs = require('fs')
const path = require('path')

const lib = require('../lib/index')

const expect = chai.expect

// signatures
const privateKey = 'MC4CAQAwBQYDK2VwBCIEIBMqqehtEYZAFIZllUcbbdNTuFrb48Tz4dpipBhz1enO'
const publicKey = 'MCowBQYDK2VwAyEAws/c1JrM/X5G1atVbFmirAYl9MKzv50RHqWuklnPdgQ='

const file1Signature = '29325257121d2c3ac203697f57824acb4b4b05481e001141c162b481f484c5e23994f089ad8cd74336c29fa03181df84556978b4ed109f20505d6fbc09265303'
const file2Signature = '972458098362c0cacd8c1a3defa7021304485f1d7cf0c984e0778f904b1f10542397f3a2f68c2da3538e07f2857201807081c935d27f85b087087188a5f04704'

// shared details
const fileProject = '5ee9f18d-c060-4446-bc24-91bbf5023819'
const filePath = 'test'
const fileStores = 'cdn,ipfs'
const fileTag = 'test'

// file 1
const file1Name = 'PNG.png'
const full1FilePath = path.join(__dirname, '../assets/' + file1Name)
const file1Mime = mime.contentType(full1FilePath)

const file1BlobRaw = fs.readFileSync(full1FilePath/*, 'utf-8' */)
const file1Blob = file1BlobRaw.toString('base64')
const file1Size = file1Blob.length

const file1Meta = {
  name: file1Name,
  mime: file1Mime,
  size: +file1Size,
  project: fileProject,
  path: filePath,
  stores: fileStores,
  tag: fileTag
}

const file1Data = JSON.stringify(file1Meta)

// file 2
const file2Name = 'SVG.svg'
const full2FilePath = path.join(__dirname, '../assets/' + file2Name)
const file2Mime = mime.contentType(full2FilePath)

const file2BlobRaw = fs.readFileSync(full2FilePath/*, 'utf-8' */)
const file2Blob = file2BlobRaw.toString('base64')
const file2Size = file2Blob.length

const file2Meta = {
  name: file2Name,
  mime: file2Mime,
  size: +file2Size,
  project: fileProject,
  path: filePath,
  stores: 'cdn',
  tag: fileTag,
  signed: true
}

const file2Data = JSON.stringify(file2Meta)

// file keys

const file1Key = '5ee9f18d-c060-4446-bc24-91bbf5023819/test/PNG.png'
const file2Key = '5ee9f18d-c060-4446-bc24-91bbf5023819/test/SVG.svg'

describe('Testing Elastice JS lib', () => {
  describe('Sign', async () => {
    it('sign data', async () => {
      const signature = await lib.sign.sig({ data: file1Data, key: privateKey })

      expect(signature).to.equal(file1Signature)
    })

    it('validate data signature', async () => {
      const valid = await lib.sign.verify({ data: file1Data, signature: file1Signature, key: publicKey })

      expect(valid).to.equal(true)
    })
  })

  describe('Sync Direct Upload', async () => {
    it('upload data to CDN and IPFS', async () => {
      const file = { ...file1Meta, blob: file1Blob, signature: file1Signature }

      const { data } = await lib.sync.up(file)

      expect(data).to.have.property('ipfs')
      expect(data).to.have.property('uuid')
      expect(data).to.have.property('cdn')
      expect(data).to.have.property('key')

      expect(data.ipfs).to.not.equal(null)
      expect(data.cdn).to.not.equal(null)
      expect(data.uuid).to.not.equal(null)
      expect(data.key).to.equal(file1Key)
    })

    it('get file meta', async () => {
      const file = { key: file1Key }

      const { data } = await lib.sync.meta(file)
      const info = data?.info || {}

      expect(info).to.have.property('uuid')
      expect(info).to.have.property('project')
      expect(info).to.have.property('cdnStoreETag')
      expect(info).to.have.property('ipfsStoreHash')

      expect(info.uuid).to.not.equal(null)
      expect(info.project).to.equal(fileProject)
      expect(info.cdnStoreETag).to.not.equal(null)
      expect(info.ipfsStoreHash).to.not.equal(null)
    })

    it('lists new file', async () => {
      const project = { project: fileProject }

      const { data } = await lib.sync.list(project)
      const files = data.files || []

      const file1DataFromList = files.find(f => f.key === file1Key)
      expect(file1DataFromList).to.not.equal(null)
    })

    it('delete data', async () => {
      const removeRequest = JSON.stringify({ request: 'DOWN', key: file1Key })
      const signature = await lib.sign.sig({ data: removeRequest, key: privateKey })

      const file = { key: file1Key, signature: signature }

      const { data } = await lib.sync.down(file)

      expect(data).to.have.property('cdn')
      expect(data).to.have.property('uuid')
      expect(data).to.have.property('ipfs')

      expect(data.cdn).to.equal(null)
      expect(data.uuid).to.equal(null)
      expect(data.ipfs).to.equal(null)
    })
  })

  describe('Sync Signed URL', async () => {
    it('signs signed url request', async () => {
      const signature = await lib.sign.sig({ data: file2Data, key: privateKey })

      expect(signature).to.equal(file2Signature)
    })

    it('gets signed url from API server', async () => {
      const file = { ...file2Meta, expireSeconds: 60, signature: file2Signature }
      const { data } = await lib.sync.sign(file)

      expect(data).to.have.property('key')
      expect(data).to.have.property('cdn')
      expect(data).to.have.property('uuid')
      expect(data).to.have.property('expiry')

      expect(data.key).to.equal(file2Key)
      expect(data.cdn).to.not.equal(null)
      expect(data.uuid).to.not.equal(null)
      expect(data.expiry).to.not.equal(null)
    })

    it('upload data to signed url CDN', async () => {
      const file = { key: file2Key, blob: file2Blob }

      const { data } = await lib.sync.signed(file)

      expect(data).to.have.property('cdn')

      expect(data.cdn).to.not.equal(null)
    })

    it('delete data', async () => {
      const removeRequest = JSON.stringify({ request: 'DOWN', key: file2Key })
      const signature = await lib.sign.sig({ data: removeRequest, key: privateKey })

      const file = { key: file2Key, signature: signature }

      const { data } = await lib.sync.down(file)

      expect(data).to.have.property('cdn')

      expect(data.cdn).to.equal(null)
    })
  })
})
