// Note: Babel does not support extending builtin types like error:
// https://phabricator.babeljs.io/T3083

/**
 * The error that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The error message.
 * @extends Error
 */
export default function CancellationError(message) {
  this.message = message || 'Operation has been canceled.';
  this.name = 'CancellationError';
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}

CancellationError.prototype = Object.create(Error.prototype);
CancellationError.prototype.constructor = CancellationError;
