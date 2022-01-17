import { STATUS_CODES } from 'http';
import { sendJson } from '../../utils';
import { Request, Response } from 'express';

export default (request: Request, response: Response) => {
  const statusCode = 404;

  sendJson(response, {
    statusCode,
    status: 'error',
    message: STATUS_CODES[statusCode]!
  });
};