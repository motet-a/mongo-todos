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
    name: 'hello',
    tasks: []
  }

  models.TaskList(fixture)
  return fixture
}

describe('GET /task-lists/:id', () => {
  test('404 when the ID doesn’t exist', async () => {
    const res = await server.fetch('/api/task-lists/does-not-exist')
    expect(res.status).toEqual(404)
    expect(await res.text()).toEqual('Not Found')
  })

  test('200 ', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetch(`/api/task-lists/${list._id}`)
    expect(res.status).toEqual(200)
    expect(await res.json()).toEqual(list)
  })
})

describe('POST /task-lists', () => {
  test('201', async () => {
    const listToCreate = await taskListFixture()
    listToCreate.name = 'whitespace should be trimmed'

    const postData = Object.assign(
      {},
      listToCreate,
      {name: ` \n ${listToCreate.name} \t `}
    )

    const res = await server.fetchJson(`/api/task-lists`, {
      method: 'POST',
      body: postData
    })

    expect(res.status).toEqual(201)
    const createdList = await res.json()
    expect(_.omit(createdList, '_id')).toEqual(_.omit(listToCreate, '_id'))
    expect(createdList._id).not.toEqual(postData._id)
  })

  test('400', async () => {
    const res = await server.fetchJson('/api/task-lists', {
      method: 'POST',
      body: {}
    })
    expect(res.status).toEqual(400)
    expect(await res.json()).toMatchSnapshot()
  })
})

describe('DELETE /task-lists', () => {
  test('404 when the ID doesn’t exist', async () => {
    const res = await server.fetchJson(
      '/api/task-lists/does-not-exist',
      {method: 'DELETE'}
    )
    expect(res.status).toEqual(404)
  })

  test('204', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(
      `/api/task-lists/${list._id}`,
      {method: 'DELETE'}
    )
    expect(res.status).toEqual(204)
  })
})

describe('PUT /task-lists', () => {
  test('404 when the ID doesn’t exist', async () => {
    const res = await server.fetchJson(
      '/api/task-lists/does-not-exist',
      {method: 'PUT'}
    )
    expect(res.status).toEqual(404)
  })

  test('200 when an empty update occurs', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(
      `/api/task-lists/${list._id}`,
      {
        method: 'PUT',
        body: {}
      }
    )
    expect(res.status).toEqual(200)
    expect(await res.json()).toEqual(list)
  })

  test('200', async () => {
    const list = await taskListFixture()

    await db
      .collection('tasklists')
      .insertOne(list)

    const res = await server.fetchJson(
      `/api/task-lists/${list._id}`,
      {
        method: 'PUT',
        body: {name: 'new name'}
      }
    )
    expect(res.status).toEqual(200)

    const expectedNewList = Object.assign(
      {},
      list,
      {name: 'new name'}
    )
    expect(await res.json()).toEqual(expectedNewList)

    const insertedList = await db
      .collection('tasklists')
      .findOne({_id: list._id})

    expect(insertedList).toEqual(expectedNewList)
  })
})
