import { IAggregationConfig, IAggregationConfigElement } from "../types";
import { debugUtil } from "../util/debug";

const path = require("path");

const find = require("find");

const debug = debugUtil("config:aggregation");

const dbConfig: IAggregationConfig = {};
export const aggregationConfig = { aggregation: dbConfig };
// eslint-disable-next-line import/no-dynamic-require
const homeDir = require("./home").homeDir;

if (homeDir) {
  const aggregationDir = path.join(homeDir, "aggregation");
  let databases;
  try {
    debug.trace(`Searching aggregation configurations in ${aggregationDir}`);
    databases = find.fileSync(/\.js$/, aggregationDir);
  } catch (e) {
    debug.debug("No aggregation directory found");
  }
  databases = databases || [];

  for (const database of databases) {
    const configPath = path.resolve(aggregationDir, database);
    const parsedConfigPath = path.parse(configPath);
    if (parsedConfigPath.ext !== ".js") {
      continue;
    }

    // eslint-disable-next-line import/no-dynamic-require
    const databaseConfig: IAggregationConfigElement = require(configPath);
    if (!databaseConfig.sources || databaseConfig.disabled === true) {
      continue;
    }
    databaseConfig.collection = parsedConfigPath.name;
    dbConfig[parsedConfigPath.name] = databaseConfig;
  }
}
