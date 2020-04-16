const LocationService = {
    getAllLocations(knex) {
        return knex.select('*').from('locations');
    },

    //
    insertLocation(knex, newLocation) {
        // returned an empty object that says that the promise has been resolved
        // return Promise.resolve({})
        return knex
            .insert(newLocation)
            .into('locations')
            .returning('*')
            .then(arrayOfRows => {
                return arrayOfRows[0]
            });
    },

    //get the comments related to the specific location

    getLocationComments(knex, id) {
        return knex
            .select('*').from('comments')

    },

    getById(knex, id) {
        // Need to also check the tag relations table to see all of the tags associated with a location_id
        return knex.from('locations').select('*').where('id', id).first();
    },

    getLocationTags(knex, location_id) {
        return knex
            .select('t.tag_name')
            .from('tag_relations as tr')
            .join('tags as t', 'tr.tag_id', '=', 't.id')
            .where({ location_id })
    },

    getByAddress(knex, street_address) {
        return knex.from('locations').select('*').where('street_address', street_address).first();
    },

    deleteLocation(knex, id) {
        return knex('locations')
            .where({ id })
            .delete();
    },

    updateLocation(knex, id, newLocationFields) {
        return knex('locations')
            .where({ id })
            .update(newLocationFields);
    }
}

module.exports = LocationService;