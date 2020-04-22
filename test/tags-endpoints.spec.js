const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Tags Endpoints', () => {
    let db;
  
    //get the test data from the helper
    const {
      testTags
    } = helpers.makeTestFixtures();
  
    //creates the knex instance for the database before each test suite
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      });
      app.set('db', db);
    });
  
    after('disconnect from db', () => db.destroy());
  
    before('cleanup', () => helpers.cleanTables(db));
  
    afterEach('cleanup', () => helpers.cleanTables(db));
  
    describe(`GET /api/tags`, () => {
        context(`Given no tags`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/tags')
                    .expect(200, [])
            });
        });
  
        context('Given there are tags in the database', () => {
            beforeEach('insert tags', () => {
                return helpers.seedTagsTable(db, testTags);
            });
    
            it('responds with 200 and all of the tags', () => {
                const expectedTags = testTags.map(tag =>
                    helpers.makeExpectedTag(tag)
                );
                return supertest(app)
                    .get('/api/tags')
                    .expect(200, expectedTags)
            });
        });
  
    });

    describe(`POST /api/tags`, () => {
        it(`adds a tag to the database`, () => {
            const newTag = { tag_name: 'new tag!' };
            const expectedTag = {
                id: 1,
                tag_name: 'new tag!'
            };

            return supertest(app)
                .post('/api/tags')
                .send(newTag)
                .expect(201)
                .expect(res => {
                    expect(res.body.tag_name).to.eql(expectedTag.tag_name)
                })
        })
    })

})