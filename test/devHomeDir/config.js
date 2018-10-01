'use strict';

const TEST_ERROR = false;

module.exports = {
  middleware: async (ctx, next) => {
    if (!TEST_ERROR) {
      return next();
    }
    ctx.response.status(401);
    ctx.response.send('unauthorized');
  }
};
