global.__TEST__ = false

const db = require('./db')
const {default: app} = require('./koa-app')

const bootstrap = async () => {
  await db.connect()

  const port = 3000

  const server = app.listen(3000, () => {
    console.log(`listening on port ${port}…`)
  })

  const stop = () => {
    console.log('exiting…')
    server.close()
    db.close()
  }

  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
  process.on('SIGQUIT', stop)
}

bootstrap()
  .catch(console.error)
