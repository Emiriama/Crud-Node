// declaramos una variable para ocupar el framework express
const express = require("express");
const mysql= require("mysql2");

// Las variables se declaran con let o const
let bodyParser = require('body-parser');
let app = express();
const port = 10000;

// Configuramos la conexión a la base de datos MySQL
let con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mac0maes',
    database:'5IV8'
});

// Conectamos a MySQL
con.connect(err => {
    if(err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// Middleware para interpretar JSON y datos codificados en URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

// En public está todo el front (archivos estáticos)
app.use(express.static('public'));

// CREAR usuario (CREATE)
// Req es una petición y el res es la variable de respuesta
app.post('/users', (req, res) => {
    const { id, nombre } = req.body;

    // Insertamos en la tabla usuario
    con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });

        // Respondemos con los datos insertados
        res.status(201).json({ id: results.insertId, nombre });
    });
});

// LEER todos los usuarios (READ)
app.get('/users', (req, res) => {
    con.query('SELECT * FROM usuario', (err, results) => {
        if(err) return res.status(500).json({ error: err.message });

        // Enviamos los usuarios como JSON
        res.json(results);
    });
});

// LEER un usuario por id (READ)
app.get('/users/:id', (req, res) => {
    con.query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(results[0]);
    });
});

// ACTUALIZAR usuario (UPDATE)
app.put('/users/:id', (req, res) => {
    const { nombre } = req.body;

    con.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nombre, req.params.id], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ message: 'Usuario actualizado correctamente' });
    });
});

// ELIMINAR usuario (DELETE)
app.delete('/users/:id', (req, res) => {
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [req.params.id], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

// Iniciamos el servidor en el puerto definido
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
