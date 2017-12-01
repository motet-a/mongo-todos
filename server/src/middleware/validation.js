import {ValidationError} from '@motet-a/validate'

export default async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.body = {
        'message': error.message,
        'path': error.path
      }

      ctx.status = 400
      return
    }

    throw error
  }
}
