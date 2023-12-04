const express = require('express');
const knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
const apiV2Router = express.Router();
const knex = require('knex')(knexConfig)
apiV2Router.use(express.json());

apiV2Router.get('/filmes', (req, res) => {
    knex('filmes').select('id', 'titulo', 'diretor', 'ano_lancamento', 'avaliacao', 'sinopse')
        .then(dados => res.status(200).json(dados))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: `Erro ao recuperar lista de filmes: ${err.message}` })
        })
})


apiV2Router.get('/filmes/:id', (req, res) => {
    let id = parseInt(req.params.id)

    knex('filmes').select('id', 'titulo', 'diretor', 'ano_lancamento', 'avaliacao', 'sinopse').where({ id: id })
        .then(dados => {
            if (dados.length === 0) {
                res.status(404).json({ message: `Filme ${id} não encontrado` })
            } else {
                res.status(200).json(dados[0])
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: `Erro ao recuperar filme: ${err.message}` })
        })
})


apiV2Router.post('/filmes', (req, res) => {
    const novoFilme = req.body;

    knex('filmes').insert(novoFilme)
        .then(ids => {
            res.status(201).json({ id: ids[0], message: 'Filme criado com sucesso' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: `Erro ao criar filme: ${err.message}` });
        });
});

apiV2Router.put('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const filmeAtualizado = req.body;

    knex('filmes').where({ id: id }).update(filmeAtualizado)
        .then(() => {
            res.status(200).json({ message: `Filme ${id} atualizado com sucesso` });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: `Erro ao atualizar filme: ${err.message}` });
        });
});


apiV2Router.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    knex('filmes').where({ id: id }).del()
        .then(() => {
            res.status(200).json({ message: `Filme ${id} excluído com sucesso` });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: `Erro ao excluir filme: ${err.message}` });
        });
});

module.exports = apiV2Router;
