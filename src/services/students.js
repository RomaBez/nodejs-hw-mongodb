import { contactCollection } from '../db/models/Contact.js';

export const getAllContacts = () => contactCollection.find();

export const getContactById = (id) => contactCollection.findById(id);

export const creatContact = (payload) => contactCollection.create(payload);

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await contactCollection.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    {
      new: true,
      ...options,
    },
  );
  if (!rawResult) return null;
  return {
    contact: rawResult,
  };
};

export const deleteContact = (filter) =>
  contactCollection.findByIdAndDelete(filter);
