export * as tokens from './tokens';
export * as passwords from './passwords';
export { default as Errors } from './errors';
export { default as handleError } from './errors/handleError';


import { Errors } from '.';
import validator from 'validator';
import { STATUS_CODES } from 'http';
import { Error as MongooseError } from 'mongoose';
import { SendJsonProps, SubmittedUser } from '../types';
import { Express, Response, RequestHandler } from 'express';


export function sendJson(response: Response, jsonData: SendJsonProps) {
  const { statusCode, status, message, data, errors } = jsonData;

  response.status(statusCode);
  response.json({ status, data, errors, message: message ?? STATUS_CODES[statusCode] });
}

export function startServer(server: Express, port: number | string, callback?: () => void) {
  server.listen(Number(port), callback);
}

export function injectMiddlewares(server: Express, middlewares: RequestHandler[]) {
  server.use(...middlewares);
}

export function isInstanceof<T extends Function>(value: unknown, classes: T[]): value is T {
  return classes.every((c) => {
    value instanceof c;
  });
}

export function validateUser(user: SubmittedUser) {
  const { email, password, firstName } = user;
  const errors = [
    validator.isEmail(email) ? true : 'invalid email address',
    validator.isAlpha(firstName) ? true : 'invalid name : must only contain letters',
    validator.isStrongPassword(password, { minLength: 6 }) ? true : 'invalid password : must contain at least 1 LowerCase letter, Uppercase letter & a Symbol'
  ].filter(
    (e) => typeof e !== 'boolean'
  );

  if (errors.length) {
    throw new Errors.ValidationError('validation error', errors);
  }

  return (
    user
  );
}

export function getHeaderAuthToken(header: string | undefined, type: 'Bearer' | 'Basic') {
  const errors: string[] = [];
  const errorMessage = 'authorization error';
  const [authType, token] = header?.trim().split(' ') ?? [];

  (token == undefined) && errors.push(`no token specified`);
  (authType !== type) && errors.push(`invalid authorization type`);

  if (errors.length) {
    throw new Errors.InvalidPayloadError(errorMessage, errors);
  }

  return token;
}

export function handleMongooseError(error: unknown, response: Response) {
  let statusCode = 500;
  let wasHandled = false;
  let message: string | undefined;
  const errors: string[] = [];

  if (error instanceof Error && error.name.includes('MongoServerError')) {
    wasHandled = true;

    switch ((error as any).code) {
      case 11000: {
        statusCode = 406; Object.keys((error as any).keyValue).forEach(key => key && errors.push(`${key} already exists`)); break;
      }

      default: break;
    }

    sendJson(response, {
      errors,
      message,
      statusCode,
      status: 'error',
    });
  }

  if (error instanceof MongooseError) {
    wasHandled = true;

    switch (error.name) {
      case 'ParallelSaveError': statusCode = 429; break;
      case 'ValidationError': {
        statusCode = 406; message = 'validation error';
        Object.values((<any> error).errors).forEach(err => errors.push((err as any).properties.message)); break;
      }

      default: break;
    }

    sendJson(response, {
      errors,
      message,
      statusCode,
      status: 'error',
    });
  }

  return wasHandled;
}