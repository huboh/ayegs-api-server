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

  async createUser(userDetails: Partial<UserType>) {
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

};