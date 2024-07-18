const express = require("express");
const app = express();
const getTopics = require("./controllers/getTopics");
const getEndpoints = require("./controllers/getEndpoints");
const getArticleById = require("./controllers/getArticleById");
const getArticles = require("./controllers/getArticles");
const getCommentsByArticleId = require("./controllers/getCommentsByArticleId");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use("/api/topics", (req, res, next) => {
	res.status(404).send({ msg: "Error404: Route Not Found" });
});

app.use("/api/articles/:article_id", (req, res, next) => {
	res.status(400).send({ msg: "Bad Request" });
});

app.use("/api/articles", (req, res, next) => {
	res.status(400).send({ msg: "Bad request" });
});

module.exports = app;
