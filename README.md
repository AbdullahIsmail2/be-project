# Northcoders News API

## Environment Setup

As `.env.*` files are added to `.gitignore`, cloning this repository won't include necessary environment variables. Follow these steps to set them up:

1. **Create `.env.development`**:

   - Create a file named `.env.development`.
   - Add the following line to set the database to the development environment:
     ```
     PGDATABASE=nc_news
     ```

2. **Create `.env.test`**:
   - Create a file named `.env.test`.
   - Add the following line to set the database to the test environment:
     ```
     PGDATABASE=nc_news_test
     ```

You have now successfully configured your environment files.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
