import { Router } from 'express';
import DataBase from '../../Database';
import { SubmittedUser } from '../../types';
import { getUserFromObject } from '../../Database/utils';
import { sendJson, handleError, handleMongooseError, validateSubmittedUserDetails, tokens } from '../../utils';

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
    const validatedUserDetails = validateSubmittedUserDetails(submittedUserDetails);
    const userFromDatabase = await database.User.registerUser(validatedUserDetails);
    const token = await tokens.generateToken({ userId: userFromDatabase._id });
    const user = getUserFromObject(userFromDatabase);

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
    const { email, password } = validateSubmittedUserDetails(submittedUserDetails);
    const userFromDatabase = await database.User.loginUser({ email, password });
    const token = await tokens.generateToken({ userId: userFromDatabase._id });
    const user = getUserFromObject(userFromDatabase);

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