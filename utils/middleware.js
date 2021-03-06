const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    response.status(400).end();
  }
  if (error.name === "MongoError") {
    if (error.code === 11000) {
      response.status(400).send({ error: "username already taken"});
    }
  }
  if (error.name === "JsonWebTokenError") {
    response.status(401).send({ error: "invalid token" });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7); 
  }
  next(); 
};

module.exports = {
  errorHandler, tokenExtractor
};
