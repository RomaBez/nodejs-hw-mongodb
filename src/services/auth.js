import { userCollection } from '../db/models/User.js';
import { sessionCollection } from '../db/models/Session.js';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';
import { createResetToken, verifyJwtToken } from '../utils/jwt.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const userRegister = async (payload) => {
  const { email, password } = payload;
  const userExist1 = await userCollection.findOne({ email });
  if (userExist1) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userCollection.create({
    ...payload,
    password: hashPassword,
  });

  return user;
};

export const userLogin = async (payload) => {
  const { email, password } = payload;
  const userExist2 = await userCollection.findOne({ email });
  if (!userExist2) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCheck = await bcrypt.compare(password, userExist2.password);
  if (!passwordCheck) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await sessionCollection.deleteOne({ userId: userExist2.id });

  const sessionData = createSession();

  const userSession = await sessionCollection.create({
    userId: userExist2.id,
    ...sessionData,
  });
  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  sessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await sessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await sessionCollection.create({
    userId: oldSession.id,
    ...sessionData,
  });
  return userSession;
};

export const logout = async (sessionId) => {
  await sessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => userCollection.findOne(filter);

export const requestResetToken = async ({ email }) => {
  const user = await userCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = createResetToken(user);

  const verifyEmailTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const verifyEmailTemplateSource = (
    await fs.readFile(verifyEmailTemplatePath)
  ).toString();
  const template = handlebars.compile(verifyEmailTemplateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error('Email send error:', error); // Додано логування
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  const { token, password } = payload;
  if (!token || !password) {
    throw createHttpError(400, 'Missing token or password.');
  }
  const { data, error } = verifyJwtToken(token);
  if (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await userCollection.findOne({
    email: data.email,
    _id: data.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found.');
  }
  const crptdPassword = await bcrypt.hash(password, 10);

  await userCollection.updateOne(
    { _id: user._id },
    { password: crptdPassword },
  );

  await sessionCollection.findOneAndDelete({ userId: user._id });
};
