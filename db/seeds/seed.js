const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../index.js');

const { formatDate, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex, Promise) {

  return knex.migrate.rollback()
  .then(()=>{
    return knex.migrate.latest();
  })
  .then(() => {
    const topicsInsertions = knex('topics').insert(topicData);
    const usersInsertions = knex('users').insert(userData);
    return Promise.all([topicsInsertions, usersInsertions])
  })
  .then(() => {
    const dateFormattedArticles = formatDate(articleData); 
    return knex('articles').insert(dateFormattedArticles).returning('*');
  })
  .then(articleRows => {
    console.log(commentData[0]);
    const articleRef = makeRefObj(articleRows, 'title', 'article_id');
    let formattedComments = formatComments(commentData, articleRef);
    formattedComments = formatDate(formattedComments);
    console.log(formattedComments[0]);
    return knex('comments').insert(formattedComments);
  }); 
  
};
