const express = require('express');
const knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
const apiV2Router = express.Router();
const knex = require('knex')(knexConfig)
const jwt = require('jsonwebtoken')
apiV2Router.use(express.json());

const checkToken = (req, res, next) => {
    console.log('Authorization Header:', req.headers['authorization']);
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    console.log('Token:', token);

    if (token) {
        const autoType = req.headers['authorization'].split(' ')[0];

        if (autoType !== 'Bearer') {
            console.log('Tipo de autenticação inválido');
            res.status(401).json({ erro: 'Tipo de autenticação inválido' });
            return;
        } else {
            jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
                if (err) {
                    console.error('Erro na verificação do token:', err);
                    res.status(401).json({ erro: 'Token inválido', errorDetails: err });
                    return;
                } else {
                    console.log('Token válido. Dados:', data);
                    req.token = data;
                    next();
                }
            });
        }
    } else {
        console.log('Token não informado');
        res.status(401).json({ erro: 'Token não informado' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.token.roles.indexOf('ADMIN') === -1) {
        res.status(403).json({ erro: 'Acesso Negado' })
    } else {
        next()
    }
}

apiV2Router.get('/filmes', checkToken, (req, res) => {
    knex('filmes').select('id', 'titulo', 'diretor', 'ano_lancamento', 'avaliacao', 'sinopse')
        .then(dados => res.status(200).json(dados))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: `Erro ao recuperar lista de filmes: ${err.message}` })
        })
})


apiV2Router.get('/filmes/:id', checkToken, (req, res) => {
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


apiV2Router.post('/filmes', checkToken, isAdmin, (req, res) => {
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

apiV2Router.put('/filmes/:id', checkToken, isAdmin, (req, res) => {
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


apiV2Router.delete('/filmes/:id', checkToken, isAdmin, (req, res) => {
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
