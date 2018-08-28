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

const Router = use('Route');

Router.group(() => {
  Router.get('all', 'SchedulerController.all');
  Router.get('tasks', 'SchedulerController.tasks');
  Router.post('trigger/:taskId', 'SchedulerController.trigger');
}).prefix('scheduler');
