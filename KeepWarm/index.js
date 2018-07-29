module.exports = function(context, healthCheck) {
  var timeStamp = new Date().toISOString();

  if (healthCheck.isPastDue) {
    context.log('JavaScript is running late!');
  }
  context.log('health check: ', timeStamp);

  context.done();
};
