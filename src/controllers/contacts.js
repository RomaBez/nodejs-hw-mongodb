import createHttpError from 'http-errors';
import {
  getContacts,
  getContactById,
  creatContact,
  updateContact,
  deleteContact,
} from '../services/students.js';
import { addContactValidationScheme } from '../validation/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFilterParams from '../utils/filters/parsContactFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res, next) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseContactFilterParams(req.query);

  const { _id: userId } = req.user;

  const contacts = await getContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const contacts = await getContactById({ id, userId });

  if (!contacts) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contacts,
  });
};

export const postContactController = async (req, res, next) => {
  try {
    await addContactValidationScheme.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }

  const { _id: userId } = req.user;
  const photo = req.file;

  console.log(req.body);
  console.log(req.file);

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const data = await creatContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  console.log('Updating contact:', { id, userId, body: req.body });

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const updatedContact = await updateContact(userId, id, req.body, {
    photo: photoUrl,
  });

  if (!updatedContact) {
    console.log('Contact not found:', { id, userId });
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const deletedContact = await deleteContact({ id, userId });

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
