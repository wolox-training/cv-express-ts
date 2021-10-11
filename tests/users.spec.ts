import request from 'supertest';

import userRepository from '../app/services/users';
import app from '../app';

describe('users', () => {
  beforeEach(() =>
    userRepository.createMany([
      {
        name: 'u1',
        lastName: 'ln1',
        email: 'e1@wolox.co',
        password: 'xsw'
      }
    ])
  );
  describe('/users GET', () => {
    it('should return all users', (done: jest.DoneCallback) => {
      const list = [];
      for (let i = 1; i < 9; i++) {
        list.push({
          name: `name${i}`,
          lastName: `lastName${i}`,
          email: `email${i}@wolox.co`,
          password: 'ABcd01234'
        });
      }
      userRepository.createMany(list).then(() => {
        request(app)
          .post('/users/')
          .send({
            name: 'u3',
            lastName: 'ln3',
            email: 'e3@wolox.co',
            password: 'xswW1234'
          })
          .expect(201)
          .then(() => {
            request(app)
              .post('/users/sessions')
              .send({
                email: 'e3@wolox.co',
                password: 'xswW1234'
              })
              .expect(200)
              .then((res1: request.Response) => {
                request(app)
                  .get('/users')
                  .set({ Authorization: res1.body.token })
                  .query({ page: 2, limit: 3 })
                  .expect(200)
                  .then((res2: request.Response) => {
                    expect(res2.body.length).toBe(3);
                    expect(res2.body[0].name).toBe('name3');
                    done();
                  });
              });
          });
      });
    });
  });
  describe('/users POST', () => {
    it('should create an user', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          name: 'u3',
          lastName: 'ln3',
          email: 'e3@wolox.co',
          password: 'xswW1234'
        })
        .expect(201)
        .then(async () => {
          const user = await userRepository.findUser({
            name: 'u3'
          });
          expect(user).not.toBeNull();
          done();
        });
    });
    it('email taken', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          name: 'u3',
          lastName: 'ln3',
          email: 'e1@wolox.co',
          password: 'xswW1234'
        })
        .expect(409)
        .then((res: request.Response) => {
          expect(res.body.message).toBe('the email is taken');
          done();
        });
    });
    it('insecure password', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          name: 'u3',
          lastName: 'ln3',
          email: 'e3@wolox.co',
          password: 'wW1234'
        })
        .expect(422)
        .then((res: request.Response) => {
          expect(res.body.errors[0]).toBe('password: password too weak');
          done();
        });
    });
    it('incomplete data', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          lastName: 'ln3',
          email: 'e3@wolox.co',
          password: 'qqqwW1234'
        })
        .expect(422)
        .then(() => {
          done();
        });
    });
    describe('/users/:id GET', () => {
      it('should return user with id 1', (done: jest.DoneCallback) => {
        request(app)
          .get('/users/1')
          .expect(200)
          .then((res: request.Response) => {
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('id');
            done();
          });
      });
      it('should return error for user with id 5', (done: jest.DoneCallback) => {
        request(app)
          .get('/users/5')
          .expect(404)
          .then((res: request.Response) => {
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('internal_code');
            done();
          });
      });
    });
  });
  describe('/users/sessions POST', () => {
    it('should login user', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          name: 'u3',
          lastName: 'ln3',
          email: 'e3@wolox.co',
          password: 'xswW1234'
        })
        .expect(201)
        .then(() => {
          request(app)
            .post('/users/sessions')
            .send({
              email: 'e3@wolox.co',
              password: 'xswW1234'
            })
            .expect(200)
            .then((res: request.Response) => {
              expect(res.body.token).toBeDefined();
              done();
            });
        });
    });
    it('wrong password', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send({
          name: 'u3',
          lastName: 'ln3',
          email: 'e3@wolox.co',
          password: 'xswW1234'
        })
        .expect(201)
        .then(() => {
          request(app)
            .post('/users/sessions')
            .send({
              email: 'e3@wolox.co',
              password: 'xswW123'
            })
            .expect(401)
            .then((res: request.Response) => {
              expect(res.body.errors[0]).toBe('password: The account or password is incorrect');
              done();
            });
        });
    });
    it('user does not exist', (done: jest.DoneCallback) => {
      request(app)
        .post('/users/sessions')
        .send({
          email: 'e3xx@wolox.co',
          password: 'xswW1234'
        })
        .expect(401)
        .then((res: request.Response) => {
          expect(res.body.message).toBe('The account or password is incorrect');
          done();
        });
    });
  });
  it('login with email that does not belong to domain', (done: jest.DoneCallback) => {
    request(app)
      .post('/users/sessions')
      .send({
        email: 'e3@wolox.com',
        password: 'xswW123'
      })
      .expect(401)
      .then((res: request.Response) => {
        expect(res.body.errors[0]).toBe('email: The account or password is incorrect');
        done();
      });
  });
});
