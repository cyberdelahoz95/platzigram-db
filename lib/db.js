'use strict'

const co = require('co')
const r = require('rethinkdb')
const Promise = require('bluebird') // mediante este modulo se sobreescribe el objeto promise por defecto de nodejs, esto se realiza para que la función setup devuelva su valor en forma de callback o en forma de promesa facilmente

const defaults = {
  host: 'localhost',
  port: 28015,
  db: 'platzigram'
}

class Db {
  constructor (options) {
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
  }

  connect (callback) {
    this.connection = r.connect({
      host: this.host,
      port: this.port
    })

    let db = this.db
    let connection = this.connection

    let setup = co.wrap(function * () {
      let conn = yield connection

      let dbList = yield r.dbList().run(conn)

      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }

      let dbTables = yield r.db(db).tableList().run(conn)

      if (dbTables.indexOf('images') === -1) {
        yield r.db(db).tableCreate('images').run(conn)
      }

      if (dbTables.indexOf('users') === -1) {
        yield r.db(db).tableCreate('users').run(conn)
      }

      return conn
    })
    return Promise.resolve(setup()).asCallback(callback)
  }
}

module.exports = Db
