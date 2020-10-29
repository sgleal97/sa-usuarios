'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Usuario = require('../models/usuario')
const Contador = require('../models/contador')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req, res) => {
    res.send({ message: "Microservicio de usuarios" })
})

app.get('/login', (req, res) => {
    console.log(req.body)
    
    let usuario = req.query.email
    let password = req.query.password

    Usuario.findOne({email: usuario, password: password}, (err, usuarioDB) => {
        if(err) res.status(500).send({message: `Error al loguearse: ${err}`})
        if(!usuarioDB) res.status(404).send({message: `El usuario o password no coinciden`})
        res.status(200).send({usuario: usuarioDB})
    })
})

app.get('/jugadores', (req, res) => {
    Usuario.find({}, (err, usuario) => {
        if (err) res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!usuario) res.status(404).send({message: `Usuarios inexistentes: ${err}`})
        res.status(200).send({usuario})
    })
})

app.get('/jugadores/:id', (req, res) => {
    let usuarioId = req.params.id

    Usuario.findOne({id: usuarioId}, (err, usuario) => {
        if (err) res.status(500).send({message: `Error al realizar la peticion: ${err}`})//500 Datos invalidos
        if (!usuario) res.status(404).send({message: `Usuario no encontrado: ${err}`})
        res.status(200).send({usuario})
    })
})

app.post('/jugadores', async function(req, res){
    let contador = await Contador.find()
    let id = contador.length

    let contador2 = new Contador()
    contador2.contador = id
    
    contador2.save((err, contadorStore) => {
        if (err) res.status(401).send({message: `Error al guardar generador: ${err}`})//500 Datos invalidos
    })

    let usuario = new Usuario()
    usuario.id = id
    usuario.nombres = req.body.nombres
    usuario.apellidos = req.body.apellidos
    usuario.email = req.body.email
    usuario.password = req.body.password
    usuario.administrador = req.body.administrador

    usuario.save((err, usuarioStore) => {
        if (err) res.status(401).send({message: `Error al guardar nuevo usuario: ${err}`})//500 Datos invalidos
        res.status(201).send({usuario: usuarioStore})
    })
})

app.put('/jugadores/:id', (req, res) => {
    let jugadorId = req.params.id
    let update = req.body

    Usuario.findOneAndUpdate(jugadorId, update, (err, usuarioUpdate) => {
        if (err) res.status(401).send({message: `Error al guardar nuevo usuario: ${err}`})//500 Datos invalidos
        res.status(201).send({usuario: usuarioUpdate})
    })
})

app.delete('/jugadores/:id', (req, res) => {
    let jugadorId = req.params.id

    Usuario.findOne({id: jugadorId}, (err, usuario) => {
        if (err) res.status(500).send({message: `Error al borrar usuario: ${err}`})

        usuario.remove(err => {
            if (!usuario) res.status(404).send({message: `Usuario no encontrado: ${err}`})
            res.status(200).send({message: 'El usuario ha sido eliminado'})
        })
    })
})

app.get('/prueba', (req, res)=>{
    
})

mongoose.connect('mongodb://mongo:27017/usuario', (err, res) => {
    if (err){
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    console.log('Conexion a base de datos establecida...')
})

module.exports = app