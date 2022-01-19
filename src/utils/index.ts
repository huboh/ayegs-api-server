export * as tokens from './tokens';
export * as passwords from './passwords';
export { default as Errors } from './errors';
export { default as handleError } from './errors/handleError';


import { Errors } from '.';
import validator from 'validator';
import { STATUS_CODES } from 'http';
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