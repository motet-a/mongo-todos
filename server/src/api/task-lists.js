import Router from 'koa-router'

import db from '~/db'
import models from '~/models'
import util from '~/util'

const router = new Router()

router.get('/task-lists/:id', async (ctx, next) => {
  const taskList = await db
    .collection('tasklists')
    .findOne({_id: ctx.params.id})

  if (taskList) {
    ctx.body = taskList
  }
})

router.post('/task-lists', async (ctx, next) => {
  const taskList = models
    .TaskList
    .pick('name', 'tasks')(ctx.request.body)

  taskList._id = await util.secureRandomString()
  const result = await db
    .collection('tasklists')
    .insertOne(taskList)

  ctx.body = result.ops[0]
  ctx.status = 201
})

router.put('/task-lists/:id', async (ctx, next) => {
  const newFields = models
    .TaskList
    .pick('name')
    .optionalChildren(ctx.request.body)

  // HACK: Mongo’s $set doesn’t allow empty updates.
  newFields._id = ctx.params.id

  const {value: taskList} = await db
    .collection('tasklists')
    .findOneAndUpdate(
      {_id: ctx.params.id},
      {$set: newFields},
      {returnOriginal: false}
    )

  if (taskList) {
    ctx.body = taskList
  }
})

router.del('/task-lists/:id', async (ctx, next) => {
  const {deletedCount} = await db
    .collection('tasklists')
    .deleteOne({_id: ctx.params.id})

  if (deletedCount) {
    ctx.status = 204
  }
})

export default router
