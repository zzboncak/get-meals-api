# Get Meals API

## Database Setup
To set up the database:
1. Make sure you are in psql in your command line.
2. Run the SQL command `CREATE USER foodles;`.
3. Run the SQL command `CREATE DATABASE get_meals OWNER foodles;`.
4. Ensure your .env file is created and has the line `DB_URL="postgresql://foodles@localhost/get_meals"`.
5. Exit psql and run the command `npm run migrate` to create the tables in the database.
6. To seed the database with a few locations, run `psql -U foodles -d get_meals -f ./seeds/seed.locations.sql` in your command line.

### Base URL: https://frozen-everglades-23155.herokuapp.com/api

## Overview:

This API exists so that users can report and find places that distribute free or discounted food and meals. 

## Endpoints:

#### Get all locations using GET /locations

Call this endpoint to see all locations that have been reported as giving out meals.

**Example:**
```javascript
fetch(`https://frozen-everglades-23155.herokuapp.com/api/locations`)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
**Example response:**
```javascript
[
    {
        "id": 1,
        "location_name": "Highpoint Church",
        "street_address": "1805 High Point Drive",
        "city": "Naperville",
        "state": "Illinois",
        "zip": 60563,
        "location_longitude": -88.12316,
        "location_latitude": 41.805286,
        "open_hour": "11:00:00",
        "close_hour": "13:00:00",
        "website": "www.highpoint.church",
        "location_description": "They pass out food and pantry goods",
        "location_type": "Other Non-Profit"
    },
    {
        "id": 2,
        "location_name": "Slavation Army St. Charles",
        "street_address": "1710 S. 7th Avenue",
        "city": "St. Charles",
        "state": "Illinois",
        "zip": 60174,
        "location_longitude": -88.29455,
        "location_latitude": 41.901653,
        "open_hour": "10:00:00",
        "close_hour": "14:00:00",
        "website": "centralusa.salvationarmy.org/tricity/",
        "location_description": "They do the most good",
        "location_type": "Food Bank"
    }
]
```

#### Get a particular location using GET /locations/:location_id

Calling this endpoint will return information on the location, and any tags or comments associated with it.

**Example:**
```javascript
fetch(`https://frozen-everglades-23155.herokuapp.com/api/locations/2`)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
**Example response:**
```javascript
{
    "location": {
        "id": 2,
        "location_name": "Highpoint Church",
        "street_address": "1805 High Point Drive",
        "city": "Naperville",
        "state": "Illinois",
        "zip": 60563,
        "location_longitude": -88.12316,
        "location_latitude": 41.805286,
        "open_hour": "11:00:00",
        "close_hour": "13:00:00",
        "website": "www.highpoint.church",
        "location_description": "They pass out food and pantry goods",
        "location_type": "Other Non-Profit"
    },
    "tags": [],
    "comments": []
}
```
#### Add a location using POST /locations/

**Required fields:** `location_name` (type = string), `street_address` (type = string), `city` (type = string), `state` (type = string), `zip` (type = integer). 

*Optional fields:* `open_hour` (type = time), `close_hour` (type = time), `website` (type = string), `location_description` (type = string), `location_type` (must be one of "Restaurant", "Food Bank", "School", or "Other Non-Profit").

If successful, the server responds with a status of 201 and the location data (see below). If you're missing a required, field, you'll get a status of 400. Longitude and latitude are calculated automatically via [Google Maps Geocoding API](https://github.com/googlemaps/google-maps-services-js).

**Example request:**
```javascript
const newLocation = {
    location_name: "DuPage Pads",
    street_address: "601 West Liberty",
    city: "Wheaton",
    state: "IL",
    zip: 60187
};

fetch(`https://frozen-everglades-23155.herokuapp.com/api/locations`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newLocation)
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

**Example response:**
```javascript
{
    "id": 3,
    "location_name": "DuPage Pads",
    "street_address": "601 West Liberty",
    "city": "Wheaton",
    "state": "IL",
    "zip": 60187,
    "location_longitude": -88.11469,
    "location_latitude": 41.864346,
    "open_hour": null,
    "close_hour": null,
    "website": null,
    "location_description": "",
    "location_type": null
}
```

#### Add a tag to a location using POST /locations/:location_id/tag

**Requirements:** Be sure to supply the `location_id` in the parameters, and a `tag_id` in the request body

**Example request:**
```javascript
fetch(`https://frozen-everglades-23155.herokuapp.com/api/locations/2/tag`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: {
        "tag_id": 1
    }
})
    .then(res => {
        if (!res.ok) {
            throw new Error('Could not add tag relation')
        }
    })
    .catch(err => console.log(err))
```
**NOTE** The server simply responds with a status code of 201 to let you know the relation was created. Once you GET the location again, you'll find the tag has been added

#### Read what tags are available with GET /tags

**Example request:**
```javascript
fetch(`https://frozen-everglades-23155.herokuapp.com/api/tags`)
    .then(res => {
        if(!res.ok) {
            throw new Error('Could not fetch the tags')
        }
        return res.json()
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
```
**Example response:**
```javascript
[
    {
        "id": 1,
        "tag_name": "Hot food"
    },
    {
        "id": 2,
        "tag_name": "Dry goods"
    },
    {
        "id": 3,
        "tag_name": "Pantry items"
    },
    {
        "id": 4,
        "tag_name": "Breakfast for kids"
    },
    {
        "id": 5,
        "tag_name": "Lunch for kids"
    },
    {
        "id": 6,
        "tag_name": "Free meals"
    },
    {
        "id": 7,
        "tag_name": "Free meals for healthcare workers"
    },
    {
        "id": 8,
        "tag_name": "Free for kids"
    },
    {
        "id": 9,
        "tag_name": "Discount meals"
    },
    {
        "id": 10,
        "tag_name": "Produce"
    },
    {
        "id": 11,
        "tag_name": "Free for seniors"
    },
    {
        "id": 12,
        "tag_name": "Household amenities"
    },
    {
        "id": 13,
        "tag_name": "Drive-thru"
    },
    {
        "id": 14,
        "tag_name": "Curbside Pickup"
    },
    {
        "id": 15,
        "tag_name": "Accepts EBT"
    }
]
```

#### Post a comments about a location with POST /comments

Use this endpoint to post a comment about a location. Be sure to supply the `location_id` and `comment_text` in the request body, these are **required**. *Optional* supply `has_concern` as a boolean to alert an admin that info about a location is inaccurate.

**Example:**
```javascript
let newComment = {
    location_id: 2,
    comment_text: 'This place distributes eggs, but only 1 dozen per family',
    has_concern: false
};

fetch(`https://frozen-everglades-23155.herokuapp.com/api/comments`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
})
    .then(res => {
        if (!res.ok) {
            throw new Error('Could not add tag relation')
        }
        return res.json()
    })
    .then(datt => console.log(data))
    .catch(err => console.log(err))
```
**Example response:**
```javascript
{
    "id": 7,
    "location_id": 2,
    "comment_text": "This place distributes eggs, but only 1 dozen per family",
    "has_concern": false
}
```

By [Sejin Hwang](https://github.com/seejins), [John Lee](https://github.com/johlee92), [Victoria Moore](https://github.com/JaggerSofia), [Peggy Sturman](https://github.com/glamazon), and [Zack Zboncak](https://github.com/zzboncak).