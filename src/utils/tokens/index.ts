
import { sendJson } from '..';
import { Response } from 'express';
import jsonWebToken, { SignOptions, VerifyOptions } from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

const generateToken = async (payload: object | any[], options: SignOptions = {}) => {
  return jsonWebToken.sign(payload, SECRET_KEY!, {
    expiresIn: 86400,
    ...options
  });
};

const verifyToken = async (token: string, options: VerifyOptions = {}) => {
  return jsonWebToken.verify(token, SECRET_KEY!, {
    ...options
  });
};

const handleTokenError = async (error: unknown, response: Response) => {
  const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jsonWebToken;

  if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError || error instanceof NotBeforeError) {
    const message = error.name == 'TokenExpiredError' ? 'error: token expired' : 'error: invalid token';
    const statusCode = 403;

    sendJson(response, {
      message,
      statusCode,
      status: 'error',
    });

    return true;
  }

  return false;
};

export {
  verifyToken,
  generateToken,
  handleTokenError,
};