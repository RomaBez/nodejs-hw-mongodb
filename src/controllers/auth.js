import { userRegister, userLogin } from '../services/auth.js';

export const userRegisterController = async (req, res) => {
  const newUser = await userRegister(req.body);

  res.status(201).json({
    message: 'Successfully registered a user!',
    status: 201,
    data: newUser,
  });
};

export const userLoginController = async (req, res) => {
  const session = await userLogin(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
