const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// let id = '58811a0b51156f66ca31137c11'

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found')
//   }

//   console.log('Todo by id', todo)
// }).catch((err) => console.log(err))

var id = '58810683cf8cd34970a07922'

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found')
  }

  console.log('User', user)
}, (err) => console.log(err))