const { connection } = require('../connection');

exports.patchComment = ({ inc_votes = 0, comment_id }) => {
    return connection('comments')
    .where({ comment_id })
    .increment({ votes: inc_votes })
    .returning('*')
    .then(([ comment ]) => {
        if(!comment) return Promise.reject({status:404, message:`comment does not exist: ${comment_id}`})
        else return comment;
    });
};

exports.deleteComment = (comment_id) => {
    return connection('comments')
        .where({ comment_id })
        .del()
        .then(deletedRows => {
            if(deletedRows===0) return Promise.reject({status:404, message:`comment does not exist: ${comment_id}`})
            else return deletedRows;
        });
};