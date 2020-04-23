const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Location Endpoints', function() {
    let db;
  
    //get the test data from the helper
    const {
      testLocations,
      testTags
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
        context(`Given no locations`, () => {
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
    
            it('responds with 200 and all of the locations', () => {
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

    describe('POST /api/locations', () => {
        const newLocation = {
            location_name: 'Test Location',
            street_address: '12345 Test st.',
            city: 'Denver',
            state: 'Colorado',
            zip: 80202,
            open_hour: '10:00 AM',
            close_hour: '04:00 PM',
            website: 'www.test.com',
            location_description: 'test description',
            location_type: 'Other Non-Profit'
        }

        it(`creates a location, responding with 201 and the new location`, () => {
            return supertest(app)
                .post('/api/locations')
                .send(newLocation)
                .expect(201)
                .expect(res => {
                    expect(res.body.location_name).to.eql(newLocation.location_name)
                    expect(res.body.street_address).to.eql(newLocation.street_address)
                    expect(res.body.city).to.eql(newLocation.city)
                    expect(res.body.state).to.eql(newLocation.state)
                    expect(res.body.zip).to.eql(newLocation.zip)
                    expect(res.body.open_hour).to.eql("10:00:00") // The database converts the text into this datatype
                    expect(res.body.close_hour).to.eql("16:00:00") // The database converts the text into this datatype
                    expect(res.body.website).to.eql(newLocation.website)
                    expect(res.body.location_description).to.eql(newLocation.location_description)
                    expect(res.body.location_type).to.eql(newLocation.location_type)
                    expect(res.headers.location).to.eql(`/api/locations/${res.body.id}`)
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/locations/${postRes.body.id}`)
                        .expect(postRes.body)
                })
        })

        const requiredFields = ['location_name', 'street_address', 'city', 'state', 'zip']

        requiredFields.forEach(field => {
            const newLocation = {
                location_name: 'test name',
                street_address: 'test address',
                city: 'test city',
                state: 'test state',
                zip: '12345'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newLocation[field]

                return supertest(app)
                    .post('/api/locations')
                    .send(newLocation)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe(`DELETE /api/locations/:location_id`, () => {
        context('Given there are locations in the database', () => {
            
            beforeEach('insert locations', () => {
                return db
                    .into('locations')
                    .insert(testLocations)
            })
        
            it('responds with 204 and removes the location', () => {
                const idToRemove = 2
                const expectedLocations = testLocations.filter(location => location.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/locations/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/locations`)
                            .expect(expectedLocations)
                    )
            })
        })

        context(`Given no locations`, () => {
            it(`responds with 404`, () => {
                const locationId = 123456
                return supertest(app)
                    .delete(`/api/locations/${locationId}`)
                    .expect(404, { error: { message: `Location doesn't exist` } })
            })
        })
    })

    describe(`POST /api/locations/:location_id/tag`, () => {
        beforeEach('insert locations', () =>
            helpers.seedLocationsTable(
                db,
                testLocations,
            )
        )

        beforeEach('insert tags', () =>
            helpers.seedTagsTable(
                db,
                testTags,
            )
        )

        it(`responds with 201 to show the tag relation was created`, () => {
            const tagRelationToAdd = { tag_id: 1 };

            return supertest(app)
                .post('/api/locations/1/tag')
                .send(tagRelationToAdd)
                .expect(201)
        })
    })

})