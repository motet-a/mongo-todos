// Don't use ES6 imports here

const NodeEnvironment = require('jest-environment-node')
const db = require('./db')

class CustomEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup()

    this.global.__DB__ = await db.connect({test: true})

    await db.collection('tasks').remove({})
    await db.collection('task-lists').remove({})
  }

  async teardown () {
    await super.teardown()

    await db.close()
  }
}

module.exports = CustomEnvironment
