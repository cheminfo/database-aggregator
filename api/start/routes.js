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
  Router.get('all', 'SchedulerController.all');
  Router.get('tasks', 'SchedulerController.tasks');
  Router.post('trigger/:taskId', 'SchedulerController.trigger');
}).prefix('api/scheduler');

Router.group(() => {
  Router.get('id/:id', 'DbController.getDataById');
}).prefix('api/db/:name');

Router.any('*', ({ response }) => {
  const pathToDist = Helpers.publicPath('dist');
  return response.download(pathToDist);
});
