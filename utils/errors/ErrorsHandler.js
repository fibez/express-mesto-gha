const BadRequestError = require('./BadRequest');
const ConflictError = require('./Conflict');
const NotFoundError = require('./NotFound');
const UnauthorizedError = require('./Unauthorized');

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Произошла ошибка на сервере';

  if (err instanceof NotFoundError
      || err instanceof BadRequestError
      || err instanceof ConflictError
      || err instanceof UnauthorizedError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
}

module.exports = {
  errorHandler,
};
