const express = require("express");
const articlesRouter = express.Router();
const {
    sendArticles,
    sendArticleById,
    updateArticleById,
    sendCommentsByArticleId,
    addCommentByArticleId
 } = require('../controllers');
const { errHandle405 } = require('../errHandle');


articlesRouter.get('/', sendArticles);

articlesRouter
    .route('/:article_id')
    .get(sendArticles)
    .patch(updateArticleById);


articlesRouter
    .route('/:article_id/comments')
    .get(sendCommentsByArticleId)
    .post(addCommentByArticleId)
//     .all(errHandle405)





module.exports = { articlesRouter };