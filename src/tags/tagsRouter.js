const path = require('path')
const express = require('express')
const xss = require('xss')
const TagsService = require('./tagsService')

const tagsRouter = express.Router()
const jsonParser = express.json()

const serializeTag = tag => ({
  id: tag.id,
  tag_name: xss(tag.tag_name)
});

tagsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    TagsService.getAllTags(knexInstance)
      .then(tags => {
        res.json(tags.map(serializeTag))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    //need to make sure the client passes tag_name in a POST request
    const { tag_name } = req.body;
    const newTag = { tag_name };

    for (const [key, value] of Object.entries(newTag)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }

    TagsService.insertTag(
      req.app.get('db'),
      newTag
    )
      .then(tag => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tag.id}`))
          .json(serializeTag(tag))
      })
      .catch(next)
  })

  tagsRouter
      .route('/:tag_id')
      .all((req, res, next) => {
        TagsService.getTagById(
            req.app.get('db'),
            req.params.tag_id
      )
        .then(tag => {
          if (!tag) {
            return res.status(404).json({
              error: { message: `Tag doesn't exist` }
            })
          }
          res.tag = tag;
          next()
        })
        .catch(next)
      })
      .get((req, res, next) => {
        TagsService.getTagById(
          req.app.get('db'),
          res.tag.id
        )
          .then(tag => res.json(serializeTag(tag)))
          .catch(next)
      })
  

module.exports = tagsRouter;