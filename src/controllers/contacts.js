import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  creatContact,
  updateContact,
  deleteContact,
} from '../services/students.js';

export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contacts = await getContactById(id);

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
  const data = await creatContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;

  const updatedContact = await updateContact(id, req.body);

  if (!updatedContact) {
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
  const deletedContact = await deleteContact(id);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
