const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
    let db;
  
    //get the test data from the helper
    const {
      testLocations
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
  
    describe(`GET /api/locations`, () => {
        context(`Given no articles`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/locations')
                    .expect(200, [])
            })
        })
  
        context('Given there are locations in the database', () => {
            beforeEach('insert locations', () =>
                helpers.seedLocationsTable(
                    db,
                    testLocations,
                )
            )
    
            it('responds with 200 and all of the articles', () => {
                const expectedLocations = testLocations.map(location =>
                    helpers.makeExpectedLocation(
                    location
                )
            )
            return supertest(app)
                .get('/api/locations')
                .expect(200, expectedLocations)
            })
        })
  
        context(`Given an XSS attack location`, () => {
        })
    })

})