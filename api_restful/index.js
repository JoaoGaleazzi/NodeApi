// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dbConfig = require('./config/db.config');

// Configurando o Express
const app = express();
app.use(bodyParser.json());

// Conectando ao MySQL
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// Conexão ao banco de dados
connection.connect(error => {
    if (error) throw error;
    console.log("Conectado ao banco de dados MySQL!");
});

// Definindo a porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// ---------------------- ROTAS ------------------------------------------------------------

// Criar novo usuário
app.post('/usuario', (req, res) => {
    const { nomeusuario, emailusuario, idadeusuario } = req.body; 
    if (!nomeusuario || !emailusuario || !idadeusuario) {
        return res.status(400).send({ message: 'Campos faltando!' });
    }

    const query = "INSERT INTO usuario (nome, email, idade) VALUES (?, ?, ?)";
    connection.query(query, [nomeusuario, emailusuario, idadeusuario], (error, results) => {
        if (error) throw error;
        res.send({ message: "Usuário criado com sucesso!", userId: results.insertId });
    });
});


// Buscar todos os usuários
app.get('/usuario', (req, res) => {
    console.log("Rota de listagem de usuários foi chamada");
    connection.query("SELECT id,nome, email, idade FROM usuario", (error, results) => {
        if (error) {
            console.error("Erro ao buscar usuários:", error);
            return res.status(500).send({ message: "Erro no servidor" });
        }
        res.send(results);
    });
});


// Buscar usuário por ID
app.get('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM usuario WHERE id = ?";
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        res.send(results[0]);
    });
});



// Atualizar usuário
app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const { nomeusuario, emailusuario, idadeusuario } = req.body;

    const query = "UPDATE usuario SET nome = ?, email = ?, idade = ? WHERE id = ?";
    connection.query(query, [nomeusuario, emailusuario, idadeusuario, id], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        res.send({ message: "Usuário atualizado com sucesso!" });
    });
});


/// Deletar usuário
app.delete('/usuario/:id', (req, res) => {
    const { id } = req.params;
    
    const query = "DELETE FROM usuario WHERE id = ?";
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        res.send({ message: "Usuário deletado com sucesso!" });
    });
});

