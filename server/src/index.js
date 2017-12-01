global.__TEST__ = false

const db = require('./db')
const {default: app} = require('./koa-app')

const bootstrap = async () => {
  await db.connect()

  const port = 3000

  app.listen(3000, () => {
    console.log(`listening on port ${port}…`)
  })
}

bootstrap()
  .catch(console.error)
