const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo' ,
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((err) => done(err))
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((err) => done(err))
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    let fakeId = new ObjectID()

    request(app)
      .get(`/todos/${fakeId.toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    let nobjId = '123'

    request(app)
      .get(`/todos/${nobjId}`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  let id = todos[1]._id.toHexString()

  it('should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist()
          done()
        }, (err) => done(err))
      })
  })

  it('should return 404 if todo not found', (done) => {
    let fakeId = new ObjectID()

    request(app)
      .delete(`/todos/${fakeId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    let nobjId = '123'

    request(app)
      .delete(`/todos/${nobjId}`)
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let id = todos[0]._id.toHexString()
    let text = 'Updated test text'

    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString()
    let text = 'Updated test text'

    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done)
  })
})