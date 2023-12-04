require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

let filmes =
[
    {
      "id": 1,
      "titulo": "Matrix",
      "diretor": "Lana Wachowski",
      "ano_lancamento": 1999,
      "avaliacao": 8.7,
      "sinopse": "Um hacker descobre a verdade sobre a realidade."
    },
    {
      "id": 2,
      "titulo": "Pulp Fiction",
      "diretor": "Quentin Tarantino",
      "ano_lancamento": 1994,
      "avaliacao": 8.9,
      "sinopse": "Histórias interligadas de criminosos em Los Angeles."
    },
    {
      "id": 3,
      "titulo": "Inception",
      "diretor": "Christopher Nolan",
      "ano_lancamento": 2010,
      "avaliacao": 8.8,
      "sinopse": "Um ladrão entra nos sonhos dos outros para roubar segredos."
    },
    {
      "id": 4,
      "titulo": "The Shawshank Redemption",
      "diretor": "Frank Darabont",
      "ano_lancamento": 1994,
      "avaliacao": 9.3,
      "sinopse": "Um homem inocente enfrenta a dura realidade da prisão."
    },
    {
      "id": 5,
      "titulo": "The Dark Knight",
      "diretor": "Christopher Nolan",
      "ano_lancamento": 2008,
      "avaliacao": 9.0,
      "sinopse": "Batman enfrenta um criminoso insano conhecido como Coringa."
    }
  ]
  

app.use((req, res, next) => {
    console.log(`Data: ${new Date()} - Method: ${req.method} - URL: ${req.url}`)
    next()
})

morgan.token('type', function (req, res) { return req.headers['content-type'] })

app.get('/', (req, res) => {
    res.send(`Hello to API World<br>
        <a href="/api/filmes">API de Filmes</a>`)
})

app.get('/api/filmes', (req, res) => {
    let sort = req.query.sort
    if (sort) {
        filmesOrdenados = filmes.sort((a, b) => a[sort].localeCompare(b[sort]))
        res.status(200).json(filmesOrdenados)
    }
    else
        res.status(200).json(filmes)
})

app.get('/api/filmes/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let filme = filmes.find(p => p.id === id)
    res.status(200).json(filme)
})

app.post('/api/filmes', express.json(), (req, res) => {
    res.status(200).send(`Recebido o nome: ${req.body.nome}`)
})


const apiV1Router = require('./routes/apiV1Router')
app.use('/api/v1', apiV1Router);

const apiV2Router = require('./routes/apiV2Router')
app.use('/api/v2', apiV2Router);

app.use((req, res) => {
    res.status(404).send(`<h2>Erro 404 - Recurso não encontrado</h2>`)
})

app.listen (3000, () => {
    console.log ('Servidor rodando na porta 3000')
})
