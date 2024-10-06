import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { userRegisterSchema, userEmailSchema } from '../validation/users.js';
import {
  userRegisterController,
  userLoginController,
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

export default authRouter;
