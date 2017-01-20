let env = process.env.NODE_ENV || 'development'
console.log('env *******', env)

switch (env) {
  case 'development':
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost/TodoApp'
    break

  case 'test':
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost/TodoAppTest'
    break
}