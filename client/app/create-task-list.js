import {connect} from 'react-redux'
import {Component} from 'react'
import h from 'react-hyperscript'
import {withRoute} from 'react-router5'

import actions from './actions'

class CreateTaskList extends Component {
  componentWillMount() {
    actions.createTaskList({
      name: 'Unnamed task list',
      tasks: [],
    }).then(({value: taskList}) => {
      this.props.router.navigate('taskList', {id: taskList._id})
    })
  }

  render = () =>
    h('p', 'Creating a new task list… Please wait.')
}

export default withRoute(connect()(CreateTaskList))
