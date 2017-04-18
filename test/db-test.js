'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const Db = require('../')
const r = require('rethinkdb')
const fixtures = require('./fixtures')

const dbName = `platzigram_${uuid.v4()}`
const db = new Db({db: dbName})

// AVA permite generar hooks que se ejecutan antes o despues de ejecutar una prueba, en este caso se usa el hook before
test.before('setup database', async t => {
  await db.connect()
  t.true(db.connected, 'it should be connected to the db server')
})

test.after('disconnect database', async t => {
  await db.disconnect()
  t.false(db.connected, 'should be disconnected')
})

test.after.always('cleanup database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is function')

  let image = fixtures.getImage()

  let created = await db.saveImage(image)

  t.is(created.url, image.url)
  t.is(created.description, image.description)
  t.deepEqual(created.tags, ['awesome', 'platzi'])
  t.is(created.public_id, uuid.encode(created.id))
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})

test('Like Image', async t => {
  t.is(typeof db.likeImage, 'function', 'likeImage is a function')

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.public_id)

  t.true(result.liked)
  t.is(result.likes, image.likes + 1)
})
