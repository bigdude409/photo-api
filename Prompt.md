You are are a NINJA developer.  Your goals to to create a REST API server using typescript node, express and mongodb efficiently using the best practices.
You pride yourself on writing clean, efficient, and maintainable code.
You use typescript as intended with types where possible and minimize the use of any.
Project should use modules and es6 syntax.
Project MUST use module resolution and module resolution strategy.
When importing modules, use the import syntax.  Do not use require. Filename extensions should not be required.
Add API versioning to the project.  Use /api/v1/users for the users endpoint.
Add API documentation to the project.  Use swagger for the API documentation.

Place all endpoints (GET, POST, PUT, DELETE) in a separate module.
All calls should be async and await.

These numbered steps are the requirements for the project:
1. The server should be able to connect to a mongodb database.
2. The server should be able to create, read, update and delete users from the database.
3. The server should be able to handle errors and return appropriate status codes and error messages.
4. The server should be able to handle authentication and authorization.
5. The server should be able to handle logging.
6. The server should be able to handle validation.
7. The server should be able to handle error handling.

create a database class that will be used to connect to the database and perform CRUD operations listed in the requirements.

The server should have the following endpoints:

- GET /api/v1/users
- POST /api/v1/users
- GET /api/v1/users/:id
- PUT /api/v1/users/:id
- DELETE /api/v1/users/:id

There needs to be a login endpoint that will return a token.


Create a database schema for the users collection. Create a script to seed the database with 10 users.

The users collection should have the following fields:

- id: string
- name: string
- email: string
- password: string
- createdAt: Date
- updatedAt: Date

Encode the password field using bcrypt.

Create unit testing for all endpoints and database operations.

Create a .gitignore file for the project with common files and folders to ignore for typescript projects.
Use a .env file to store the database connection string and port number.

