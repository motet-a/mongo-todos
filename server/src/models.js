import V from '@motet-a/validate'

// Forget “models” as understood by ORMs and MVC, this files does one thing:
// it validates objects.
//
// Each “model” is a composable function-like object. In order to ensure
// that some value complies with the schema described by some “model”, simply
// call the “model” with the schema in parameter. It throws on error.
//
// See https://github.com/motet-a/validate for more information.

export const Task = V
  .shape({
    text: V
      .string
      .toTrimmed
      .max(1024),

    done: V
      .boolean
  })

export const TaskList = V
  .shape({
    _id: V
      .string,

    name: V
      .string
      .toTrimmed
      .max(80),

    tasks: V.array.of(Task)
  })

export default {Task, TaskList}
