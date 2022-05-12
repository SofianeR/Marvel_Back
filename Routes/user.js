require("dotenv").config();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const express = require("express");
const router = express.Router();

const axios = require("axios");

const mongoose = require("mongoose");

const User = require("../Models/User");
mongoose.connect(process.env.MONGODB_URI);

router.post("/user/signup", async (req, res) => {
  try {
    if (
      !req.fields.email ||
      !req.fields.username.length < 3 ||
      !req.fields.password < 3
    ) {
      const checkForMail = await User.findOne({
        email: req.fields.email.toLowerCase(),
      });
      if (!checkForMail) {
        const token = uid2(24);
        const salt = uid2(24);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.fields.email.toLowerCase(),
          username: req.fields.username,
          hash: hash,
          token: token,
          salt: salt,
        });
        await newUser.save();
        res.json(newUser);
      } else {
        res.status(400).json("un compte existe deja avec cet email");
      }
    } else {
      res.status(400).json("Unauthorized");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const checkForUser = await User.findOne({
      email: req.fields.email.toLowerCase(),
    });
    if (checkForUser) {
      const hashToCheck = SHA256(
        req.fields.password + checkForUser.salt
      ).toString(encBase64);

      if (hashToCheck === checkForUser.hash) {
        res.json({
          email: checkForUser.email,
          username: checkForUser.username,
          token: checkForUser.token,
          _id: checkForUser._id,
          favoris: checkForUser.favoris,
        });
      } else {
        res.status(400).json({ message: "Erreur identifiant" });
      }
    } else {
      res.status(400).json({ message: "Erreur identifiants" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/user/favoris", async (req, res) => {
  try {
    const clientToken = req.headers.authorization.replace("Bearer ", "");

    const findUser = await User.findOne({ token: clientToken });
    if (findUser) {
      if (req.fields.favoris) {
        const copy = [...findUser.favoris];

        const arrayClient = JSON.parse(req.fields.favoris);

        for (let i = 0; i < arrayClient.length; i++) {
          if (arrayClient.indexOf(arrayClient[i].characterId) === -1) {
            copy.push(arrayClient[i]);
          }
        }
        findUser.favoris = copy;

        await findUser.save();

        res.json(req.fields.favoris);
      } else {
        res.status(400).json({ message: "nothing to add" });
      }
    } else {
      res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
