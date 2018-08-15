'use strict';

const sourceSequence = require('../mongo/models/sourceSequence');
const { dropSource } = require('../mongo/model');

module.exports = {
  sources: async function (sourceConfigs) {
    const sourceNames = Object.keys(sourceConfigs);
    for (let sourceName of sourceNames) {
      let sourceConfig = sourceConfigs[sourceName];
      const currentVersion = await sourceSequence.getSourceVersion(sourceName);
      const configVersion = sourceConfig.version;
      if (configVersion !== undefined && typeof configVersion !== 'number') {
        throw new Error('source version must be a number');
      }
      if (configVersion === undefined && currentVersion !== 0) {
        throw new Error(
          `source version is ${currentVersion} but version in source config is not defined`
        );
      } else if (
        configVersion === undefined ||
        configVersion === currentVersion
      ) {
        continue;
      } else if (configVersion > currentVersion) {
        if (sourceConfig.migration) {
          // TODO: implement migration scripts
          throw new Error('migration scripts not implemented yet');
        } else {
          // If the version was incremented but no migration script exist, we drop the source collection
          await dropSource(sourceName);
          await sourceSequence.updateSourceVersion(sourceName, configVersion);
        }
      } else {
        throw new Error(
          `source version in config must be greater than current version. config version is ${configVersion} and current version is ${currentVersion}`
        );
      }
      if (configVersion === undefined) continue;
    }
  }
};
