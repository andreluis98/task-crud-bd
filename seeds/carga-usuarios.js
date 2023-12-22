const bcrypt = require('bcryptjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([
    {id: 1, nome: 'Adminstrador', email: 'admin@mail.com',login: 'admin',
      senha: bcrypt.hashSync('1234'),roles: 'ADMIN;USER'},
    {id: 2, nome: 'Usuario comum', email: 'user@mail.com',login: 'user',
      senha: bcrypt.hashSync('1234'), roles: 'USER'},
  ]);
};
