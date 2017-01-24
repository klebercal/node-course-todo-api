let env = process.env.NODE_ENV || 'development'

switch (env) {
  case 'development':
  case 'test':
    let config = require('./config.json')

    Object.keys(config[env]).forEach((key) => {
      process.env[key] = config[env][key]
    })
    break
}