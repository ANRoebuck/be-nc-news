
exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', articleTable => {
      articleTable.increments('article_id').primary();
      articleTable.string('title').notNullable();
      articleTable.integer('votes');
      articleTable.string('topic').referenfes('topics.slug').notNullable();
      articleTable.integer('created_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
