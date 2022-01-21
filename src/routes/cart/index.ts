import { Router } from 'express';
import DataBase from '../../Database';
import * as auth from '../../middlewares/auth';
import { sendJson, handleError, handleMongooseError, injectMiddlewares } from '../../utils';

const database = new DataBase();
const cartRouter = Router({ caseSensitive: false });

injectMiddlewares(cartRouter, [auth.requiresAuthMiddleware]);

cartRouter.get('/items', async (request, response, next) => {
  try {
    const { _id: userId } = response.locals.user;
    const cartItems = await database.CartItem.getCartItems(userId);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { count: cartItems.length, cartItems }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

cartRouter.post('/items', async (request, response, next) => {
  try {
    const { productIds } = request.body;
    const { _id: userId } = response.locals.user;
    const cartItems = await database.CartItem.addCartItems(userId, productIds);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      // data: { count: cartItems.length, cartItems }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

export default cartRouter;