import { Ownership } from '../../types';

export function sortByTokenID(a: Ownership, b: Ownership) {
  const aTokenID = parseInt(a.tokenID, 10);
  const bTokenID = parseInt(b.tokenID, 10);

  if (aTokenID < bTokenID) { return -1; }
  if (aTokenID > bTokenID) { return 1; }

  return 0;
}
