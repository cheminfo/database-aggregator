'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Helpers = use('Helpers');
const Router = use('Route');

Router.group(() => {
  Router.get('tasks', 'SchedulerController.tasks');
}).prefix('api/scheduler');

Router.group(() => {
  Router.get('/', 'AggregationController.get');
  Router.get('history', 'AggregationController.history');
  Router.post('trigger', 'AggregationController.trigger');
}).prefix('api/scheduler/aggregation/:name');

Router.group(() => {
  Router.get('/', 'SourceController.get');
  Router.get('history', 'SourceController.history');
  Router.post('trigger', 'SourceController.trigger');
}).prefix('api/scheduler/source/:name');

Router.group(() => {
  Router.get('aggregation/:name/id/:id', 'DbController.getAggregationById');
  Router.get('source/:name/id/:id', 'DbController.getSourceById');
  Router.get('source/:name/commonId/:id', 'DbController.getSourceByCommonId');
  Router.delete('aggregation/:name', 'DbController.deleteAggregation');
  Router.delete('source/:name', 'DbController.deleteSource');
}).prefix('api/db');

Router.any('*', ({ response }) => {
  const pathToDist = Helpers.publicPath('dist');
  return response.download(pathToDist);
});
