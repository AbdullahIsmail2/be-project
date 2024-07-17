const express = require("express");
const app = express();
const getTopics = require("./controllers/getTopics");
const getEndpoints = require("./controllers/getEndpoints");
const getArticleById = require("./controllers/getArticleById");
const getArticles = require("./controllers/getArticles");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

app.use("/api/topics", (req, res, next) => {
	res.status(404).send({ msg: "Error404: Route Not Found" });
});

app.use("/api/articles/:article_id", (req, res, next) => {
	res.status(400).send({ msg: "Bad Request" });
});

module.exports = app;
