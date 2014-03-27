function ArgumentError(message) {
  this.name = "ArgumentError";
  this.message = message || "Missing required argument in BaseObject.";
}
ArgumentError.prototype = new Error();
ArgumentError.prototype.constructor = ArgumentError;

module.exports = ArgumentError;