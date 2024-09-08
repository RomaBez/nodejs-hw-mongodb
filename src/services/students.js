import { contactCollection } from '../db/models/Contact.js';

export const getAllContacts = () => contactCollection.find();

export const getContactById = (id) => contactCollection.findById(id);
