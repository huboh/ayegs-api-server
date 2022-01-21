import User from "../models/User";
import { isValidObjectId } from 'mongoose';
import { SubmittedUser, UserFromDB, UserId } from "../../types";
import { Errors, validateSubmittedUserDetails, passwords } from "../../utils";


export default {
  async userExists(query: { email?: string; _id?: UserId; }): Promise<boolean> {
    return (query._id && !isValidObjectId(query._id)) ? false : User.exists({
      ...query
    });
  },

  async getUser(query: { email?: string; _id?: UserId; }): Promise<UserFromDB | null> {
    return (query._id && !isValidObjectId(query._id)) ? null : User.findOne({
      ...query
    });
  },

  async registerUser(userDetails: SubmittedUser): Promise<UserFromDB> {
    if (await this.getUser({ email: userDetails.email })) throw new Errors.ForbiddenError(
      'email address already registered, please login'
    );

    return User.create(
      userDetails
    );
  },

  async updateUser() {

  },

  async deleteUser() {

  },

  async loginUser(userDetails: SubmittedUser) {
    const validatedUserDetails = validateSubmittedUserDetails(userDetails);
    const userFromDatabase = await this.getUser({ email: validatedUserDetails.email });

    if (userFromDatabase) {
      if (await passwords.comparePasswords(validatedUserDetails.password, userFromDatabase.password)) {
        return userFromDatabase;

      } else {
        throw new Errors.AuthorizationError(
          'invalid email or password'
        );
      }

    } else {
      // * user does not exists, causing a delay to hide the fact that email exists in database
      await passwords.comparePasswords(
        validatedUserDetails.password, `$2b$${passwords.SALT_ROUNDS}$invalid_password.dddddddddddddddddddddddddddddddddddd`
      );

      throw new Errors.AuthorizationError(
        'invalid email or password'
      );
    }
  }
};