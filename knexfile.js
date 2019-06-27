const { DB_URL } = process.env
const ENV = process.env.NODE_ENV || 'development';
const { login } = require('./config')

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  },

};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      username: login.username,
      password: login.password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username: login.username,
      password: login.password
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };


