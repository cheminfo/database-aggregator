import { ISourceDriverConfig } from '../types';
import { validateDriver } from '../util/validateDriver';

export function getDriver(
  driver: string | ISourceDriverConfig
): ISourceDriverConfig {
  const driverModule = getDriverModule(driver);
  if (typeof driverModule !== 'object' || driverModule === null) {
    throw new TypeError('driver must be a string or object');
  }

  validateDriver(driverModule);

  return driverModule;
}

function getDriverModule(
  driver: string | ISourceDriverConfig
): ISourceDriverConfig {
  if (typeof driver === 'string') {
    let driverLocation;
    if (!driver.includes('/')) {
      try {
        driverLocation = require.resolve(
          `database-aggregator-driver-${driver}`
        );
      } catch (e) {
        // ignore
      }
    }
    if (!driverLocation) {
      try {
        driverLocation = require.resolve(driver);
      } catch (e) {
        throw new Error(`could not resolve driver location: ${driver}`);
      }
    }

    // eslint-disable-next-line import/no-dynamic-require
    const driverModule: ISourceDriverConfig = require(driverLocation);
    if (typeof driverModule !== 'object' || driverModule === null) {
      throw new TypeError('driver module must be an object');
    }
    return driverModule;
  } else {
    return driver;
  }
}
