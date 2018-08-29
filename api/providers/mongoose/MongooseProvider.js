'use strict';

const mongoose = require('mongoose');
const { ServiceProvider } = require('@adonisjs/fold');

const connection = use('Src/mongo/connection');

class MongooseProvider extends ServiceProvider {
  async register() {
    this.app.singleton('Adonis/Addons/Mongoose', () => {
      connection.connect();
      return mongoose;
    });
    this.app.alias('Adonis/Addons/Mongoose', 'Mongoose');
  }
}

module.exports = MongooseProvider;
