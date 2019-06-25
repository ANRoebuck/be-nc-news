const { connection } = require('../connection');
const { makeRefObj } = require('../db/utils/utils.js');

exports.getTopics = () => {
    return connection
        .select('*')
        .from('topics');
};

exports.getUserById = (username) => {
    return connection
        .select('*')
        .from('users')
        .where({ username })
        .then(rows => {
            if(rows.length === 0) return Promise.reject({status: 404, message: `user does not exist: ${username}`});
            else return rows[0];
        });
};

exports.getArticleById = (article_id) => {
    return connection
        .select('article_id')
        .from('comments')
        .groupBy('article_id')
        .count('article_id')
        .then(comments => {
            const refObj = makeRefObj(comments, 'article_id', 'count');
            return connection
                .select('*')
                .from('articles')
                .where({ article_id })
                .then(([article]) => {
                    if(!article) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
                    else {
                        article.comment_count = refObj[article.article_id];
                        return article;
                    };
                });
        });
};