/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('usuarios', (table) => {
       table.increments ('id').primary()
       table.string('nome').unique().notNullable()
       table.string('email').unique().notNullable()
       table.string('login').unique().notNullable()
       table.string('senha').notNullable()
       table.string('roles').notNullable()
     })
   };
   
   /**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */
   exports.down = function(knex) {
       return knex.schema.dropTable('usuarios')
   };
   