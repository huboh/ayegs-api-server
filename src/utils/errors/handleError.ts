import Errors from './index';
import { sendJson } from '../index';

import { NextFunction, Response, Request } from 'express';

const handleError = (error: unknown, request: Request, response: Response, next: NextFunction, errors?: unknown) => {
  let message = error instanceof Error ? error.message : undefined;
  let statusCode = 500;

  if (!(error instanceof Errors.BaseError)) {
    return next(error);
  }

  switch (error.name as keyof typeof Errors) {
    case 'ValidationError': statusCode = 406; break;
    case 'ForbiddenError': statusCode = 403; break;
    case 'NotAuthorized': statusCode = 401; break;
    case 'AuthorizationError': statusCode = 401; break;
    case 'InvalidPayloadError': statusCode = 400; break;
    case 'InvalidResourceError': statusCode = 400; break;
    case 'ServiceUnavailableError': statusCode = 503; break;
    default: statusCode = 503; break;
  }

  sendJson(response, {
    errors: error.errors ?? errors,
    message,
    statusCode,
    status: 'error',
  });
};

export default handleError;