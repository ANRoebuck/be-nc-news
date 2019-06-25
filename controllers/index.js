const {
    getTopics,
    getUserById,
    getArticleById,
    patchArticleById,
    postCommentByArticleId
} = require('../models');

exports.sendTopics = (req, res, next) => {
    getTopics()
        .then(rows => {
            res.status(200).send({rows});
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

exports.sendArticleById = (req, res, next) => {
    const { article_id } = req.params;
    getArticleById(article_id)
        .then(article => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params;
    patchArticleById(req.body, article_id)
        .then(result => {
            return getArticleById(article_id);
        })
        .then(updatedArticle => {
            res.status(201).send(updatedArticle);
        })
        .catch(next);
        //readme says to return updated article, not just updated value
        //correct to re-query db & use second model?
};

exports.addCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    postCommentByArticleId(req.body, article_id)
        .then(addedComment => {
            res.status(201).send(addedComment);
        })
        .catch(next);
};