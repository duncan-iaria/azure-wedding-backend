const guests = require('../data/Guests.seed.json');

module.exports = function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');
	context.log('Guests: ', guests);

	if (req.query.name || (req.body && req.body.name)) {
		context.res = {
			// status: 200, /* Defaults to 200 */
			body: guests.guests
		};
	}
	else {
		context.res = {
			status: 400,
			body: "Please pass a name on the query string or in the request body"
		};
	}
	context.done();
};