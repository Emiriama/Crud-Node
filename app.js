const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser');

const app = express();
const port = 10000;

// Conexión a MySQL
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mac0maes',
    database: '5IV8'
});

con.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// CRUD clásico

app.post('/agregarUsuario', (req, res) => {
    const { id, nombre } = req.body;

    con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, result) => {
        if (err) {
            console.error('Error al agregar usuario:', err);
            return res.send('<p>Error al agregar usuario.</p><a href="/">Volver</a>');
        }
        res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Usuario Agregado</title>
          <link rel="stylesheet" href="estilo.css">
        </head>
        <body>
          <header class="banner">
            <div class="banner-texto">
              <h1>CRUD de Usuarios</h1>
            </div>
          </header>
          <main class="contenedor">
            <section class="card-form">
              <h2>Éxito</h2>
              <p>El usuario fue <strong>agregado correctamente</strong>.</p>
              <a href="/" class="boton">Volver al inicio</a>
            </section>
          </main>
        </body>
        </html>
        `);
    });
});

app.post('/borrarUsuario', (req, res) => {
    const { id } = req.body;

    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al borrar usuario:', err);
            return res.send('<p>Error al borrar usuario.</p><a href="/">Volver</a>');
        }

        if (result.affectedRows === 0) {
            return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <title>Usuario No Encontrado</title>
              <link rel="stylesheet" href="estilo.css">
            </head>
            <body>
              <header class="banner">
                <div class="banner-texto">
                  <h1>CRUD de Usuarios</h1>
                </div>
              </header>
              <main class="contenedor">
                <section class="card-form">
                  <h2>Atención</h2>
                  <p>El usuario no fue encontrado.</p>
                  <a href="/" class="boton">Volver al inicio</a>
                </section>
              </main>
            </body>
            </html>
            `);
        }

        res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Usuario Eliminado</title>
          <link rel="stylesheet" href="estilo.css">
        </head>
        <body>
          <header class="banner">
            <div class="banner-texto">
              <h1>CRUD de Usuarios</h1>
            </div>
          </header>
          <main class="contenedor">
            <section class="card-form">
              <h2>Éxito</h2>
              <p>El usuario fue <strong>eliminado correctamente</strong>.</p>
              <a href="/" class="boton">Volver al inicio</a>
            </section>
          </main>
        </body>
        </html>
        `);
    });
});


// Ruta con CSS aplicado
app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.send('<p>Error al obtener usuarios.</p><a href="/">Volver</a>');
        }

        let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Lista de Usuarios</title>
          <link rel="stylesheet" href="estilo.css">
        </head>
        <body>
          <header class="banner">
            <div class="banner-texto">
              <h1>CRUD de Usuarios</h1>
            </div>
          </header>
          <main class="contenedor">
            <section class="card-form">
              <h2>Lista de Usuarios</h2>
              <ul style="list-style: none; padding-left: 0;">`;

        results.forEach(user => {
            html += `<li>ID: ${user.id_usuario} - Nombre: ${user.nombre}</li>`;
        });

        html += `
              </ul>
              <a href="/" class="boton">Volver al inicio</a>
            </section>
          </main>
        </body>
        </html>
        `;

        res.send(html);
    });
});


// API REST (opcional, si lo usas con Postman o Fetch)
app.post('/users', (req, res) => {
    const { id, nombre } = req.body;
    con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, nombre });
    });
});

app.get('/users', (req, res) => {
    con.query('SELECT * FROM usuario', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/users/:id', (req, res) => {
    con.query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

app.put('/users/:id', (req, res) => {
    const { nombre } = req.body;
    con.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nombre, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado correctamente' });
    });
});

app.delete('/users/:id', (req, res) => {
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

// Servidor activo
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
