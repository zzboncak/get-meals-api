const path = require('path')
const express = require('express')
const xss = require('xss')
const LocationService = require('./locationsService')

const locationsRouter = express.Router()
const jsonParser = express.json()

const serializeLocation = location => ({
    id: location.id,
    location_name: location.location_name,
    street_address: location.street_address,
    city: location.city,
    state: location.state,
    zip: location.zip,
    open_hour: location.open_hour,
    close_hour: location.close_hour,
    website: location.website,
    location_description: xss(location.location_description),
    location_type: location.location_type
  })
  
  locationsRouter
    .route('/')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      LocationService.getAllLocations(knexInstance)
        .then(locations => {
          res.json(locations.map(serializeLocation))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      //discuss with team which parameters should be required
      const { location_name, street_address, city, state, zip } = req.body
      const newLocation = { location_name, street_address, city, state, zip }
  
      for (const [key, value] of Object.entries(newLocation))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
  
      LocationService.insertLocation(
        req.app.get('db'),
        newLocation
      )
        .then(location => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${location.id}`))
            .json(serializeLocation(location))
        })
        .catch(next)
    })
  
    locationsRouter
        .route('/:location_id')
        .all((req, res, next) => {
            LocationService.getById(
                req.app.get('db'),
                req.params.location_id
        )
        .then(location => {
          if (!location) {
            return res.status(404).json({
              error: { message: `Location doesn't exist` }
            })
          }
          //need to talk about this one below res.location might be a problem
          res.locations = location
          //don't forget to call enxt so the next middleware happens!
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeLocation(res.locations))
    })
    .delete((req, res, next) => {
        LocationService.deleteLocation(
            req.app.get('db'),
            req.params.location_id
        )
        .then(numRowsAffected => {
              res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { location_name, street_address, city, state, zip, open_hour, close_hour, website, location_description, location_type } = req.body
      const locationToUpdate = { location_name, street_address, city, state, zip, open_hour, close_hour, website, location_description, location_type }
  
      const numberOfValues = Object.values(locationToUpdate).filter(Boolean).length
      if (numberOfValues === 0)
        return res.status(400).json({
          error: {
            message: `Request body must contain at least one field to update`
          }
        })
  
      LocationService.updateLocation(
        req.app.get('db'),
        req.params.location_id,
        locationToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
  

module.exports = locationsRouter