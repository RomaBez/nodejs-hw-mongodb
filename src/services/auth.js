import { userCollection } from '../db/models/User.js';

export const userRegister = async (payload) => {
  const user = await userCollection.create(payload);

  return user;
};
