export default process.env.NODE_ENV !== 'production' && !__TEST__
  ? require('koa-logger')()
  : (_ctx, next) => next()
