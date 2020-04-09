const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/foodles')
      .expect(200, 'Hello, team Foodles!')
  });
});
