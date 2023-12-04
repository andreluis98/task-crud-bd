/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('filmes').del();
  
  // Inserts seed entries
  // await knex('filmes').insert([
  //   {id: 1, titulo: 'Matrix', diretor: 'Lana Wachowski', ano_lancamento: 1999, avaliacao: 8.7, sinopse: 'Um hacker descobre a verdade sobre a realidade.'},
  //   {id: 2, titulo: 'Pulp Fiction', diretor: 'Quentin Tarantino', ano_lancamento: 1994, avaliacao: 8.9, sinopse: 'Histórias interligadas de criminosos em Los Angeles.'},
  //   {id: 3, titulo: 'Inception', diretor: 'Christopher Nolan', ano_lancamento: 2010, avaliacao: 8.8, sinopse: 'Um ladrão entra nos sonhos dos outros para roubar segredos.'}
  // ]);
  await knex('filmes').insert([
    { id: 1, titulo: 'The Shawshank Redemption', diretor: 'Frank Darabont', ano_lancamento: 1994, avaliacao: 9.3, sinopse: 'Um banqueiro é condenado à prisão por um crime que não cometeu.' },
    { id: 2, titulo: 'The Godfather', diretor: 'Francis Ford Coppola', ano_lancamento: 1972, avaliacao: 9.2, sinopse: 'Um drama sobre uma família mafiosa italiana nos Estados Unidos.' },
    { id: 3, titulo: 'The Dark Knight', diretor: 'Christopher Nolan', ano_lancamento: 2008, avaliacao: 9.0, sinopse: 'Batman enfrenta o Coringa para salvar Gotham City.' }
  ]);
  
};

