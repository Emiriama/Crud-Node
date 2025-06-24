//declaramos una variable para ocupar el framework express
const express = require("express")
const mysql= require("mysql2")

//Las variables de declaran con var
let bodyParser=require('body-parser')
let app=express()
let con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mac0maes',
    database:'5IV8'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))

//En public esta todo el front
app.use(express.static('public'))

//Métodos para crud insertar usuario
//Hay metodos post, crud, delete, etc.

//Req es una petición y el res es la variable de respueta
app.post('/agregarUsuario',(req,res)=>{
        let nombre=req.body.nombre
        let id=req.body.id

        con.query('INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send("Error al conectar");
            }
           
            return res.send(`<h1>Nombre:</h1> ${nombre}`);
        });
   
})

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fun consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);

        // Las comillas son para concatenar
        //Un query me va a devolver muchos datos, por lo que se hace un for each por que son muchos
        var userHTML=``;
        var i=0;

           //El for each sirve para iterar datos
           //i Significa el número 
        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

// READ (Consultar todos los usuarios) 
app.get('/usuarios', (req, res) => {
    con.query('SELECT * FROM usuario', (err, resultados) => {
        if (err) {
            console.error("Error al consultar usuarios:", err);
            return res.status(500).send("Error al consultar usuarios");
        }
        res.json(resultados); // Enviar resultados como JSON
    });
});

// UPDATE (Actualizar usuario)
app.post('/actualizarUsuario', (req, res) => {
    let id = req.body.id;
    let nuevoNombre = req.body.nombre;

    con.query(
        'UPDATE usuario SET nombre = ? WHERE id_usuario = ?',
        [nuevoNombre, id],
        (err, resultado) => {
            if (err) {
                console.error("Error al actualizar usuario:", err);
                return res.status(500).send("Error al actualizar usuario");
            }
            res.send("Usuario actualizado exitosamente");
        }
    );
});

// DELETE-
app.post('/eliminarUsuario', (req, res) => {
    let id = req.body.id;

    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            return res.status(500).send("Error al eliminar usuario");
        }
        res.send("Usuario eliminado exitosamente");
    });
});

// Ruta para actualizar un usuario
app.put('/actualizarUsuario', (req, res) => {
    const id = req.body.id;
    const nombreNuevo = req.body.nombre;

    if (!id || !nombreNuevo) {
        return res.status(400).send("ID y nuevo nombre son requeridos");
    }

    const sql = 'UPDATE usuario SET nombre = ? WHERE id_usuario = ?';
    con.query(sql, [nombreNuevo, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar:", err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.send("Usuario actualizado correctamente");
    });
});
