## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

## Default Method

```bash
$ npm install
```

## Compile and run the project

```bash
# usage of linter
$ npm run lint
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Additionally

```bash
# #env file is given to see what environment variablesis needed to setup in local environment.
# Install pgadmin and setup database accordingly to run in local environment.
```

## RECOMMENDED METHOD

# (This application have been dockerized.)

```bash

# Make sure docker is installed and running

$ docker compose up
```

## TOKENIZATION

```bash
# Visit https://jwt.io/ to generate a token to access the api.
# Use HS256 algorithm and the payload should be like this:

{
  "sub": "1",
  "username": "Sample",
  "role": "Guest" || "Admin"
}
# Secret key is not encoded to base64.
# All api endpoint requires token authentication
# Use swagger authorize to add in your bearer token after generated.



```

## DATABASE

# (Name is MOTOR_INSURANCE_WEBSITE and Table name is Product as per requirement)

```bash
# By default,the database is empty.Please create product to utilize all the endpoints.DONT   FORGET TO GENERATE TOKEN AS ADMIN ROLE to create a new product.

```

## ENDPOINTS

# Swagger is implemented as per requirement

```bash
# http://localhost:3000/api-docs# (to access swagger)

```

## MIDDLEWARES

```bash
# JWT service to authenticate token
# Logger middleware to monitor and debug
# Ratelimiter middleware to handle heavy load and high traffic requests(Can avoid dos attacks in real life applications)
# Useguard is not a middleware but i would consider has another layer of security for RBAC.

```

## CONTROLLERS AND PROVIDERS

# (Has one of each as per requirement)

```bash

# Controller has all required endpoints and mainly used for request handling,response management and also routing.

# Providers aka Services handles all the logic and database access mainly.

```

## DTO

```bash
# DTO mainly used for validate the request and also to  standardize all communication.

```

## ORM

# (TypeORM is used as per requirement)

```bash
# ORM is used to avoid traditional method databases SQL queries and for better maintainability for sure.

```

## JEST

# (Unit tests has been implemented for some part of the coding )
