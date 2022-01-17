import Errors from './index';
import { sendJson } from '../index';

import { NextFunction, Response, Request } from 'express';

const handleError = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  let message = error instanceof Error ? error.message : undefined;
  let statusCode = 500;
  let data = undefined;

  if (error instanceof Errors.BaseError) {
    switch (error.name as keyof typeof Errors) {
      case 'ValidaionError': statusCode = 406; break;
      case 'ForbiddenError': statusCode = 403; break;
      case 'NotAuthorized': statusCode = 401; break;
      case 'AuthorizationError': statusCode = 401; break;
      case 'InvalidPayloadError': statusCode = 400; break;
      case 'InvalidResourceError': statusCode = 400; break;
      case 'ServiceUnavailableError': statusCode = 403; break;
      default: statusCode = 500; return;
    }
  } else {
    return next(error);
  }

  sendJson(response, {
    data,
    message,
    statusCode,
    status: 'error',
  });
};

export default handleError;