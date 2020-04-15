function makeLocationsArray() {
    return[
        {
            id: 1,
            location_name: 'Highpoint Church',
            street_address: '1805 High Point Drive',
            city: 'Naperville', 
            state: 'Illinois',
            zip: 60563,
            open_hour: '11:00:00',
            close_hour: '13:00:00',
            website: 'www.highpoint.church',
            location_description: 'They pass out food and pantry goods',
            location_type: 'Other Non-Profit'
        },
        {
            id: 2,
            location_name: 'Slavation Army St. Charles',
            street_address: '1710 S. 7th Avenue',
            city: 'St. Charles',
            state: 'Illinois',
            zip: 60174,
            open_hour: '10:00:00',
            close_hour: '14:00:00',
            website: 'centralusa.salvationarmy.org/tricity/',
            location_description: 'They do the most good',
            location_type: 'Food Bank'
        }
    ]
}

function makeCommentsArray() {
    return[
        {
            id: 1,
            location_id: 1,
            comment_text: 'location 1 comment 1',
            has_concern: false
        },
        {
            id: 2,
            location_id: 1,
            comment_text: 'location 1 comment 2',
            has_concern: false
        },
        {
            id: 3,
            location_id: 2,
            comment_text: 'location 2 comment 1',
            has_concern: false
        },
        {
            id: 4,
            location_id: 2,
            comment_text: 'location 2 comment 2',
            has_concern: false
        }
    ]
}

function makeTestFixtures() {
    const testLocations = makeLocationsArray();
    const testComments = makeCommentsArray();
    return { testLocations, testComments }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                locations,
                comments
                CASCADE;
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE locations_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('locations_id_seq', 0)`),
                trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('comments_id_seq', 0)`),
            ])
        )
    )
}

function seedLocationsTable(db, location) {
    return db.transaction(async trx => {
        await trx.into('locations').insert(location)
    })
}

function seedCommentsTable(db, comment) {
    return db.transaction(async trx => {
        await trx.into('comments').insert(comment)
    })
}

function makeExpectedLocation(location) {
    return {
        id: location.id,
        location_name: location.location_name,
        street_address: location.street_address,
        city: location.city,
        state: location.state,
        zip: location.zip,
        open_hour: location.open_hour,
        close_hour: location.close_hour,
        website: location.website,
        location_description: location.location_description,
        location_type: location.location_type
    }
}

function makeExpectedComment(comment) {
    return {
        id: comment.id,
        location_id: comment.location_id,
        comment_text: comment.comment_text,
        has_concern: comment.has_concern
    }
}

module.exports = {
    makeTestFixtures,
    cleanTables,
    seedLocationsTable,
    seedCommentsTable,
    makeExpectedLocation,
    makeExpectedComment,
}