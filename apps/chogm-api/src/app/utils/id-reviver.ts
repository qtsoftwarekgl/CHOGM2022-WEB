import mapKeysDeep = require('map-keys-deep-lodash');

export const _idToid = (obj) => {
  return mapKeysDeep(JSON.parse(JSON.stringify(obj)), (value, key) => {
    if (key === '_id') {
      return 'id';
    }
    return key;
  });
};
