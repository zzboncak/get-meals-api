const LocationService = {
    getAllLocations(knex) {
        return knex
            .select('*')
            .from('locations');
    },

    insertLocation(knex, newLocation) {
        return knex
            .insert(newLocation)
            .into('locations')
            .returning('*')
            .then(arrayOfRows => {
                return arrayOfRows[0]
            });
    },

    getLocationComments(knex, location_id) {
        return knex
            .select('*')
            .from('comments')
            .where({ location_id })

    },

    getById(knex, id) {
        return knex
            .from('locations')
            .select('*')
            .where('id', id)
            .first();
    },

    getLocationTags(knex, location_id) {
        return knex
            .select('t.tag_name')
            .from('tag_relations as tr')
            .join('tags as t', 'tr.tag_id', '=', 't.id')
            .where({ location_id })
    },


    getByAddress(knex, street_address) {
        return knex
            .from('locations')
            .select('*')
            .where('street_address', street_address)
            .first();
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
    },

    addTagRelation(knex, tagRelation) {
        return knex
            .insert(tagRelation)
            .into('tag_relations')
            .returning('*')
            .then(arrayOfRows => {
                return arrayOfRows[0]
            });
    }
}

module.exports = LocationService;