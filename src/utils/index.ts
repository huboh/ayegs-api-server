export * as passwords from './passwords';
export { default as Errors } from './errors';
export { default as DataBase } from './Database';
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

export function validateUser(user: SubmittedUser) {
  const { email, password, firstName } = user;
  const errors = [
    validator.isEmail(email) ? true : 'invalid email address',
    validator.isAlpha(firstName) ? true : 'invalid name, must be only contain letters',
    validator.isStrongPassword(password, { minLength: 6 }) ? true : 'invalid password'
  ].filter(
    (e) => typeof e !== 'boolean'
  );

  if (errors.length) {
    throw new Errors.ValidaionError('user validation error', errors);
  }

  return {
    email, password, firstName
  };
}