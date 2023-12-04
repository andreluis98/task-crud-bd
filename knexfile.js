// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds:{
      directory:'./seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user:     'postgres',
      password: 'Senha123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds:{
      directory:'./seeds'
    }
  }

};
