const {
    getTopics,
    getUserById,
    getArticles,
    patchArticleById,
    postCommentByArticleId,
    getCommentsByArticleId,
    patchComment,
    deleteComment
} = require('../models');

exports.sendTopics = (req, res, next) => {
    getTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(next);
};

exports.sendUserById = (req, res, next) => {
    const { username } = req.params;
    getUserById(username)
        .then(user => {
            res.status(200).send({ user });
        })
        .catch(next);
};

exports.sendArticles = (req, res, next) => {
    getArticles({...req.params, ...req.query})
        .then(articles => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.sendArticleById = (req, res, next) => {
    getArticles({...req.params, ...req.query})
        .then(([ article ])=> {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.updateArticleById = (req, res, next) => {
    patchArticleById({ ...req.params, ...req.body })
        .then(([ article ]) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.addCommentByArticleId = (req, res, next) => {
    postCommentByArticleId({ ...req.body, ...req.params })
        .then(comment => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
    getCommentsByArticleId({ ...req.params, ...req.query })
        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

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