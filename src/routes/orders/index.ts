import { Router } from 'express';
import DataBase from '../../Database';
import * as auth from '../../middlewares/auth';
import { sendJson, handleError, handleMongooseError, injectMiddlewares } from '../../utils';

const database = new DataBase();
const ordersRouter = Router({ caseSensitive: false });

injectMiddlewares(ordersRouter, [auth.requiresAuthMiddleware]);

ordersRouter.get('/', async (request, response, next) => {
  try {
    const userId = response.locals.user._id;
    const data = await database.Order.getOrders(userId);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

ordersRouter.get('/:orderId', async (request, response, next) => {
  try {
    const orderId = request.params.orderId;
    const userId = response.locals.user._id;
    const data = await database.Order.getOrder({ userId, orderId });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

ordersRouter.post('/create', async (request, response, next) => {
  try {
    const { orderDetails } = request.body;
    const userId = response.locals.user._id;
    const results = await database.Order.createOrder({ orderDetails: { userId, ...orderDetails } });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { results }
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

ordersRouter.put('/edit/:orderId?', async (request, response, next) => {
  try {
    const userId = response.locals.user._id;
    const newOrderDetails = request.body.orderDetails;
    const orderId = request.params.orderId ?? request.body.orderId;
    const data = await database.Order.updateOrder({ userId, orderId, newOrderDetails });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

// TODO : add middleware to enable only employee access
ordersRouter.put('/edit/status/:orderId', async (request, response, next) => {
  try {
    const userId = response.locals.user._id;
    const orderStatus = request.body.status;
    const orderId = request.params.orderId ?? request.body.orderId;
    const data = await database.Order.updateOrderStatus({ userId, orderId, orderStatus });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

ordersRouter.delete('/remove/:orderId?', async (request, response, next) => {
  try {
    const userId = response.locals.user._id;
    const orderId = request.params.orderId ?? request.body.orderId;
    const data = await database.Order.removeOrder({ userId, orderId });

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }
});

export default ordersRouter;