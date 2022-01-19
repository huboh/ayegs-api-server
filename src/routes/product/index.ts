import { Router } from 'express';
import { sendJson, handleError, Errors } from '../../utils';

const productRouter = Router({ caseSensitive: false });

productRouter.get('/', async (request, response, next) => {
  try {
    const statusCode = 200;

    sendJson(response, {
      statusCode,
      status: 'success',
      data: {
        count: 100,
        products: []
      }
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

productRouter.get('/:id', async (request, response, next) => {
  try {

  } catch (error) {
    handleError(error, request, response, next);
  }
});

productRouter.get('/recently-added/:count', async () => {

});

productRouter.get('/recently-viewed', async () => {

});

productRouter.get('/favourite', async () => {

});

export default productRouter;