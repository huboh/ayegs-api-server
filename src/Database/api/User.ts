import { User as UserType } from "../../types";
import User from "../models/User";
import { getUserFromObject } from "../utils";


export default {

  async getUser() {

  },

  async createUser(user: Partial<UserType>) {
    return User.create(getUserFromObject(user));
  },

  async updateUser() {

  },

  async deleteUser() {

  },

};