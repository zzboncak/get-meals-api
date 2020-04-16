const path = require('path');
const express = require('express');
const xss = require('xss');
const LocationService = require('./locationsService');
const Client = require("@googlemaps/google-maps-services-js").Client; // Google Maps Geocoding API for Node.js. For more info visit https://googlemaps.github.io/google-maps-services-js/

const client = new Client({}); // Instance of the Google Maps Services client.

const locationsRouter = express.Router();
const jsonParser = express.json();

const serializeLocation = location => ({
    id: location.id,
    location_name: location.location_name,
    street_address: location.street_address,
    city: location.city,
    state: location.state,
    zip: location.zip,
    location_longitude: location.location_longitude,
    location_latitude: location.location_latitude,
    open_hour: location.open_hour,
    close_hour: location.close_hour,
    website: location.website,
    location_description: xss(location.location_description),
    location_type: location.location_type
  });
  
  locationsRouter
    .route('/')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      LocationService.getAllLocations(knexInstance)
        .then(locations => {
          //limit size to the first 50 elements
          res.json(locations.map(serializeLocation))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
      //discuss with team which parameters should be required
      console.log(req.body);
      const { location_name, street_address, city, state, zip } = req.body
      const newLocation = { location_name, street_address, city, state, zip }
  
      for (const [key, value] of Object.entries(newLocation))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
      
      LocationService.getByAddress(
        req.app.get('db'),
        street_address
      )
        .then(location => {
          if(!location) { // if the location doesn't exist in the database, geocode the address and add it to the database
            client.geocode({
              params: {
                address: `${street_address} ${city}, ${state} ${zip}`,
                key: process.env.GOOGLE_MAPS_API_KEY
              }
            })
              .then(r => {
                const coordinates = r.data.results[0].geometry.location;
                const location_longitude = coordinates.lng;
                const location_latitude = coordinates.lat;
                newLocation.location_longitude = location_longitude;
                newLocation.location_latitude = location_latitude;
                return LocationService.insertLocation(
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
              .catch(e => console.log(e));
          } else { // if the location is already in the database, don't add anything, just return the existing location
            res.json({existingLocation: location})
          }
        })
    })
  
    locationsRouter
      .route('/:location_id')
      .all((req, res, next) => {
        let location = LocationService.getById(req.app.get('db'), req.params.location_id);
        let tags = LocationService.getLocationTags(req.app.get('db'), req.params.location_id);
        let comments = LocationService.getLocationComments(req.app.get('db'), req.params.location_id);

        Promise.all([location, tags, comments]) // Retrieve the location data, tags associated with the location, and comments associated with the location
          .then(values => {
            console.log(values);
            let location = values[0];
            let tags = values[1].map(obj => obj.tag_name); // the service object returns an array of individual objects, this is to just get an array of the tag names
            let comments = values[2];

            if(!location) {
              return res.status(404).json({
                error: { message: `Location doesn't exist` }
              })
            }

            res.locations = location;
            res.tags = tags;
            res.comments = comments;

            next()
          })
      .catch(next)
    })
    .get((req, res, next) => {
        res.json({
          location: serializeLocation(res.locations),
          tags: res.tags,
          comments: res.comments
        })
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