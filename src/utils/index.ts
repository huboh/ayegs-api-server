export * as passwords from './passwords';
export { default as Errors } from './errors';
export { default as DataBase } from './Database';
export { default as handleError } from './errors/handleError';


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