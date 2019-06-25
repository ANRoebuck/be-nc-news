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

exports.patchArticleById = (vote, article_id) => {

    // return getArticleById(article_id)
    //     .then(article => {
    //         const newVotes = { votes: article.votes + vote.inc_votes }
    //         return connection('articles')
    //             .where({ article_id })
    //             .update(newVotes)
    //             .returning('*')
    //             .then(([updatedArticle]) => {
    //                 console.log(updatedArticle);
    //                 return updatedArticle;
    //             });
    //     });

    return connection
        .select('votes')
        .from('articles')
        .where({ article_id })
        .then(([article]) => {
            if(!article) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
            else {
                const newVotes = { votes: article.votes + vote.inc_votes }
                return connection('articles')
                    .where({ article_id })
                    .update(newVotes)
                    .returning('*')
                    .then(([updatedArticle]) => {
                        return updatedArticle;
                    });
            };
        });
};

exports.postCommentByArticleId = (comment, article_id) => {
    const newComment = {
        author: comment.username,
        body: comment.body,
        article_id
    };
    return connection
        .insert(newComment)
        .into('comments')
        .returning('*')
        .then(([addedComment]) => {
            if(!addedComment) return Promise.reject({status:404, message:`article does not exist: ${article_id}`})
            else return addedComment;
        });
};