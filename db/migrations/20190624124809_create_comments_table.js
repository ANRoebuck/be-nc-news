
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', commentsTable => {
      commentsTable.increments('comment_id').primary();
      commentsTable.integer('author').references('users.username').notNullable();
      commentsTable.integer('article_id').references('articles.article_id').notNullable();
      commentsTable.integer('votes');
      commentsTable.integer('created_at');
      commentsTable.string('body');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
