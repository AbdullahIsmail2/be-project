const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");

beforeEach(() => {
	return seed(testData);
});
afterAll(() => {
	return db.end();
});
describe("get requests", () => {
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
					expect(response.body.msg).toBe("Error404: Route Not Found");
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
					expect(response.body.msg).toBe("article with id 999  does not exist");
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
	});
	describe("/api/articles/:article_id/comments", () => {
		it("Responds with an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body,article_id", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then((response) => {
					response.body.forEach((comment) => {
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

		it.only("404: Not Found if article_id passed in has no comments", () => {
			return request(app)
				.get("/api/articles/2/comments")
				.expect(404)
				.then((response) => {
					console.log(response.body);
					expect(response.body.msg).toBe("this article has no comments");
				});
		});
	});
});


