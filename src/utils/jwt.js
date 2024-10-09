import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const jwtSecret = env('JWT_SECRET');

export const createResetToken = (payload) =>
  jwt.sign(
    {
      sub: payload._id,
      email: payload.email,
    },
    jwtSecret,
    { expiresIn: '5m' },
  );

export const verifyJwtToken = (toke) => {
  try {
    const payload = jwt.verify(toke, jwtSecret);
    return { data: payload };
  } catch (error) {
    return { error };
  }
};
