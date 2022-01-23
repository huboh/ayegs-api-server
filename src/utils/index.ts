export * as tokens from './tokens';
export * as passwords from './passwords';
export { default as Errors } from './errors';
export { default as handleError } from './errors/handleError';


import { Errors } from '.';
import validator from 'validator';
import { STATUS_CODES } from 'http';
import { SendJsonProps, SubmittedUser } from '../types';
import { Error as MongooseError, isValidObjectId } from 'mongoose';
import { Express, Router, Request, Response, RequestHandler } from 'express';


export function sendJson(response: Response, jsonData: SendJsonProps) {
  let { statusCode, status, message, data, errors } = jsonData;
  message = message || STATUS_CODES[statusCode];

  response.status(statusCode);
  response.json({ status, message, data, errors, });
}

export function startServer(server: Express, port: number | string, callback?: () => void) {
  server.listen(Number(port), callback);
}

export function injectMiddlewares(server: Express | Router, middlewares: RequestHandler[]) {
  server.use(...middlewares);
}

export function isInstanceof<T extends Function>(value: unknown, classes: T[]): value is T {
  return classes.some((c) => value instanceof c);
}

/**
 * validates `email` & `password` & optionally validates `name` `firstName` `lastName` if present
 */
export function validateSubmittedUserDetails(user: SubmittedUser): SubmittedUser {
  const { email, password, name, lastName, firstName } = user;

  if (!email || !password) throw new Errors.InvalidPayloadError(
    'email or password not specified'
  );

  const errors = [
    validator.isEmail(email) ? true : 'invalid email address',
    validator.isStrongPassword(password, { minLength: 6 }) ? true : 'password must be atleast 6 character & contains at least 1 LowerCase letter, Uppercase letter & a Symbol',

    // non required fields : if field is truthy validate it or else make it pass test explicitly
    name ? (validator.isAlpha(name) ? true : 'name must only contain letters') : true,
    firstName ? (validator.isAlpha(firstName) ? true : 'first name must only contain letters') : true,
    lastName ? (validator.isAlpha(lastName) ? true : 'last name must only contain letters') : true,
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

export function getHeaderAuthToken(request: Request, type: 'Bearer' | 'Basic') {
  const header = request.header('Authorization');
  const [authType, token] = header?.trim().split(' ') ?? [];
  const errors: string[] = [];

  (token == undefined) && errors.push(`invalid auth token`);
  (authType !== type) && errors.push(`invalid auth type`);

  if (errors.length) {
    throw new Errors.NotAuthorized('Not Authorized', errors);
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

export const verifyMongooseIdentifiers = (...ids: unknown[]) => ids.forEach(id => {
  if (id && !isValidObjectId(id)) {
    throw new Errors.ValidationError(
      'Validation Error', ['invalid idenitifier']
    );
  }
});

/**
 * recursively finds the keys from `replacements` in nested objects in `targetObject` & assigns the corresponding value if their type match or ignore otherwise.
 * the function merge `objects` & combine arrays (by pushing)
 */
export const mergeDeepObjects = (targetObject: any, replacements: any) => {
  for (const replacementKey in replacements) if (Object.prototype.hasOwnProperty.call(replacements, replacementKey)) {
    for (const targetKey in targetObject) if (Object.prototype.hasOwnProperty.call(targetObject, targetKey)) {

      if (targetKey === replacementKey) {
        const targetValue = targetObject[targetKey];
        const replacementValue = replacements[replacementKey];

        if (typeof targetValue === typeof replacementValue) {

          if (typeof targetValue === 'object') {
            // TODO : if they're both objects or different type, dont mutate it

            if (targetValue instanceof Array && replacementValue instanceof Array) {
              targetObject[targetKey] = [...targetValue, ...replacementValue];

            } else if (targetValue.constructor.name === "Object" && replacementValue.constructor.name === "Object") {
              targetObject[targetKey] = { ...targetValue, ...replacementValue };
            }

          } else {
            targetObject[targetKey] = replacements[replacementKey];
          }
        }

      } else if (typeof targetObject[targetKey] === 'object' && !(targetObject[targetKey] instanceof Array)) {
        mergeDeepObjects(targetObject[targetKey], replacements);
      }
    }
  }

  return targetObject;
};