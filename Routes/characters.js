require('dotenv').config()

const express = require('express')
const router = express.Router()

const axios = require('axios')

router.get('/characters', async (req,res)=>{
    try {
        const api_url = `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_MARVEL}`
        
        const response = await axios.get(api_url)

        res.json(response.data)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.get('/character/:id', async (req,res)=>{
    try {
        const api_url = `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.id}?apiKey=${process.env.API_MARVEL}`

        const response = await axios.get(api_url)

        res.json(response.data)
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
})

module.exports = router