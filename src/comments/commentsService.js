const CommentsService = {
    getAllComments(knex) {
        return knex.select('*').from('comments')
    },

    insertComment(knex, newComment) {
        return knex
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(arrayOfRows => {
                return arrayOfRows[0]
            })
    },

    getCommentById(knex, id) {
        return knex.from('comments').select('*').where('id', id).first()
    },

    deleteComment(knex, id) {
        return knex('comments')
            .where({ id })
            .delete()
    },

    updateComment(knex, id, newCommentFields) {
        return knex('comments')
            .where({ id })
            .update(newCommentFields)
    }
}

module.exports = CommentsService;