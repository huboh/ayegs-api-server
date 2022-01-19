import User from "../models/User";
import { isValidObjectId } from 'mongoose';
import { getUserFromObject } from "../utils";
import { User as UserType, SubmittedUser } from "../../types";
import { Errors, validateUser, passwords } from "../../utils";


export default {

  async getUser(query: { email?: string; _id?: string; }): Promise<(UserType & { _id: string; }) | null> {
    return (query._id && !isValidObjectId(query._id)) ? null : User.findOne({
      ...query
    });
  },

  async registerUser(userDetails: Partial<UserType>) {
    if (await this.getUser({ email: userDetails.email })) throw new Errors.ForbiddenError(
      'user already exists'
    );

    return User.create(
      getUserFromObject(userDetails)
    );
  },

  async updateUser() {

  },

  async deleteUser() {

  },

  async loginUser(userDetails: Partial<SubmittedUser>) {
    const validatedUserDetails = validateUser(userDetails as SubmittedUser);
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