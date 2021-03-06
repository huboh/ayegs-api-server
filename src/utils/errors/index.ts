class BaseError extends Error {
  constructor(public message: string, public errors?: unknown) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const Errors = {
  BaseError,
  ServerError: class extends BaseError { },
  NotAuthorized: class extends BaseError { },
  ValidationError: class extends BaseError { },
  ForbiddenError: class extends BaseError { },
  ResourceNotFound: class extends BaseError { },
  AuthorizationError: class extends BaseError { },
  InvalidPayloadError: class extends BaseError { },
  InvalidResourceError: class extends BaseError { },
  ServiceUnavailableError: class extends BaseError { },
};

export default Errors;