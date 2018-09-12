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
  Router.get('history', 'AggregationController.history')
}).prefix('api/scheduler/aggregation/:name');

Router.group(() => {
  Router.get('/', 'SourceController.get');
  Router.get('history', 'SourceController.history');
}).prefix('api/scheduler/source/:name');

Router.group(() => {
  Router.get('id/:id', 'DbController.getDataById');
}).prefix('api/db/:name');

Router.any('*', ({ response }) => {
  const pathToDist = Helpers.publicPath('dist');
  return response.download(pathToDist);
});
