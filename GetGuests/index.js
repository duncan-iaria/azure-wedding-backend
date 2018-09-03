const mongodb = require('mongodb');
const [DB_URI, DB_NAME] = require('../Utils').getConfigOptions();

module.exports = function(context, req) {
  const getAllGuests = tDb => {
    tDb
      .collection('guests')
      .find({})
      .toArray((tError, tGuests) => {
        context.res = {
          status: 200,
          body: {
            error: tError,
            data: tGuests
          }
        };
        context.done();
      });
  };

  const onDbConnect = (tError, tClient) => {
    if (tError) {
      context.res = {
        status: 500,
        body: {
          error: tError,
          data: []
        }
      };
      context.log('error: ', tError);
      context.done();
    } else {
      context.log('successfully connected to the db');
      const db = tClient.db(DB_NAME);
      getAllGuests(db);
    }
  };

  context.log('All Guests endpoint was hit');

  try {
    mongodb.MongoClient.connect(
      DB_URI,
      { useNewUrlParser: true },
      onDbConnect
    );
  } catch (error) {
    context.log('error connecting to db: ', error);
    context.done();
  }
};
