exports.up = function(knex) {
    return knex.schema.createTable("filmes", tbl => {
      tbl.increments('id');
      tbl.string('titulo', 255).notNullable();
      tbl.string('diretor', 128).notNullable();
      tbl.integer('ano_lancamento').notNullable();
      tbl.float('avaliacao').notNullable();
      tbl.text('sinopse').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("filmes");
  };
  