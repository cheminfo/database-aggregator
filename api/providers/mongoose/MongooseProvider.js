'use strict';

const mongoose = require('mongoose');
const { ServiceProvider } = require('@adonisjs/fold');

const connection = use('Src/mongo/connection');

class MongooseProvider extends ServiceProvider {
  register() {
    this.app.singleton('Adonis/Addons/Mongoose', () => {
      return mongoose;
    });
    this.app.alias('Adonis/Addons/Mongoose', 'Mongoose');
  }
  async boot() {
    await connection.connect();
  }
}

module.exports = MongooseProvider;
