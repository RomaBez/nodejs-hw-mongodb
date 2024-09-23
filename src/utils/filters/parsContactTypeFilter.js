import { contactTypeList } from '../../constants/contacts.js';

export const parseContactTypeFilter = (type) => {
  if (typeof type !== 'string') return;
  if (contactTypeList.includes(type)) return type;
};
