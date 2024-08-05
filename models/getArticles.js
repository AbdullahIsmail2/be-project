const db = require("../db/connection");

articlesOrderByCheck = (order_by) => {
	const orderByWhiteListedWords = ["ASC", "DESC"];
	return orderByWhiteListedWords.includes(order_by);
};

articlesSortByCheck = (sort_by) => {
	const sortByWhiteListedWords = [
		"article_id",
		"title",
		"topic",
		"author",
		"body",
		"created_at",
		"votes",
		"article_img_url",
	];
	return sortByWhiteListedWords.includes(sort_by);
};

const getArticles = (topic, sort_by = "created_at", order_by = "DESC") => {
	const validSortBy = articlesSortByCheck(sort_by);
	const validOrderBy = articlesOrderByCheck(order_by);

	console.log(order_by);
	console.log(sort_by)
	console.log(validSortBy);
	console.log(validOrderBy);

	if (!validSortBy) {
		return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
	}
	if (!validOrderBy) {
		return Promise.reject({ status: 400, msg: "Invalid order_by query" });
	}

	// Base query
	let queryStr = `
			SELECT 
					articles.article_id, 
					articles.title, 
					articles.topic, 
					articles.author, 
					articles.created_at, 
					articles.votes, 
					articles.article_img_url, 
					COUNT(comments.comment_id) AS comment_count
			FROM articles
			LEFT JOIN comments ON articles.article_id = comments.article_id
	`;

	console.log(topic, "topic");
	console.log(sort_by, "sort-by");
	console.log(order_by, "order-by");

	// Add topic filter if provided
	const queryParams = [];
	if (topic) {
		queryStr += ` WHERE articles.topic = $1`;
		queryParams.push(topic);
	}

	// Append grouping and ordering
	queryStr += `
			GROUP BY articles.article_id
			ORDER BY ${sort_by} ${order_by}
	`;

	return db.query(queryStr, queryParams).then(({ rows }) => {
		return rows;
	});
};

module.exports = getArticles;
