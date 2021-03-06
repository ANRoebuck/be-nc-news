
exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', articleTable => {
      articleTable.increments('article_id').primary();
      articleTable.string('title').notNullable();
      articleTable.text('body', 1000).notNullable();
      articleTable.integer('votes').defaultTo(0);
      articleTable.string('topic').references('topics.slug').notNullable();
      articleTable.string('author').references('users.username').notNullable();
      articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
