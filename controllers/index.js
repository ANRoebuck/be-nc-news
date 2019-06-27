const { sendTopics } = require('./topicsControllers');
const { sendUserById } = require('./usersControllers');
const { sendArticles,
    sendArticleById,
    updateArticleById,
    addCommentByArticleId,
    sendCommentsByArticleId } = require('./articlesControllers');
const { updateComment, removeComment } = require('./commentsControllers');

module.exports = {
    sendTopics,
    sendUserById,
    sendArticles,
    sendArticleById,
    updateArticleById,
    addCommentByArticleId,
    sendCommentsByArticleId,
    updateComment,
    removeComment
};