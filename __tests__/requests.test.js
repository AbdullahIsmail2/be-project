const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");
const usersData = require("../db/data/test-data/users");

beforeEach(() => {
	return seed(testData);
});
afterAll(() => {
	return db.end();
});
describe("GET requests", () => {
	describe("/api", () => {
		it("should provide a description of all other endpoints available", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then((response) => {
					expect(response.body.endpoints).toEqual(endpointsData);
				});
		});
	});
	describe("/api/topics", () => {
		it("Responds with an array of topic objects, each of which should have the following properties: slug & description", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then((response) => {
					const data = response.body.topics;
					expect(Array.isArray(data)).toBe(true);
					expect(data.length).toBeGreaterThan(0);
					data.forEach((topic) => {
						expect(topic).toEqual({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
		it("when address is wrong, responds with 404 Not Found", () => {
			return request(app)
				.get("/api/postststststs")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("Route Not Found");
				});
		});
	});
	describe("/api/articles/:article_id", () => {
		it("Responds with an article object, which should have the following properties: author, title article_id, body, topic, created_at, votes, article_img_url", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then((response) => {
					expect(response.body.article).toEqual({
						article_id: 1,
						title: "Living in the shadow of a great man",
						topic: "mitch",
						author: "butter_bridge",
						body: "I find this existence challenging",
						created_at: expect.any(String),
						votes: 100,
						article_img_url:
							"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					});
				});
		});

		it("Responds with 404 Not Found, when an integer id doesnt exist in the articles table", () => {
			return request(app)
				.get("/api/articles/999")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("article with id 999 does not exist");
				});
		});

		it("Responds with 400 Bad request , when an when id is not valid  doesnt exist in the articles table", () => {
			return request(app)
				.get("/api/articles/number-one")
				.expect(400)
				.then((response) => {
					console.log(response.body);
					expect(response.body.msg).toBe("Bad Request");
				});
		});
	});
	describe("/api/articles", () => {
		it(`returns an array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count. 
			
		-- the articles should be sorted by date in descending order.
		-- there should not be a body property present on any of the article objects.`, () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then((response) => {
					const articles = response.body.articles;
					expect(Array.isArray(articles)).toBe(true);
					expect(articles.length).toBeGreaterThan(0);
					articles.forEach((article) => {
						expect(article.hasOwnProperty("body")).toBe(false);
						expect(article).toEqual({
							article_id: expect.any(Number),
							author: expect.any(String),
							title: expect.any(String),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
							comment_count: expect.any(Number),
						});
					});
				});
		});

		describe("/api/articles?=", () => {
			test("should return an array of articles sorted by id in descending order", () => {
				return request(app)
					.get("/api/articles?sort_by=article_id&order_by=DESC")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("article_id", { descending: true });
					});
			});
			test("should return an array of articles sorted by votes should default to descending if order_by is not provided", () => {
				return request(app)
					.get("/api/articles?sort_by=votes")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("votes", { descending: true });
					});
			});
			test("should return an array of articles in asecending order and default to created_at if sort_by is not provided", () => {
				return request(app)
					.get("/api/articles?&order_by=ASC")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toBeSortedBy("created_at", { ascending: true });
					});
			});
			test("should return a status of 400 and a message of can't sort by this query if sort_by query is not one of the column names in the articles table", () => {
				return request(app)
					.get("/api/articles?sort_by=1")
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid sort_by query");
					});
			});
			test("should return a status of 400 and a message of can't order by this query", () => {
				return request(app)
					.get("/api/articles?order_by=1")
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("Invalid order_by query");
					});
			});
		});
		describe.only("/api/articles?topic=", () => {
			test("should return an array of articles filtered by topic", () => {
				return request(app)
					.get("/api/articles?topic=cats")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles.length).toBeGreaterThan(0);
						articles.forEach((article) => {
							expect(article).toMatchObject({
								topic: "cats",
							});
						});
					});
			});
			test("should return all articles if no topic is provided", () => {
				return request(app)
					.get("/api/articles?")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles.length).toBeGreaterThan(0);
						articles.forEach((article) => {
							expect(article).toEqual({
								article_id: expect.any(Number),
								title: expect.any(String),
								topic: expect.any(String),
								author: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								article_img_url: expect.any(String),
								comment_count: expect.any(String),
							});
						});
					});
			});
			test("should return an array of articles filtered by topic and sorted by title in ascending order", () => {
				return request(app)
					.get("/api/articles?topic=mitch&sort_by=title&order_by=ASC")
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles.length).toBeGreaterThan(0);
						expect(articles).toBeSortedBy("title", { ascending: true });
						articles.forEach((article) => {
							expect(article).toMatchObject({
								topic: "mitch",
							});
						});
					});
			});
		});
	});
	describe("/api/articles/:article_id/comments", () => {
		it("Responds with an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body,article_id", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then((response) => {
					response.body.comments.forEach((comment) => {
						expect(comment).toEqual({
							comment_id: expect.any(Number),
							body: expect.any(String),
							article_id: expect.any(Number),
							author: expect.any(String),
							votes: expect.any(Number),
							created_at: expect.any(String),
						});
					});
				});
		});

		it("200: if article passed in has no comments returns empty array", () => {
			return request(app)
				.get("/api/articles/4/comments")
				.expect(200)
				.then((response) => {
					console.log(response.body);
					expect(response.body.comments).toEqual([]);
				});
		});

		it("404: Responds with an error when article is non-existent ", () => {
			return request(app)
				.get("/api/articles/1000/comments")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("article with id 1000 does not exist");
				});
		});

		it("400: Responds with an error when using an invalid article ID", () => {
			return request(app)
				.get("/api/articles/one-thousand/comments")
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});
	});

	describe("/api/users", () => {
		it("200: Responds withan array of objects, each object should have the following properties: username, name, avatar_url", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then((response) => {
					expect(response.body.users).toEqual(usersData);
				});
		});
		test("should respond with 404 for an invalid route", () => {
			return request(app)
				.get("/api/userssss")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("Route Not Found");
				});
		});
	});
});

