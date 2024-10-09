import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  userRegisterSchema,
  userEmailSchema,
  resetPasswordEmailValidationSchema,
  resetPasswordValidationSchema,
} from '../validation/users.js';
import {
  userRegisterController,
  userLoginController,
  userRefreshController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(userRegisterController),
);

authRouter.post(
  '/login',
  validateBody(userEmailSchema),
  ctrlWrapper(userLoginController),
);

authRouter.post('/refresh', ctrlWrapper(userRefreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(resetPasswordEmailValidationSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
