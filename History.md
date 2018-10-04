<a name="3.0.0"></a>
# [3.0.0](https://github.com/cheminfo/database-aggregator/compare/v3.0.0-4...v3.0.0) (2018-10-04)


### Bug Fixes

* **TaskHistory:** better message when history is empty ([c73a944](https://github.com/cheminfo/database-aggregator/commit/c73a944))
* **taskList:** only card should be clickable ([9b5dbd2](https://github.com/cheminfo/database-aggregator/commit/9b5dbd2))
* always sort disabled cards at the end ([2ea800e](https://github.com/cheminfo/database-aggregator/commit/2ea800e))
* copy task objects before modifying them ([960cd4a](https://github.com/cheminfo/database-aggregator/commit/960cd4a))
* mark styles.css as generated ([#57](https://github.com/cheminfo/database-aggregator/issues/57)) ([4a9b658](https://github.com/cheminfo/database-aggregator/commit/4a9b658))
* move react key ([3a7f3ed](https://github.com/cheminfo/database-aggregator/commit/3a7f3ed))
* task list sort ([1371a3c](https://github.com/cheminfo/database-aggregator/commit/1371a3c))


### Features

* sort sources in task list ([9dfff42](https://github.com/cheminfo/database-aggregator/commit/9dfff42))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/cheminfo/database-aggregator/compare/v1.0.4...v2.0.0) (2018-05-29)


### Bug Fixes

* use hashed index to allow for ids larger than 1024 bytes ([71d52a9](https://github.com/cheminfo/database-aggregator/commit/71d52a9))


### BREAKING CHANGES

* After this change, database must be reconstructed. "_id" field is unused
and replaced with "id".



<a name="1.0.4"></a>
## [1.0.4](https://github.com/cheminfo/database-aggregator/compare/v1.0.3...v1.0.4) (2018-04-30)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/cheminfo/database-aggregator/compare/v1.0.2...v1.0.3) (2018-04-30)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/cheminfo/database-aggregator/compare/v1.0.1...v1.0.2) (2018-04-30)


### Bug Fixes

* getting driver location shorthand ([7a36d51](https://github.com/cheminfo/database-aggregator/commit/7a36d51))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/cheminfo/database-aggregator/compare/v1.0.0...v1.0.1) (2018-04-30)


### Bug Fixes

* try to add database-aggregator-driver- prefix for driver lookup ([4698db0](https://github.com/cheminfo/database-aggregator/commit/4698db0))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/cheminfo/database-aggregator/compare/v0.0.1...v1.0.0) (2018-04-30)



<a name="0.0.1"></a>
## [0.0.1](https://github.com/cheminfo/database-aggregator/compare/a55b314...v0.0.1) (2017-12-14)


### Bug Fixes

* **scheduler:** init mongo connection ([a55b314](https://github.com/cheminfo/database-aggregator/commit/a55b314))
* add collection property to source config ([eb7e4e2](https://github.com/cheminfo/database-aggregator/commit/eb7e4e2))
* **sourceRemove:** make a lean request when getting all ids ([586d51e](https://github.com/cheminfo/database-aggregator/commit/586d51e))



