const mongodb = require('mongodb');

module.exports = function(context, req) {
  context.log('Get Guest endpoint hit');

  const getGuest = tDb => {
    let multiSearch = tempQuery.split(' ');
    multiSearch = multiSearch.map(tQuery => {
      return new RegExp(tQuery, 'i');
    });

    context.log('multisearch = ', multiSearch);
    context.log('tempquery = ', tempQuery);
    tempQuery = new RegExp(tempQuery, 'i');
    tDb
      .collection('guests')
      // .find({ names: { $regex: tempQuery } })
      .find({ names: { $all: multiSearch } })
      .toArray((tError, tGuests) => {
        context.res = {
          status: 200,
          body: tGuests,
        };
        context.done();
      });
  };

  const onDbConnect = (tError, tClient) => {
    if (tError) {
      context.log('error: ', error);
      context.done();
    } else {
      context.log('successfully connected to the db');
      const db = tClient.db(process.env.DB_NAME);
      getGuest(db);
    }
  };

  let tempQuery = '';

  if (req.query.guestSearch || (req.body && req.body.guestSearch)) {
    tempQuery = req.query.guestSearch || req.body.guestSearch;
    mongodb.MongoClient.connect(process.env.DB_URI, onDbConnect);
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a valid search query',
    };
    context.done();
  }
};
