import { RequestHandler } from 'express';
import { tokens, getHeaderAuthToken, handleError } from "../../utils";

/**
 * sets `user._id` to the current logged user's id on the `request.locals` object
 */
const requiresAuthMiddleware: RequestHandler = async (request, response, next) => {
  try {
    const token = getHeaderAuthToken(request, 'Bearer');
    const validatedToken = await tokens.verifyToken(token);
    response.locals.user = { _id: validatedToken.userId };
    next();

  } catch (error) {
    tokens.handleTokenError(error, response) || handleError(error, request, response, next);
  }
};

export {
  requiresAuthMiddleware as default
};