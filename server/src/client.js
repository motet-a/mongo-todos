const send = require('koa-send')
const path = require('path')
const Router = require('koa-router')

const publicDirPath = path.join(__dirname, '..', '..', 'client', 'public')

const router = new Router()

router.get('/public/:filename', async ctx => {
  try {
    await send(ctx, ctx.params.filename, {root: publicDirPath})
  } catch (error) {
    if (error.status === 404 && process.env.NODE_ENV === 'production') {
      // The file path is written in the exception message and will be
      // displayed on the page. I don't like this behavior, hide it in
      // production.
      error.message = 'Not Found'
      throw error
    }
  }
})

router.get('*', async ctx => {
  await send(ctx, 'index.html', {root: publicDirPath})
})

module.exports = router
