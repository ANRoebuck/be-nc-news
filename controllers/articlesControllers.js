const {
    getArticles,
    patchArticleById,
    postCommentByArticleId,
    getCommentsByArticleId
} = require('../models');

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