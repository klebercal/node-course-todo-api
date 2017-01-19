// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo database', err)
  }
  console.log('Connected to mongo database')

  // db.collection('Todos')
  //   .find()
  //   .count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`)
  //   }, (err) => {
  //     console.log('Unable to fetch todo count', err)
  //   })

  let name = 'Kleber C Batista'

  db.collection('Users')
    .find({name})
    .forEach((doc) => {
      console.log(JSON.stringify(doc, undefined, 2))
    }, (err) => {
      if (err) {
        console.log('Unable to fetch users', err)
      }
    })

  db.close()
})