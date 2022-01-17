import { STATUS_CODES } from 'http';
import { sendJson } from '../../utils';
import { Request, Response, NextFunction } from 'express';

export default (error: any, request: Request, response: Response, next: NextFunction) => {
  console.log('server error', error.message);
  const statusCode = 500;

  sendJson(response, {
    statusCode,
    status: 'error',
    message: STATUS_CODES[statusCode]
  });
};