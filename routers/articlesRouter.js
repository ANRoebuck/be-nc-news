const express = require("express");
const articlesRouter = express.Router();
const {
    sendArticleById,
    updateArticleById,
    addCommentByArticleId
 } = require('../controllers');
const { errHandle405 } = require('../errHandle');


// articlesRouter.get('/', sendArticles);

articlesRouter
    .route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleById);


articlesRouter
    .route('/:article_id/comments')
    .post(addCommentByArticleId)
//     .get(getCommentsByArticleId)
//     .all(errHandle405)






    



module.exports = { articlesRouter };