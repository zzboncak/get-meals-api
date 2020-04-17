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

By [Sejin Hwang](https://github.com/seejins), [John Lee](https://github.com/johlee92), [Victoria Moore](https://github.com/JaggerSofia), [Peggy Sturman](https://github.com/glamazon), and [Zack Zboncak](https://github.com/zzboncak).