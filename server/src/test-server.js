import app from './koa-app'
import assert from 'assert'
import fetch from 'node-fetch'

let server

const start = async () => {
  assert(!server)

  await new Promise(resolve => {
    server = app.listen(resolve)
  })
}

const stop = async () => {
  assert(server)
  server.close()
  server = null
}

const get = () => server

const baseUrl = () =>
  'http://localhost:' + server.address().port

const serverFetch = (...args) => {
  const req = new fetch.Request(...args)
  return fetch(baseUrl() + req.url, Object.assign({}, req))
}

const fetchJson = (...args) => {
  const request = new fetch.Request(...args)
  const body = JSON.stringify(request.body)
  const headers = Object.assign({}, request.headers, {'Content-Type': 'application/json'})
  const newRequest = Object.assign({}, request, {headers, body})
  return serverFetch(request.url, newRequest)
}

export default {
  start,
  stop,
  get,
  baseUrl,
  fetch: serverFetch,
  fetchJson
}
