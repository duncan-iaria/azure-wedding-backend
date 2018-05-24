const mongodb = require('mongodb');

module.exports = function(context, req) {
  const getAllGuests = tDb => {
    tDb
      .collection('guests')
      .find({})
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
      getAllGuests(db);
    }
  };

  context.log('All Guests endpoint was hit');
  mongodb.MongoClient.connect(process.env.DB_URI, onDbConnect);
};
