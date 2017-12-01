// Don't use ES6 imports here

const {MongoClient} = require('mongodb')

const url = process.env.TODO_MONGO_URL || 'mongodb://localhost:27017/todo'

const wait = delay => new Promise(resolve => setTimeout(resolve, delay))

const connect = async (options = {}) => {
  let db
  try {
    db = await MongoClient.connect(url + (options.test ? '_test' : ''))
  } catch (error) {
    await wait(1000)
    return connect(options)
  }

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
