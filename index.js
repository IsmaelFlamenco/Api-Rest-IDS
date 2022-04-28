const express = require("express");
const bodyParser = require('body-parser');
const mysql = require("mysql");
const sgMail = require ("@sendgrid/mail");
const text = require("body-parser/lib/types/text");
const path = require("path") //Libreria de node para rutas
const app = express();


sgMail.setApiKey("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")

// SWAGGER
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node MySQL CRUD API",
            version: "1.0.0",
        },
        servers: [
            {
                url:"http://localhost:3000",
            },
        ],
    },
    apis: ['./index.js']
}

// SETTINGS


// MySQL Connection
const conectar = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'isma',
    password:'IiSsMmAa12910',
    database:'prueba'
});

//Función de Conectar a la base de datos
conectar.connect(function(err) {
    if (err) {
        console.log("Error en la conexión");
    }else{
        console.log("Conexión Exitosa");
    }
})


// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'));
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

app.listen(3000, ()=> {
    console.log("El servidor está escuchando en el puerto 3000")
})

//Objeto de respuesta que vamos a devolver
let respuesta = { status: 200, mensaje: '', data: {} }

app.get("/",function(req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
})

//Objeto Usuario
let usuario = [
    {nombre : "Ismael", apellido : "Flamenco", edad: "21"},
    {nombre : "Tomás", apellido : "Acevedo Salazar", edad: "21"},
    {nombre : "Abigail", apellido : "Diaz Cabrera", edad: "21"},
    {nombre : "Laurent", apellido : "Vázquez Méndez", edad: "20"}
]


/**
 * @swagger
 * components:
 *  schemas:
 *      Usuario:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre de usuario
 *              apellido:
 *                  type: string
 *                  description: Apellido del usuario
 *              edad:
 *                  type: integer
 *                  description: Edad del usuario
 *          required:
 *              - nombre
 *              - apellido
 *              - edad
 *          example:
 *              nombre: Ismael
 *              apellido: Flamenco
 *              edad: 21
 */

/**
 * @swagger
 * /usuario:
 *  get:
 *      summary: Muestra todos los usuarios
 *      tags: [Usuario]
 *      responses:
 *          200:
 *              description: Consulta Exitosa!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/Usuario'
 * 
 */
//Seleccionando los usuarios
app.get("/usuario",function(req, res) {

    let query = 'SELECT * FROM usuarios';

    conectar.query(query, function(err, rows) {
        if (err) {
            console.log('Error de consulta: ',err);
            respuesta.status = 400;
            respuesta.mensaje = err;
        } else {
            respuesta.mensaje = 'Consulta Exitosa!';
            respuesta.data = rows;
        }
        res.json(respuesta);
    });

    // usuario.nombre = "Ismael";
    // res.json(usuario);
})

// app.post('/quotes', (req, res) => {
//     console.log(req.body);
//     res.redirect('/')
// })

//Insertando con el método POST el nombre de usuario
/**
 * @swagger
 * /insertarUsuario:
 *  post:
 *      summary: Crea un nuevo usuario
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Usuario' 
 *      responses:
 *          200:
 *              description: Nuevo usuario creado!
 * 
 */
app.post("/insertarUsuario",function(req, res) {
    let { nombre, apellido, edad } = req.body
    let query = 'INSERT INTO usuarios (nombre,apellido,edad) VALUES ("'+nombre+'","'+apellido+'","'+edad+'")';

    conectar.query(query, function(err, rows) {
        if (err) {
            console.log('Error al crear el usuario: ',err);
            respuesta.status = 400;
            respuesta.mensaje = err;
        } else {
            respuesta.mensaje = 'Nuevo usuario creado!';
            respuesta.data = rows;
        }
        console.log(respuesta);
        res.redirect('/');
    });
    
    // let { nombre, apellido, indice } = req.body

    // usuario[indice].nombre = nombre;
    // usuario[indice].apellido = apellido;

    // res.json(usuario);
})


