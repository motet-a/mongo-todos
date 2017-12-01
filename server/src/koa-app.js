import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import apiRouter from './api'
import clientRouter from './client'
import loggingMiddleware from './middleware/logging'
import validationMiddleware from './middleware/validation'

const router = new Router()
router.use('/api', apiRouter.routes())
router.use(clientRouter.routes())

const app = new Koa()
app.use(bodyParser())

app.use(loggingMiddleware)
app.use(validationMiddleware)

app.use(router.routes())
app.use(router.allowedMethods())

export default app
