import { parseContactTypeFilter } from './parsContactTypeFilter.js';
import { parseContactFavouriteFilter } from './parseContactFavouriteFilter.js';

const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactTypeFilter = parseContactTypeFilter(contactType);
  const parsedContactFavouriteFilter = parseContactFavouriteFilter(isFavourite);

  return {
    contactType: parsedContactTypeFilter,
    isFavourite: parsedContactFavouriteFilter,
  };
};

export default parseContactFilterParams;
