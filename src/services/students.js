import { contactCollection } from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactQuery = contactCollection.find();

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const count = await contactQuery.clone().countDocuments();

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData({ count, perPage, page });

  return { data, perPage, page, totalItems: count, ...paginationData };
};

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
