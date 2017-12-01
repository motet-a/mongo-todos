import {bindActionCreators} from 'redux'

import store from './store'

const fetchJson = (method, path, body) =>
  window
    .fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

const fetchTaskList = id => ({
  type: 'FETCH_TASK_LIST',
  payload: window
    .fetch(`/api/task-lists/${id}`)
    .then(res => res.json())
})

const createTaskList = (taskList) => ({
  type: 'CREATE_TASK_LIST',
  payload: fetchJson('POST', '/api/task-lists', taskList)
    .then(res => {
      if (res.status != 201) {
        return Promise.reject(res)
      }

      return res.json()
    })
})

const updateTaskList = taskList => ({
  type: 'UPDATE_TASK_LIST',
  payload: fetchJson('PUT', `/api/task-lists/${taskList._id}`, taskList)
    .then(res => {
      if (res.status != 200) {
        return Promise.reject(res)
      }

      return res.json()
    })
})

const deleteTaskList = taskListId => ({
  type: 'DELETE_TASK_LIST',
  payload: fetchJson('DELETE', `/api/task-lists/${taskListId}`)
    .then(res => {
      if (res.status != 204) {
        return Promise.reject(res)
      }

      return {taskListId}
    })
})

const createTask = ({taskListId, task}) => ({
  type: 'CREATE_TASK',
  payload: fetchJson('POST', `/api/task-lists/${taskListId}/tasks`, task)
    .then(res => {
      if (res.status != 201) {
        return Promise.reject(res)
      }

      return res.json()
    })
    .then(task => Object.assign(task, {taskList: taskListId}))
})

const updateTask = ({taskListId, task}) => ({
  type: 'UPDATE_TASK',
  payload: fetchJson('PUT', `/api/task-lists/${taskListId}/tasks/${task._id}`, task)
    .then(res => {
      if (res.status != 200) {
        return Promise.reject(res)
      }

      return res.json()
    })
})

const deleteTask = ({taskListId, taskId}) => ({
  type: 'DELETE_TASK',
  payload: fetchJson('DELETE', `/api/task-lists/${taskListId}/tasks/${taskId}`)
    .then(res => {
      if (res.status !== 204) {
        return Promise.reject(res)
      }

      return {taskId}
    })
})

export default bindActionCreators(
  {
    fetchTaskList,
    updateTaskList,
    createTaskList,
    deleteTaskList,
    createTask,
    deleteTask,
    updateTask
  },
  store.dispatch
)
