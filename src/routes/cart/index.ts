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
    const data = await database.CartItem.getCartItems(userId);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

cartRouter.post('/items', async (request, response, next) => {
  try {
    const { products } = request.body;
    const { _id: userId } = response.locals.user;
    const results = await database.CartItem.addCartItems({ userId, products });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { results }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

cartRouter.put('/items/:id?/:qty?', async (request, response, next) => {
  try {
    const _id = request.params.id ?? request.body.id;
    const userId = response.locals.user._id;
    const quantity = Number(request.params.qty ?? request.body.quantity);
    const result = await database.CartItem.updateQuantity({ _id, userId, quantity });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { result }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

cartRouter.delete('/items/:id?', async (request, response, next) => {
  try {
    const _id = request.params.id ?? request.body.id;
    const userId = response.locals.user._id;
    const deleted = await database.CartItem.removeCartItem({ userId, _id });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { deleted }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

export default cartRouter;