const { connection } = require('../connection');

exports.getTopics = () => {
    return connection
        .select('*')
        .from('topics')
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

exports.getArticles = ({ article_id, sort_by, order = 'desc', author, topic }) => {
    const validSorts = ['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count'];
    const sort = (validSorts.includes(sort_by))? sort_by : 'created_at';

    return connection
        .select('articles.*')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .count({ comment_count: 'comments.comment_id' })
        .groupBy('articles.article_id')
        .orderBy(sort, order)
        .modify(query => {
            if(article_id) query.where({ 'articles.article_id': article_id })
            if(author) query.where({ 'articles.author': author })
            if(topic) query.where({ 'articles.topic': topic})
        })
        .then(returnedArticles => {
            return returnedArticles.map(article => {
                article.comment_count = parseInt(article.comment_count);
                return article;
            });
        })
        .then(returnedArticles => {
            if(returnedArticles.length === 0) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
            else return returnedArticles;
        });
};

exports.patchArticleById = ({ inc_votes = 0, article_id }) => {
    return connection('articles')
        .where({ article_id })
        .increment({ votes: inc_votes })
        .returning('*')
        .then(([ article ]) => {
            if(!article) return Promise.reject({status:404, message: `article does not exist: ${article_id}`});
            else return article_id
        })
        .then(article_id => {
            return this.getArticles({ article_id });
        });
};

exports.postCommentByArticleId = ({ username, body, article_id }) => {
    const newComment = {
        author: username,
        body,
        article_id
    };
    //test article exists
    return connection
        .select('article_id')
        .from('articles')
        .where({ article_id })
        .then(([ article ]) => {
            if(!article) return Promise.reject({status:422, message:`unprocessable entity`});
            else return connection
                .insert(newComment)
                .into('comments')
                .returning('*')
                .then(([addedComment]) => {
                    return addedComment;
                });
        });
};

exports.getCommentsByArticleId = ({article_id, sort_by, order = 'desc'}) => {
    const validSorts = ['comment_id', 'votes', 'created_at', 'author', 'body'];
    const sort = (validSorts.includes(sort_by))? sort_by : 'created_at';

    return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where({ article_id })
        .orderBy(sort, order)
        .then(comments => {
            if(comments.length === 0){
                // --> invalid article **OR** valid article with no comments
                return connection
                    .select('article_id')
                    .from('articles')
                    .where({ article_id })
                    .then(articles => {
                        if(articles.length === 0) return Promise.reject({status: 404, message:`article does not exist: ${article_id}`});
                            //invalid article
                        else return [];
                            //valid artilce with no comments
                    })
            }
            else return comments;
        });
};

exports.patchComment = ({ inc_votes = 0, comment_id }) => {
    return connection('comments')
    .where({ comment_id })
    .increment({ votes: inc_votes })
    .returning('*')
    .then(([ comment ]) => {
        if(!comment) return Promise.reject({status:404, message:`comment does not exist: ${comment_id}`})
        else return comment;
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