import createHttpError from 'http-errors';
import { userRegister } from '../services/auth.js';

export const userRegisterController = async (req, res) => {
  const newUser = await userRegister(req.body);

  res.status(201).json({
    message: 'Successfully registered a user!',
    status: 201,
    data: newUser,
  });
};
