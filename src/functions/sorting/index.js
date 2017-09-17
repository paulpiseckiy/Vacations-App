import { sortBy } from 'lodash';

export const EMPSORTS = {
  NONE: list => list,
  NAME: list => sortBy(list, 'person'),
  POSITION: list => sortBy(list, 'position')
};

export const VACSORTS = {
  NONE: list => list,
  DATE: list => sortBy(list, 'from')
};
