require("dotenv").config();

const express = require("express");
const router = express.Router();

const axios = require("axios");
const { default: mongoose } = require("mongoose");

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

router.get("/single-comic/:id", async (req, res) => {
  try {
    let limit = 0;
    const arraysCharacterData = [];
    for (let i = 0; i < 15; i++) {
      if (i === 0) {
        const api_url = `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=E2KU4n8IJ4fe4C7R`;
        const response = await axios.get(api_url);
        arraysCharacterData.push(response.data.results);
      }

      limit += 100;

      const api_url = `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=E2KU4n8IJ4fe4C7R&skip=${limit}`;
      const response = await axios.get(api_url);
      arraysCharacterData.push(response.data.results);
    }

    const arrayCharacterMerge = [];
    arraysCharacterData.map((subArrayCharacterData) => {
      subArrayCharacterData.map((data) => {
        arrayCharacterMerge.push(data);
      });
    });

    const { id } = req.params;
    const characterByComicsId = [];

    for (let i = 0; i < arrayCharacterMerge.length; i++) {
      const comic = arrayCharacterMerge[i].comics;

      const result = await comic.find((element) => element === id);
      if (result) {
        characterByComicsId.push(arrayCharacterMerge[i]);
      }
    }
    res.json(characterByComicsId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
