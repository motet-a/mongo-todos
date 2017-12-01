// Don't use ES6 imports here

const {MongoClient} = require('mongodb')

const url = process.env.TODO_MONGO_URL || 'mongodb://localhost:27017/todo'

const connect = async (options = {}) => {
  const db = await MongoClient.connect(url + (options.test ? '_test' : ''))
  global.__DB__ = db
  return db
}

const close = (...args) => {
  const result = __DB__.close(...args)
  global.__DB__ = null
  return result
}

const proxyfiedDb = new Proxy(
  {},

  {
    get (_target, name) {
      if (name === 'connect') {
        return connect
      }

      if (name === 'close') {
        return close
      }

      if (name === '__esModule') {
        return undefined
      }

      return global.__DB__[name]
    },

    set () {
      throw new Error()
    }
  }
)

module.exports = proxyfiedDb
