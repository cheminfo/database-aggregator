const AGGREGATION = 'aggregation';
const SOURCE = 'source';
const META = 'meta';

const REMOVE_ID = 'source_remove_';
const COPY_ID = 'source_copy_';
const COPY_MISSING_ID = 'source_copy_missing_ids_';

export function getModelName(prefix: string, name: string) {
  return `${prefix}_${name}`;
}

export function getSourceName(name: string) {
  return getModelName(SOURCE, name);
}

export function getMetaModelName(name: string) {
  return getModelName(META, name);
}

export function getSourceModelName(name: string) {
  return getModelName(SOURCE, name);
}

export function getAggregationModelName(name: string) {
  return getModelName(AGGREGATION, name);
}

export function getCopyTaskId(collection: string) {
  return COPY_ID + collection;
}

export function getRemoveTaskId(collection: string) {
  return REMOVE_ID + collection;
}

export function getCopyMissingIdTaskId(collection: string) {
  return COPY_MISSING_ID + collection;
}
