import { Router } from 'express';
import DataBase from '../../Database';
import { SubmittedUser } from '../../types';
import { normalizeUser } from '../../Database/utils';
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
    const user = normalizeUser(userFromDatabase);

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
    const user = normalizeUser(userFromDatabase);

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

mainRouter.post('/reset-password', async (request, response, next) => {

  try {
    const submittedUserDetails = request.body as SubmittedUser;
    // TODO : send email to the registered user email address, either a otp code or reset url that redirects here

    sendJson(response, {
      statusCode: 202,
      status: 'success',
      message: 'login successful'
    });

  } catch (error) {
    tokens.handleTokenError(error, response) || handleError(error, request, response, next);
  }

});

export default mainRouter;