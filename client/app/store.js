import {applyMiddleware, createStore} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'

import reducer from './reducers'

const middleware = [promiseMiddleware()]

if (process.env.NODE_ENV !== 'production') {
  const {createLogger} = require('redux-logger')

  const logger = createLogger({
    collapsed: true
  })
  middleware.push(logger)
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

// For debugging purposes
window.reduxStore = store

export default store
const {getState} = store
export {getState}
