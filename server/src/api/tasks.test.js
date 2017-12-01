import _ from 'lodash'

import server from '~/test-server'
import db from '~/db'
import models from '~/models'
import util from '~/util'

beforeAll(server.start)
afterAll(server.stop)

const taskListFixture = async () => {
  const fixture = {
    _id: await util.secureRandomString(),
    name: 'shopping list',
    tasks: [
      {text: 'eggs', done: false},
      {text: 'cheese', done: true},
      {text: 'milk', done: true},
      {text: 'fish', done: false}
    ]
  }
  models.TaskList(fixture)

  fixture.tasks.forEach(o => {
    o._id = util.mongoId()
  })

  return fixture
}

describe('POST /task-lists/:listId/tasks', async () => {
  test('404', async () => {
    const res = await server.fetchJson(`/api/task-lists/does-not-exist/tasks`, {
      method: 'POST',
      body: {text: 'fish', done: false}
    })
    expect(res.status).toEqual(404)
  })

  test('400', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks`, {
      method: 'POST',
      body: {invalid: 'object'}
    })
    expect(res.status).toEqual(400)
  })

  test('201', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks`, {
      method: 'POST',
      body: {text: 'fish', done: false, _id: 'mustBeIgnored'}
    })
    expect(res.status).toEqual(201)

    const newTask = await res.json()

    expect(_.omit(newTask, '_id')).toEqual({
      text: 'fish',
      done: false
    })
    expect(newTask._id).not.toEqual('mustBeIgnored')

    const newList = await db
      .collection('tasklists')
      .findOne({_id: list._id})
    const fishTasks = newList.tasks.filter(t => t.text === 'fish')
    expect(fishTasks.length).toEqual(2)
    expect(fishTasks[0]._id).not.toEqual(fishTasks[1]._id)
  })
})

describe('PUT /task-lists/:listId/tasks/:id', () => {
  test('404', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks/does-not-exist`, {
      method: 'PUT',
      body: {text: 'meat'}
    })
    expect(res.status).toEqual(404)

    const res2 = await server.fetchJson(`/api/task-lists/does-not-exist/tasks/does-not-exist`, {
      method: 'PUT',
      body: {text: 'meat'}
    })
    expect(res2.status).toEqual(404)
  })

  test('200', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const eggs = list.tasks.find(t => t.text === 'eggs')

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks/${eggs._id}`, {
      method: 'PUT',
      body: {text: 'meat'}
    })
    expect(res.status).toEqual(200)
    const meat = await res.json()
    expect(meat).toEqual({
      _id: eggs._id,
      text: 'meat',
      done: false
    })

    const newList = await db
      .collection('tasklists')
      .findOne({_id: list._id})

    expect(newList.tasks.length).toEqual(list.tasks.length)
  })
})

describe('DELETE /task-lists/:listId/tasks/:id', () => {
  test('404', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks/does-not-exist`, {
      method: 'DELETE'
    })
    expect(res.status).toEqual(404)
  })

  test('204', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const eggs = list.tasks.find(t => t.text === 'eggs')

    const res = await server.fetchJson(`/api/task-lists/${list._id}/tasks/${eggs._id}`, {
      method: 'DELETE'
    })
    expect(res.status).toEqual(204)

    const newList = await db
      .collection('tasklists')
      .findOne({_id: list._id})

    const egglessList = Object.assign({}, list)
    egglessList.tasks = list.tasks.filter(t => t.text !== 'eggs')
    expect(newList).toEqual(egglessList)
  })
})
