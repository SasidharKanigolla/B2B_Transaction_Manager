class ExpressError extends Error {
  constructor(
    statusCode,
    message
  ) //We have taken two parameters and intialize variables using constructor
  {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError;
