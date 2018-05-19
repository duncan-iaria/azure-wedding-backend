module.exports = function (context, req) {
    context.log('Update Guest Endpoint was hit');

    if (req.query.id || (req.body && req.body.id)) {
        context.res = {
            status: 200,
            body: "Update request for guest with an ID of: " + (req.query.id || req.body.id)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a valid id on the query string or in the request body"
        };
    }
    context.done();
};