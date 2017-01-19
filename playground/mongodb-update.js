// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo database', err)
  }
  console.log('Connected to mongo database')

  // db.collection('Todos')
  //   .findOneAndUpdate({
  //     _id: new ObjectID('5880e48a61f848baf85e5695')
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   })
  //   .then((result) => {
  //     console.log(result)
  //   })

  db.collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID('5880a6ed5ba4d77d22735496')
    }, {
      $set: {
        name: 'Kleber'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then((result) => {
      console.log(result)
    })

  // db.close()
})