describe("POST requests", () => {
	describe("/api/articles/:article_id/comments", () => {
		it("201: Responds with the posted comment", () => {
			const newComment = {
				author: "icellusedkars",
				body: "horrible",
			};
			return request(app)
				.post("/api/articles/9/comments")
				.send(newComment)
				.expect(201)
				.then((response) => {
					const postedComment = response.body.comment;
					expect(postedComment).toEqual({
						comment_id: expect.any(Number),
						body: "horrible",
						article_id: 9,
						author: "icellusedkars",
						votes: 0,
						created_at: expect.any(String),
					});
				});
		});

		it("400: If author/body is missing, responds with an error", () => {
			const newComment = {
				author: "icellusedkars",
			};
			return request(app)
				.post("/api/articles/3/comments")
				.send(newComment)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});

		it("404: Responds with an error when posting to a non-existent article", () => {
			const newComment = {
				author: "icellusedkars",
				body: "horrible",
			};
			return request(app)
				.post("/api/articles/1000/comments")
				.send(newComment)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("article with id 1000 does not exist");
				});
		});

		it("400: Responds with an error when using an invalid article ID", () => {
			const newComment = {
				author: "icellusedkars",
				body: "horrible",
			};
			return request(app)
				.post("/api/articles/one-thousand/comments")
				.send(newComment)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});
	});
});

describe("PATCH requests", () => {
	describe("/api/articles/:article_id", () => {
		it("should update the article votes and respond with the updated article", () => {
			const obj = { inc_votes: 1 };
			return request(app)
				.patch("/api/articles/1")
				.send(obj)
				.expect(200)
				.then((response) => {
					expect(response.body.article).toEqual({
						article_id: 1,
						author: expect.any(String),
						title: expect.any(String),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: 101,
						body: "I find this existence challenging",
						article_img_url: expect.any(String),
					});
				});
		});

		it("400: If inc_votes is missing, responds with an error", () => {
			const obj = { decr_votes: 1 };
			return request(app)
				.patch("/api/articles/1")
				.send(obj)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});

		it("404: Responds with an error when posting to a non-existent article", () => {
			const obj = { decr_votes: 1 };
			return request(app)
				.patch("/api/articles/1000")
				.send(obj)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe("article with id 1000 does not exist");
				});
		});

		it("400: Responds with an error when using an invalid article ID", () => {
			const obj = { inc_votes: 1 };
			return request(app)
				.patch("/api/articles/one-thousand")
				.send(obj)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});
	});
});

describe("DELETE requests", () => {
	describe("/api/comments/:comment_id", () => {
		it("204: delete the given comment by comment_id, responds with no content", () => {
			return request(app)
				.delete("/api/comments/1")
				.expect(204)
				.then((response) => {
					expect(response.body).toEqual({});
				});
		});

		it("404: Responds with an error if comment does not exist", () => {
			return request(app)
				.delete("/api/comments/1000")
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe(
						"comment with the id 1000 does not exist"
					);
				});
		});

		it("400: Responds with an error when using an invalid comment-id", () => {
			return request(app)
				.delete("/api/comments/one-thousand")
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe("Bad Request");
				});
		});
	});
});
