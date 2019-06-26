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

exports.getArticles = ({ article_id, sort_by = 'created_at', order = 'asc', author, topic }) => {
    return connection
        .select('articles.*')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .count({ comment_count: 'comments.comment_id' })
        .groupBy('articles.article_id')
        .orderBy(sort_by, order)
        .modify(query => {
            if(article_id) query.where({ 'articles.article_id': article_id })
            if(author) query.where({ 'articles.author': author })
            if(topic) query.where({ 'articles.topic': topic})
        })
        .then(returnedArticles => {
            if(returnedArticles.length === 0) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
            else return returnedArticles;
        });
};

exports.patchArticleById = (vote, article_id) => {
    return connection('articles')
        .where({ article_id })
        .increment({ votes: vote.inc_votes })
        .returning('*')
        .then(([article]) => {
            if(!article) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
            else return article;
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

exports.getCommentsByArticleId = (article_id, { sort_by, order}) => {
    return connection
        .select('*')
        .from('comments')
        .where({ article_id })
        .orderBy(sort_by || 'created_at', order || 'asc')
        .then(rows => {
            if(rows.length === 0) return Promise.reject({status: 404, message:`article does not exist: ${article_id}`});
            else return rows.map(row => {
                delete row.article_id
                return row;
            });
        });
};

exports.patchComment = ( vote, comment_id) => {
    return connection('comments')
    .where({ comment_id })
    .increment({ votes: vote.inc_votes })
    .returning('*')
    .then(rows => {
        if(rows.length === 0) return Promise.reject({status:404, message:`comment does not exist: ${comment_id}`})
        else return rows;
    });
};

exports.deleteComment = (comment_id) => {
    return connection('comments')
        .where({ comment_id })
        .del()
        .then(deletedRows => {
            if(deletedRows===0) return Promise.reject({status:404, message:`comment does not exist: ${comment_id}`})
            else return deletedRows;
        });
}