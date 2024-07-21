const express = require("express");
const app = express();
const getTopics = require("./controllers/GET/getTopics");
const getEndpoints = require("./controllers/GET/getEndpoints");
const getArticleById = require("./controllers/GET/getArticleById");
const getArticles = require("./controllers/GET/getArticles");
const getCommentsByArticleId = require("./controllers/GET/getCommentsByArticleId");
const postComment = require("./controllers/POST/postComment");
const patchArticleVotes = require("./controllers/PATCH/patchArticleVotes");
const deleteComment = require("./controllers/DELETE/deleteComment");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res) => {
	res.status(404).send({ msg: "Route Not Found" });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
});

app.use((err, req, res, next) => {
	if (err.code === "22P02" || err.code === "23502") {
		res.status(400).send({ msg: "Bad Request" });
	} else next(err);
});

module.exports = app;
