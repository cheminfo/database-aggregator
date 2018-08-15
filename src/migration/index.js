'use strict';

const sourceSequence = require('../mongo/models/sourceSequence');
const { dropSource } = require('../mongo/model');
const validation = require('../config/validation');

module.exports = {
  sources: async function (sourceConfigs) {
    sourceConfigs = validation.sources(sourceConfigs);
    const sourceNames = Object.keys(sourceConfigs);
    for (let sourceName of sourceNames) {
      let sourceConfig = sourceConfigs[sourceName];
      const currentVersion = await sourceSequence.getSourceVersion(sourceName);
      const configVersion = sourceConfig.version;
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
