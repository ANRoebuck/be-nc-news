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

exports.sendArticles = (req, res, next) => {
    getArticles({...req.params, ...req.query})
        .then(article => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params;
    patchArticleById(req.body, article_id)
        .then(result => {
            return getArticles(article_id);
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

exports.sendCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    getCommentsByArticleId(article_id, req.query)
        .then(comments => {
            res.status(200).send(comments);
        })
        .catch(next);
};

exports.updateComment = (req, res, next) => {
    const vote = req.body;
    const { comment_id } = req.params;
    patchComment(vote, comment_id)
        .then(updatedComment => {
            res.status(201).send(updatedComment);
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