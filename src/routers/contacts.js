import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  postContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  addContactValidationScheme,
  patchContactValidationScheme,
} from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { uploadPhoto } from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post(
  '/',
  uploadPhoto.single('photo'),
  validateBody(addContactValidationScheme),
  ctrlWrapper(postContactController),
);
contactsRouter.patch(
  '/:id',
  isValidId,
  uploadPhoto.single('photo'),
  validateBody(patchContactValidationScheme),
  ctrlWrapper(updateContactController),
);
contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
