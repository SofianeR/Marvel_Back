require('dotenv').config()

const axios = require('axios')

const express = require('express')
const formidableMiddleware = require('express-formidable')
const cors = require('cors')

const app = express()
app.use(formidableMiddleware())
app.use(cors())

const comicsRoutes = require('./Routes/comics.js')
app.use(comicsRoutes)

const charactersRoutes = require('./Routes/characters.js')
app.use(charactersRoutes)


app.get("*", (req,res)=>{
    res.status(400).json('Page introuvable')
})

app.listen(3000,()=>{
    console.log("Server launched 🚀")
})
