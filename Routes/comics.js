require("dotenv").config();

const express = require("express");
const router = express.Router();

const axios = require("axios");

router.get("/comics", async (req, res) => {
  try {
    let str = "";

    if (req.query) {
      if (req.query) {
        const arrayFilters = Object.keys(req.query);

        arrayFilters.map((filter, index) => {
          str += `&${filter}=${req.query[filter]}`;
        });
      }
    }
    const url = `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_MARVEL}${str}`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/comics/:id", async (req, res) => {
  try {
    const api_url = `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=${process.env.API_MARVEL}`;

    const response = await axios.get(api_url);

    // res.json(api_url)
    res.json(response.data);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
