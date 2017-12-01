import Router from 'koa-router'

import tasksRouter from './tasks'
import taskListsRouter from './task-lists'

const router = new Router()

router.use(tasksRouter.routes())
router.use(taskListsRouter.routes())

export default router
