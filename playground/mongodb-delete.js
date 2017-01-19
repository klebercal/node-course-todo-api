// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo database', err)
  }
  console.log('Connected to mongo database')

  // deleteMany
  // db.collection('Todos')
  //   .deleteMany({text: 'Eat dinner'})
  //   .then((result) => {
  //     console.log(result)
  //   })

  // deleteOne
  // db.collection('Todos')
  //   .deleteOne({text: 'Eat dinner'})
  //   .then((result) => {
  //     console.log(result)
  //   })

  // findOneAndDelete
  // db.collection('Todos')
  //   .findOneAndDelete({completed: false})
  //   .then((result) => {
  //     console.log(result)
  //   })

  // db.collection('Users')
  //   .findOneAndDelete({_id: 123})
  //   .then((result) => {
  //     console.log(result)
  //   })

  db.collection('Users')
    .deleteMany({name: 'Kleber C Batista'})
    .then((result) => {
      console.log(result)
    })

  // db.close()
})