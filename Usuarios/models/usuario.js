'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsuarioSchema = Schema({
    id: {type: Number, unique: true},
    nombres: String,
    apellidos: String,
    email: {type: String, unique: true},
    password: String,
    administrador: Boolean
})

module.exports = mongoose.model('Usuario', UsuarioSchema)