const { connection } = require('../connection');

const { getTopics } = require('./topicsModels');
const { getUserById } = require('./usersModels');
const { getArticles,
    patchArticleById,
    postCommentByArticleId,
    getCommentsByArticleId } = require('./articlesModels');
const { patchComment, deleteComment } = require('./commentsModels');

module.exports = {
    getTopics,
    getUserById,
    getArticles,
    patchArticleById,
    postCommentByArticleId,
    getCommentsByArticleId,
    patchComment,
    deleteComment
};