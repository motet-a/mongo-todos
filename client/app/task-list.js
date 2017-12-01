import _ from 'lodash'
import {connect} from 'react-redux'
import {Component} from 'react'
import h from 'react-hyperscript'
import {withRoute} from 'react-router5'

import actions from './actions'
import Task from './task'

const NameForm = ({taskList, onNameChange}) =>
  h('div', {className: 'NameForm'}, [
    h('label', 'List name'),
    h('input', {
      type: 'text',
      placeholder: 'name',
      defaultValue: taskList.name,
      onChange: onNameChange
    })
  ])

class TaskList extends Component {
  componentWillMount() {
    const {route} = this.props
    actions.fetchTaskList(route.params.id)
  }

  nameChanged = _.debounce(name => {
    actions.updateTaskList({
      _id: this.props.taskList._id,
      name,
    })
  }, 200)

  createTask = () => {
    actions.createTask({
      taskListId: this.props.taskList._id,
      task: {text: '', done: false},
    })
  }

  createTaskList = () => {
    this.props.router.navigate('home')
  }

  render() {
    const {taskList, tasks} = this.props
    if (!taskList) {
      return null
    }

    return h('div', {className: 'TaskList'}, [
      h(NameForm, {
        taskList,
        onNameChange: event => this.nameChanged(event.target.value)
      }),

      Object.values(tasks).map(task =>
        h(Task, {
          taskList,
          task,
          key: task._id
        })
      ),

      h('button', {onClick: this.createTask}, 'Add task'),

      h('br'), h('br'), // HACK

      h('button', {onClick: this.createTaskList}, 'New task list…')
    ])
  }
}

function mapStateToProps(state, {route}) {
  const taskList = state.taskLists[route.params.id]
  if (!taskList) {
    return {}
  }

  const tasks = _.pickBy(state.tasks, t => t.taskList === taskList._id)
  return {taskList, tasks}
}

export default withRoute(connect(mapStateToProps)(TaskList))
