const path = require('path')
const express = require('express')
const xss = require('xss')
const CommentsService = require('./commentsService')

const commentsRouter = express.Router()
const jsonParser = express.json()

const serializeComment = comment => ({
  id: comment.id,
  location_id: comment.location_id,
  comment_text: xss(comment.comment_text),
  has_concern: comment.has_concern
})

commentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CommentsService.getAllComments(knexInstance)
      .then(comments => {
        res.json(comments.map(serializeComment))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    //need to make sure the client passes comment_id in a POST request
    const { location_id, comment_text } = req.body
    const newComment = { location_id, comment_text }

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
    })

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(serializeComment(comment))
      })
      .catch(next)
  })

  commentsRouter
      .route('/:comment_id')
      .all((req, res, next) => {
          CommentsService.getCommentById(
              req.app.get('db'),
              req.params.comment_id
      )
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: { message: `Comment doesn't exist` }
          })
        }
        res.comment = comment
        next()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    CommentsService.deleteComment(
          req.app.get('db'),
          req.params.comment_id
      )
      .then(numRowsAffected => {
            res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { comment_text, has_concern } = req.body
    const commentToUpdate = { comment_text, has_concern }

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one field to update`
        }
      })

    CommentsService.updateComment(
      req.app.get('db'),
      req.params.comment_id,
      commentToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  

module.exports = commentsRouter