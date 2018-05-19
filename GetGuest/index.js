module.exports = function (context, req) {
    context.log('Get Guest endpoint hit');

    if (req.query.guestSearch || (req.body && req.body.guestSearch)) {
        context.res = {
            status: 200,
            body: "Guest was searched for: " + (req.query.guestSearch || req.body.guestSearch)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a guest to search for on the query string or in the request body"
        };
    }
    context.done();
};