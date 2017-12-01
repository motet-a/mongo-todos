import debounce from 'lodash/debounce'
import {Component} from 'react'
import h from 'react-hyperscript'

import actions from './actions'

export default class Task extends Component {
  removeTask = () => {
    actions.deleteTask({
      taskListId: this.props.taskList._id,
      taskId: this.props.task._id,
    })
  }

  update(newFields) {
    const {props} = this

    const task = Object.assign({}, newFields, {_id: props.task._id})

    return actions.updateTask({
      taskListId: props.taskList._id,
      task,
    })
  }

  textChanged = debounce(text => {
    this.update({text})
  }, 200)

  render() {
    const {task} = this.props
    if (!task) {
      return null
    }

    return h('div', {className: 'Task'}, [
      h('input', {
        type: 'checkbox',
        defaultChecked: task.done,
        onChange: event => this.update({done: event.target.checked})
      }),

      h('input', {
        type: 'text',
        defaultValue: task.text,
        onChange: event => this.textChanged(event.target.value)
      }),

      h('button', {onClick: this.removeTask}, 'Remove')
    ])
  }
}
