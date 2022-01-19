import { Router } from 'express';
import { sendJson, handleError } from '../../utils';

const accountRouter = Router({ caseSensitive: false });


accountRouter.get('/', async (request, response) => {

  sendJson(response, {
    statusCode: 200,
    status: 'success',
  });

});


export default accountRouter;