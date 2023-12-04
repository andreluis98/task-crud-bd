const express = require('express');
const apiV1Router = express.Router();

apiV1Router.get('/filmes', (req, res) => {
    let sort = req.query.sort
    if (sort) {
        filmesOrdenados = filmes.sort((a, b) => a[sort].localeCompare(b[sort]))
        res.status(200).json(filmesOrdenados)
    } else {
        res.status(200).json(filmes)
    }
})

apiV1Router.get('/filmes/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let filme = filmes.find(p => p.id === id)
    res.status(200).json(filme)
})

apiV1Router.get('/filmes', (req, res) => {
    let filmes = req.body
    let maxID = Math.max.apply(Math, filmes.map(p => p.id))
    filme.id = maxID + 1;
    filmes.push(filme)
    res.status(201).json({
        message: `filme ${filme.nome} criado com sucesso`,
        data: {
            id: filme.id,
        }
    })
});

module.exports = apiV1Router;