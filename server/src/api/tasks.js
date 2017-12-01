import _ from 'lodash'
import Router from 'koa-router'
import assert from 'assert'

import db from '~/db'
import models from '~/models'
import util from '~/util'

const router = new Router()

router.post('/task-lists/:listId/tasks', async (ctx, next) => {
  const task = models
    .Task
    .pick('text', 'done')(ctx.request.body)

  task._id = util.mongoId()

  const result = await db
    .collection('tasklists')
    .findOneAndUpdate({
      _id: ctx.params.listId
    }, {
      $addToSet: {tasks: task}
    }, {
      returnOriginal: false
    })

  if (result.value) {
    const newTasks = result.value.tasks
    ctx.body = newTasks.find(t => t._id === task._id)
    assert(ctx.body)
    ctx.status = 201
  }
})

router.put('/task-lists/:listId/tasks/:id', async (ctx, next) => {
  const newFields = models
    .Task
    .pick('text', 'done')
    .optionalChildren(ctx.request.body)

  const result = await db
    .collection('tasklists')
    .findOneAndUpdate({
      _id: ctx.params.listId,
      'tasks._id': ctx.params.id
    }, {
      $set: _.mapKeys(newFields, (_, key) => 'tasks.$.' + key)
    }, {
      returnOriginal: false
    })

  if (result.value) {
    const newTasks = result.value.tasks
    ctx.body = newTasks.find(t => t._id === ctx.params.id)
  }
})

router.del('/task-lists/:listId/tasks/:id', async (ctx, next) => {
  const result = await db
    .collection('tasklists')
    .findOneAndUpdate({
      _id: ctx.params.listId,
      'tasks._id': ctx.params.id
    }, {
      $pull: {tasks: {_id: ctx.params.id}}
    }, {
      returnOriginal: false
    })

  if (result.value) {
    ctx.status = 204
  }
})

export default router
