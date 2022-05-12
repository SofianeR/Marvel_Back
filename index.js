require("dotenv").config();

const axios = require("axios");

const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidableMiddleware());
app.use(cors());

const comicsRoutes = require("./Routes/comics.js");
app.use(comicsRoutes);

const charactersRoutes = require("./Routes/characters.js");
app.use(charactersRoutes);

const userRoutes = require("./Routes/user");
app.use(userRoutes);

app.get("*", (req, res) => {
  res.status(400).json("Page introuvable");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server launched 🚀");
});
