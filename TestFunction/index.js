const [DB_URI, DB_NAME] = require('../Utils').getConfigOptions();

module.exports = function(context, req) {
  context.log('Test function received a request');

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'Hello ' + (req.query.name || req.body.name)
    };
  } else {
    let tempTest = false;
    let tempVersion = process.version;
    context.log('please linux help me');
    if (typeof DB_URI === 'string') {
      tempTest = true;
    }
    context.res = {
      status: 400,
      body: `Please pass a name on the query string or in the request body ${DB_NAME}, ${tempTest}, ${tempVersion}`
    };
  }
  context.done();
};
