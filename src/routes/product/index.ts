import { Router } from 'express';
import DataBase from '../../Database';
import { sendJson, handleError } from '../../utils';

const database = new DataBase();
const productRouter = Router({ caseSensitive: false });

productRouter.get('/', async (request, response, next) => {
  try {
    const page = Number(request.query.page ?? request.body.page);
    const count = Number(request.query.count ?? request.body.count);
    const data = await database.Product.getProducts(page, count);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

productRouter.get('/recently-added', async (request, response, next) => {
  try {
    const page = Number(request.query.page ?? request.body.page);
    const count = Number(request.query.count ?? request.body.count);
    const data = await database.Product.getRecentlyAdded(page, count);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

productRouter.post('/add', async (request, response, next) => {
  try {
    const { productData } = request.body;
    const products = await database.Product.addProduct(productData);

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { products },
      message: 'product added successfully',
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

productRouter.get('/categories', async (request, response, next) => {
  try {
    const data = await database.Category.getCategories();

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data,
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

// private
productRouter.get('/seed-categories', async (request, response, next) => {
  try {
    const results = await database.Category.seedCategory();

    sendJson(response, {
      statusCode: 200,
      status: 'success',
      data: { results },
    });

  } catch (error) {
    handleError(error, request, response, next);
  }
});

// needs user id 🤷‍♂️
productRouter.get('/recently-viewed', async () => {

});

export default productRouter;


// const product = {
//   title: '',//required
//   mainImageUrl: '',//required
//   meta: {
//     sku: 'sku',
//     price: {
//       currency: 'USD',
//       current: '20', // required
//       previous: '30',
//     },
//     desc: {
//       long: '',
//       short: ''
//     },
//     reviews: {
//       average: 0.0,
//       count: '10',
//     },
//     categoriesId: [''],
//     imagesUrl: ['', '', ''],
//     stock: 20,
//     discount: {
//       percent: 25,
//       active: true
//     }
//   }
// };