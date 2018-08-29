const path = require('path');

import { connection } from 'mongoose';

export function getDriverPath(name: string) {
  return path.join(__dirname, 'driver', name);
}

export function getCollection(name: string) {
  return connection.collection(name);
}

export function clean(data: any) {
  if (Array.isArray(data)) {
    data.forEach(item => {
      delete item._id;
    });
  } else {
    delete data._id;
  }
  return data;
}
