const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.remove({}).then((result) => {
//   console.log(result)
// })

Todo.findOneAndRemove({_id: '588237d55bd1b63022ff191a'}).then((todo) => {
  
})


// Todo.findByIdAndRemove('588237d55bd1b63022ff191a').then((todo) => {
//   console.log(todo)
// })