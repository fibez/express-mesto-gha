const BadRequestError = require('./BadRequest');
const ConflictError = require('./Conflict');
const NotFoundError = require('./NotFound');
const UnauthorizedError = require('./Unauthorized');

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = 'Произошла ошибка на сервере';

  if (err instanceof NotFoundError
      || err instanceof BadRequestError
      || err instanceof ConflictError
      || err instanceof UnauthorizedError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }
  res.status(statusCode).json({ message: errorMessage });
  next();
}

module.exports = {
  errorHandler,
};
