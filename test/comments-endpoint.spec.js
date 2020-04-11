const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
    let db;
  
    //get the test data from the helper
    const {
      testLocations,
      testComments,
    } = helpers.makeTestFixtures()
  
    //creates the knex instance for the database before each test suite
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))
  
    describe(`GET /api/comments`, () => {
        context(`Given no comments`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/comments')
                    .expect(200, [])
            })
        })
  
        context('Given there are comments in the database', () => {
            beforeEach('insert comments', () => {
                helpers.seedLocationsTable(db,testLocations)
                helpers.seedCommentsTable(db,testComments)
            })
    
            it('responds with 200 and all of the comments', () => {
                const expectedComments = testComments.map(comment =>
                    helpers.makeExpectedComment(comment)
            )
            return supertest(app)
                .get('/api/comments')
                .expect(200, expectedComments)
            })
        })
  
    })

})