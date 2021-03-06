import {combineReducers} from 'redux'
import fromPairs from 'lodash/fromPairs'
import omit from 'lodash/omit'

function tasks(state = {}, action) {
  switch (action.type) {
    case 'FETCH_TASK_LIST_FULFILLED': {
      const taskList = action.payload
      const tasks = fromPairs(
        taskList.tasks.map(t => [
          t._id,
          Object.assign({}, t, {taskList: taskList._id})
        ])
      )
      return Object.assign({}, state, tasks)
    }

    case 'CREATE_TASK_FULFILLED': {
      return Object.assign({}, state, {
        [action.payload._id]: action.payload
      })
    }

    case 'DELETE_TASK_FULFILLED': {
      return omit(state, action.payload.taskId)
    }
  }
  return state
}

function taskLists(state = {}, action) {
  switch (action.type) {
    case 'FETCH_TASK_LIST_FULFILLED': {
      const list = action.payload
      return Object.assign({}, state, {
        [list._id]: omit(list, 'tasks')
      })
    }
  }
  return state
}

export default combineReducers({
  tasks,
  taskLists
})
