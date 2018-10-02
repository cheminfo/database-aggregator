import { ISourceDriverConfig } from '../types';

export function validateDriver(driver: ISourceDriverConfig) {
  if (typeof driver.getData !== 'function') {
    throw new TypeError('driver must provide a method named "getData"');
  } else if (typeof driver.getIds !== 'function') {
    throw new TypeError('driver must provide a method named "getIds"');
  }
}
