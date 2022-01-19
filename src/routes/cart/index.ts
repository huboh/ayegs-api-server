import { Router } from 'express';
import { sendJson, handleError, Errors } from '../../utils';

const cartRouter = Router({ caseSensitive: false });

cartRouter.get('/', async (request, response, next) => {
  try {
    const statusCode = 200;

    sendJson(response, {
      statusCode,
      status: 'success',
      data: {
        count: 10,
        cartItems: []
      }
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

export default cartRouter;