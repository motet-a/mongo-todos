import {applyMiddleware, createStore} from 'redux'
import {createLogger} from 'redux-logger'  // TODO: Disable in production
import promiseMiddleware from 'redux-promise-middleware'

import reducer from './reducers'

const logger = createLogger({
  collapsed: true
})

const store = createStore(
  reducer,
  applyMiddleware(
    promiseMiddleware(),
    logger
  )
)

// For debugging purposes
window.reduxStore = store

export default store
const {getState} = store
export {getState}
