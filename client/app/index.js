import {Component} from 'react'
import ReactDOM from 'react-dom'
import h from 'react-hyperscript'
import {Provider} from 'react-redux'
import createRouter from 'router5';
import {RouterProvider, withRoute} from 'react-router5'
import browserPlugin from 'router5/plugins/browser'
import listenersPlugin from 'router5/plugins/listeners'

import CreateTaskList from './create-task-list'
import TaskList from './task-list'
import store from './store'

const routes = [
  {name: 'home', path: '/'},
  {name: 'taskList', path: '/:id'}
]

const router = createRouter(routes, {
  defaultRoute: 'home'
})
router.usePlugin(browserPlugin())
router.usePlugin(listenersPlugin())
router.start()

const TaskForm = () =>
  h('form', {className: 'task-form'}, [
    h('input', {type: 'text', placeholder: 'Task description…'}),
    h('input', {type: 'checkbox'})
  ])

const RouteSwitch = withRoute(({route}) => {
  switch (route.name) {
    case 'home':
      return h(CreateTaskList)

    case 'taskList':
      return h(TaskList)

    default:
      console.info(`Page not found: ${route.name}`)
      return h('p', 'Page not found.')
  }
})

ReactDOM.render(
  h(RouterProvider, {router}, [
    h(Provider, {store}, [
      h('main', [
        h('header', [
          h('h1', 'Tasks')
        ]),
        h(RouteSwitch)
      ])
    ])
  ]),

  document.getElementById('root')
)
