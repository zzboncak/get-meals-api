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
            beforeEach('insert locations', () => {
                return helpers.seedLocationsTable(db,testLocations)
            })

            beforeEach('insert comments', () =>{
                return helpers.seedCommentsTable(db,testComments)
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

    describe('POST /api/comments', () => {
        const newComment = {
            location_id: 1,
            comment_text: 'test text',
            has_concern: false
        }

        beforeEach('add locations', () => {
            return helpers.seedLocationsTable(db,testLocations)
        })

        it(`creates a comment, responding with 201 and the new comment`, () => {
            return supertest(app)
                .post('/api/comments')
                .send(newComment)
                .expect(201)
                .expect(res => {
                    expect(res.body.location_id).to.eql(newComment.location_id)
                    expect(res.body.comment_text).to.eql(newComment.comment_text)
                    expect(res.body.has_concern).to.eql(newComment.has_concern)
                    expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/api/comments/${postRes.body.id}`)
                        .expect(postRes.body)
                })
        })

        const requiredFields = ['location_id', 'comment_text']

        requiredFields.forEach(field => {
            const newComment = {
                location_id: 1,
                comment_text: 'test text',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newComment[field]

                return supertest(app)
                    .post('/api/comments')
                    .send(newComment)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe(`PATCH /api/comments/:comment_id`, () => {
        context(`Given no comments`, () => {
            it(`responds with 404`, () => {
                const articleId = 123456
                return supertest(app)
                .delete(`/api/comments/${articleId}`)
                .expect(404, { error: { message: `Comment doesn't exist` } })
            })
        })
    
        context('Given there are comments in the database', () => {
    
            beforeEach('insert locations', () => {
                return helpers.seedLocationsTable(db,testLocations)
            })

            beforeEach('insert comments', () =>{
                return helpers.seedCommentsTable(db,testComments)
            })
    
            it('responds with 204 and updates the article', () => {
                const idToUpdate = 4
                const updateComment = {
                    comment_text: 'updated location 2 comment 2',
                    has_concern: true
                }
                const expectedComment = {
                    ...testComments[idToUpdate - 1],
                    ...updateComment
                }
                return supertest(app)
                    .patch(`/api/comments/${idToUpdate}`)
                    .send(updateComment)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/comments/${idToUpdate}`)
                        .expect(expectedComment)
                    )
            })
    
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/comments/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain at least one field to update`
                        }
                    })
            })
    
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 4
                const updateComment = {
                    comment_text: 'updated location 2 comment 2',
                }
                const expectedComment = {
                    ...testComments[idToUpdate - 1],
                    ...updateComment
                }
        
                return supertest(app)
                    .patch(`/api/comments/${idToUpdate}`)
                    .send({
                        ...updateComment,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/comments/${idToUpdate}`)
                        .expect(expectedComment)
                )
            })
        })
    })

    describe(`DELETE /api/comments/:comment_id`, () => {
        context('Given there are comments in the database', () => {
            
            beforeEach('insert locations', () => {
                return helpers.seedLocationsTable(db,testLocations)
            })

            beforeEach('insert comments', () =>{
                return helpers.seedCommentsTable(db,testComments)
            })
        
            it('responds with 204 and removes the location', () => {
                const idToRemove = 2
                const expectedComments = testComments.filter(comment => comment.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/comments/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/comments`)
                            .expect(expectedComments)
                    )
            })
        })

        context(`Given no comments`, () => {
            it(`responds with 404`, () => {
                const commentId = 123456
                return supertest(app)
                    .delete(`/api/comments/${commentId}`)
                    .expect(404, { error: { message: `Comment doesn't exist` } })
            })
        })
    })

})