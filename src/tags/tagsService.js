const TagsService = {
    getAllTags(knex) {
        return knex
            .select('*')
            .from('tags');
    },

    insertTag(knex, newTag) {
        return knex
            .insert(newTag)
            .into('tags')
            .returning('*')
            .then(arrayOfRows => {
                return arrayOfRows[0]
            });
    },

    getTagById(knex, id) {
        return knex
            .from('tags')
            .select('*')
            .where('id', id)
            .first();
    },

}

module.exports = TagsService;