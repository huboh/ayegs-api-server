import { Router } from 'express';
import DataBase from '../../Database';
import { Errors, passwords } from '../../utils';
import { SubmittedUser } from '../../types';
import { getUserFromObject } from '../../Database/utils';
import { sendJson, handleError, handleMongooseError, validateUser, tokens, getHeaderAuthToken } from '../../utils';

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
    const userFromDatabase = await database.User.createUser(validatedUserDetails);
    const token = await tokens.generateToken({ userId: userFromDatabase._id });
    const user = { ...getUserFromObject(userFromDatabase), password: undefined };

    sendJson(response, {
      statusCode: 201,
      status: 'success',
      data: { token, user },
      message: 'registration successful',
    });

  } catch (error) {
    handleMongooseError(error, response) || handleError(error, request, response, next);
  }

});

mainRouter.post('/login', async (request, response, next) => {

  try {
    const submittedUserDetails = request.body as SubmittedUser;
    const { email, password } = validateUser(submittedUserDetails);
    const userFromDatabase = await database.User.loginUser({ email, password });
    const token = await tokens.generateToken({ userId: userFromDatabase._id });
    const user = { ...getUserFromObject(userFromDatabase), password: undefined };

    sendJson(response, {
      statusCode: 202,
      status: 'success',
      message: 'login successful',
      data: { token, user }
    });

  } catch (error) {
    tokens.handleTokenError(error, response) || handleError(error, request, response, next);
  }

});

export default mainRouter;