/**
 * @swagger
 * /modificarUsuario:
 *  post:
 *      summary: Modifica un usuario
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          indice:
 *                              type: int
 *                              description: Id del Usuario
 *                          nombre:
 *                              type: string
 *                              description: Nombre de usuario
 *                          apellido:
 *                              type: string
 *                              description: Apellido del usuario
 *                          edad:
 *                              type: integer
 *                              description: Edad del usuario
 *                      required:
 *                          - indice
 *                      example:
 *                          indice: 10
 *                          nombre: Ismael
 *                          apellido: Flamenco
 *                          edad: 21
 *      responses:
 *          200:
 *              description: Actualización Exitosa!
 *          400:
 *              description: Error de actualización
 */
//Modificar con el método POST el usuario
app.post("/modificarUsuario",function(req, res) {
    let { nombre, apellido, edad, indice } = req.body
    let query = "UPDATE usuarios SET nombre='"+nombre+"',apellido='"+apellido+"',edad='"+edad+"' WHERE idUsuario='"+indice+"'";

    conectar.query(query, function(err, rows) {
        if (err) {
            console.log('Error de actualización: ',err);
            respuesta.status = 400;
            respuesta.mensaje = err;
        } else {
            respuesta.mensaje = 'Actualización Exitosa';
            respuesta.data = rows;
        }
        console.log(respuesta)
        res.redirect('/');
    });
    
    // let { nombre, apellido, indice } = req.body

    // usuario[indice].nombre = nombre;
    // usuario[indice].apellido = apellido;

    // res.json(usuario);
})


/**
 * @swagger
 * /eliminarUsuario:
 *  post:
 *      summary: Elimina un usuario
 *      tags: [Usuario]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          indice:
 *                              type: int
 *                              description: Id del Usuario
 *                      required:
 *                          - indice
 *                      example:
 *                          indice: 10
 *      responses:
 *          200:
 *              description: Eliminación Exitosa!
 *          400:
 *              description: Error de Eliminación
 */
//Eliminando con el método POST un usuario
app.post("/eliminarUsuario",function(req, res) {
    
    let { indice } = req.body

    let query = "DELETE FROM usuarios WHERE idUsuario="+indice+";";

    conectar.query(query, function(err, rows) {
        if (err) {
            console.log('Error de eliminación: ',err);
            respuesta.status = 400;
            respuesta.mensaje = err;
        } else {
            respuesta.mensaje = 'Eliminación Exitosa';
            respuesta.data = rows;
        }
        console.log(respuesta)
        res.redirect('/');
    });
    
    // let { indice } = req.body
    // usuario.splice(indice,1);

    // res.json(usuario);
})



/**
 * @swagger
 * /EnviarCorreo:
 *  post:
 *      summary: Envía un correo utilizando la API de sendgrid
 *      tags: [Otras Apis]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          emisor:
 *                              type: string
 *                              description: Quién envía el correo
 *                          receptor:
 *                              type: string
 *                              description: A quién se envía el correo
 *                          asunto:
 *                              type: string
 *                              description: Asunto o razón del correo
 *                          mensaje:
 *                              type: string
 *                              description: Cuerpo o texto del mensaje
 *                      required:
 *                          - emisor
 *                          - receptor
 *                      example:
 *                          emisor: ismael.flamenco@ulv.edu.mx
 *                          receptor: abigail.diaz@ulv.edu.mx
 *                          asunto: Prueba de Sendgrid
 *                          mensaje: Esta es una prueba de la api de Sendgrid
 *      responses:
 *          200:
 *              description: Mensaje Enviado!
 * 
 */
//SendGrid
app.post("/EnviarCorreo", function(req, res){
    let {to,from,subject, text} = req.body

    const mensaje = {
        to: to,
        from: from,
        subject: subject,
        text : text
    }

    sgMail
        .send(mensaje)
        .then(() => {
            console.log('Email sent')
            res.send('Correo enviado')
        })
        .catch((error) => {
            console.error(error)
        })

       

})