const {
    patchComment,
    deleteComment
} = require('../models');

exports.updateComment = (req, res, next) => {
    patchComment({... req.body, ...req.params })
        .then(comment => {
            res.status(200).send({ comment });
        })
        .catch(next);
};

exports.removeComment = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};