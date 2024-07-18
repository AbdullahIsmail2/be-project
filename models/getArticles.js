const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

const getArticles = () => {
	return db
		.query(
			`SELECT 
    			articles.author, 
    			articles.title, 
    			articles.article_id, 
    			articles.topic, 
    			articles.created_at, 
    			articles.votes, 
    			articles.article_img_url,
    			COUNT(comments.comment_id)::int AS comment_count
			FROM articles
			LEFT JOIN comments ON articles.article_id = comments.article_id
			GROUP BY articles.article_id
			ORDER BY articles.created_at DESC
			`
		)
		.then((response) => {
			console.log(response.rows);
			return response.rows;
		});
};

module.exports = getArticles;
