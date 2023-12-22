require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const apiSegu = require('./routes/apiSeg');
const knex = apiSegu.knex; //
const fetch = require('node-fetch');

// Página de login
app.get('/seg/login', (req, res) => {
  const loginPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        label {
          display: block;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <form method="post" action="/seg/login">
        <h2>Login</h2>
        <label for="login">Login:</label>
        <input type="text" name="login" required><br>
        <label for="senha">Senha:</label>
        <input type="password" name="senha" required><br>
        <button type="submit">Entrar</button>
      </form>
    </body>
    </html>
  `;
  res.send(loginPage);
});


// Página de registro
app.get('/seg/register', (req, res) => {
  const registerPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registro</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        label {
          display: block;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <form method="post" action="/seg/register">
        <h2>Registro</h2>
        <label for="nome">Nome:</label>
        <input type="text" name="nome" required><br>
        <label for="email">E-mail:</label>
        <input type="email" name="email" required><br>
        <label for="login">Login:</label>
        <input type="text" name="login" required><br>
        <label for="senha">Senha:</label>
        <input type="password" name="senha" required><br>
        <label for="roles">Roles:</label>
        <input type="text" name="roles" required><br>
        <button type="submit">Registrar</button>
      </form>
    </body>
    </html>
  `;
  res.send(registerPage);
});



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
  // console.log(`Data: ${new Date()} - Method: ${req.method} - URL: ${req.url}`);
  next();
});

morgan.token('type', function (req, res) { return req.headers['content-type'] });

// Rota para exibir a página de login
app.post('/seg/login', express.json(), async (req, res) => {
  try {
    const result = await loginUser(req.body);

    if (result.token) {
      const filmesResponse = await fetch('http://localhost:3000/api/v2/filmes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Authorization Header:', `Bearer ${result.token}`);

      const contentType = filmesResponse.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const filmes = await filmesResponse.json();
        res.status(result.status).json({
          token: result.token,
          usuario: {
            nome: result.usuario.nome,
            email: result.usuario.email,
          },
          filmes: filmes,
          // redirectUrl: '/api/v2/filmes',
        });
      } else {
        res.status(result.status).json({
          token: result.token,
          usuario: {
            nome: result.usuario.nome,
            email: result.usuario.email,
          },
          filmes: await filmesResponse.text(),
          // redirectUrl: '/api/v2/filmes',
        });
      }
    } else {
      res.status(result.status).json(result);
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Rota para exibir a página de registro
app.get('/seg/register', (req, res) => {
  res.send(registerPage);
});

// Endpoint para processar o registro
app.post('/seg/register', async (req, res) => {
  try {
      const { nome, email, login, senha, roles } = req.body;

      const existingUser = await knex('usuarios').where({ login }).first();
      if (existingUser) {
          return res.status(400).json({ erro: 'Login já está em uso' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      await knex('usuarios').insert({
          nome,
          email,
          login,
          senha: hashedPassword,
          roles
      });

      res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (error) {
      console.error('Erro durante o registro:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Função loginUser
const loginUser = async (credentials) => {
  try {
    // Obtenha o usuário do banco de dados com base no login fornecido
    const ret = await knex('usuarios').where({ login: credentials.login });

    if (ret.length === 0) {
      return {
        status: 401,
        erro: 'Usuário não encontrado',
      };
    }

    const usuario = ret[0];

    // Compare as senhas usando bcrypt
    const senhaCorreta = await bcrypt.compare(credentials.senha, usuario.senha);

    if (senhaCorreta) {
      // Gere um token usando jwt e retorne as informações do usuário
      const token = jwt.sign({ id: usuario.id, roles: usuario.roles }, process.env.SECRET_KEY, { expiresIn: '1h' });

      return {
        status: 200,
        token: token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          roles: usuario.roles,
        },
      };
    } else {
      return {
        status: 401,
        erro: 'Credenciais inválidas',
      };
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    return {
      status: 500,
      erro: 'Erro interno do servidor',
    };
  }
};

// Rota para processar o login
app.post('/seg/login', express.json(), async (req, res) => {
  try {
    const result = await loginUser(req.body);

    if (result.token) {
      // console.log('result.token', result.token)
      const filmesResponse = await fetch('http://localhost:3000/api/v2/filmes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`,
          'Content-Type': 'application/json',
        },
      });

      const contentType = filmesResponse.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const filmes = await filmesResponse.json();
        res.status(result.status).json({
          token: result.token,
          usuario: {
            nome: result.usuario.nome,
            email: result.usuario.email,
          },
          filmes: filmes,
          redirectUrl: '/api/v2/filmes',
        });
      } else {
        res.status(result.status).json({
          token: result.token,
          usuario: {
            nome: result.usuario.nome,
            email: result.usuario.email,
          },
          filmes: filmesResponse.text(),
          redirectUrl: '/api/v2/filmes',
        });
      }
    } else {
      res.status(result.status).json(result);
    }
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

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

const apiSeg = require ('./routes/apiSeg')
app.use('/seg', apiSeg);

app.use((req, res) => {
    res.status(404).send(`<h2>Erro 404 - Recurso não encontrado</h2>`)
})

app.listen (3000, () => {
    console.log ('Servidor rodando na porta 3000')
})
