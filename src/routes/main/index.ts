import { Router } from 'express';
import DataBase from '../../Database';
import { SubmittedUser } from '../../types';
import { sendJson, handleError, validateUser, tokens, getHeaderAuthToken } from '../../utils';

const database = new DataBase();
const mainRouter = Router({ caseSensitive: false });

mainRouter.get('/', async (request, response) => {

  sendJson(response, {
    statusCode: 200,
    status: 'success',
  });

});

mainRouter.post('/signup', async (request, response, next) => {
  try {
    const submittedUserDetails = request.body as SubmittedUser;
    const validatedUserDetails = validateUser(submittedUserDetails);
    const user = await database.User.createUser(validatedUserDetails);
    const token = await tokens.generateToken({ userId: user._id });

    sendJson(response, {
      statusCode: 201,
      status: 'success',
      message: 'registration successful',
      data: { token, user }
    });

  } catch (error) {
    console.log(error);
    handleError(error, request, response, next);
  }
});

mainRouter.post('/login', async (request, response, next) => {

  try {
    const userDetails = request.body as SubmittedUser;
    const validatedUserDetails = validateUser(userDetails);
    const bearerToken = getHeaderAuthToken(request.header('Authorization'), 'Bearer');
    const token = await tokens.verifyToken(bearerToken);

    sendJson(response, {
      statusCode: 201,
      status: 'success',
      message: 'registration successful',
      data: {
        token,
        user: validatedUserDetails
      }
    });

  } catch (error) {

    const wasHandled = await tokens.handleTokenError(error, response);

    if (!wasHandled) {
      handleError(error, request, response, next);
    }
  }

});

export default mainRouter;