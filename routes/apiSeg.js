const express = require('express');
const apiSeg = express.Router();
const knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(knexConfig)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


apiSeg.knex = knex; 

apiSeg.post('/register', async (req, res) => {
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

apiSeg.post('/login', (req, res) => {
    const { login, senha } = req.body;

    knex('usuarios').where({ login })
        .then((ret) => {
            if (ret.length === 0) {
                res.status(401).json({ erro: 'Usuário não encontrado' });
            } else {
                const usuario = ret[0];

                if (bcrypt.compareSync(senha, usuario.senha)) {
                    jwt.sign({ id: usuario.id, roles: usuario.roles }, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
                        if (err) {
                            res.status(500).json({ erro: err });
                        } else {
                            // Note que agora retornamos o token corretamente
                            res.status(200).json({ token });
                        }
                    });
                } else {
                    res.status(401).json({ erro: 'Usuário ou senha inválidos' });
                }
            }
        })
        .catch((err) => {
            // Corrigimos aqui, alterando o status para 500 e retornando o erro
            res.status(500).json({ erro: err.message || 'Erro interno do servidor' });
        });
});


module.exports = apiSeg;