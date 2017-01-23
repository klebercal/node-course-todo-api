const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {todos, populateTodos, users, populateUsers} = require('./seed')

beforeEach(populateTodos)
beforeEach(populateUsers)

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

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com'
    let password = 'abc123!'
    
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          expect(user.email).toBe(email)
          done()
        }).catch((err) => done(err))
      })
  })

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'wrong', 
        password: 'abc!'
      })
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email, 
        password: 'abc123!'
      })
      .expect(400)
      .end(done)
  })
})

describe('POST /users/login', () => {
  it('should login and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err) {
          done(err)
        }

        User.findById(users[1]._id.toHexString()).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done()
        }).catch((err) => done(err))
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'wrong'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          done(err)
        }

        User.findById(users[1]._id.toHexString()).then((user) => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch((err) => done(err))
      })
  })
})

describe('DELETE /users/me/token', () => {
  it('should remove auth token on log auth', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id.toHexString()).then((user) => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })
})