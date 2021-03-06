import User from "../models/User";
import { isValidObjectId } from 'mongoose';
import { SubmittedUser, UserModel, UserId } from "../../types";
import { Errors, validateSubmittedUserDetails, passwords, verifyMongooseIdentifiers } from "../../utils";


export default {
  async userExists(query: { email?: string; _id?: UserId; }) {
    verifyMongooseIdentifiers(query._id);

    return User.exists({
      ...query
    });
  },

  async getUser(query: { email?: string; _id?: UserId; }): Promise<UserModel | null> {
    verifyMongooseIdentifiers(query._id);

    return User.findOne({
      ...query
    });
  },

  async registerUser(userDetails: SubmittedUser): Promise<UserModel> {
    if (await this.userExists({ email: userDetails.email })) throw new Errors.ForbiddenError(
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
  },

  async resetUserPassword(email: any, newPassword: any) {

  }
};