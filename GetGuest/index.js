const mongodb = require('mongodb');

module.exports = function(context, req) {
  context.log('Get Guest endpoint hit');
  let tempQuery = '';
  let database;

  const init = () => {
    if (req.query.guestSearch || (req.body && req.body.guestSearch)) {
      tempQuery = req.query.guestSearch || req.body.guestSearch;

      if (tempQuery.includes('request')) {
        sendResponse([], 'Please pass a valid search query', 400);
      } else {
        mongodb.MongoClient.connect(
          process.env.DB_URI,
          onDbConnect
        );
      }
    } else {
      sendResponse([], 'Please pass a valid search query', 400);
    }
  };

  const sendResponse = (tData, tError, tStatus) => {
    context.res = {
      status: tStatus || 200,
      body: {
        data: tData,
        error: tError || null,
      },
    };
    context.done();
  };

  const getGuest = tDb => {
    let multiSearch = tempQuery.split(' ');

    if (multiSearch) {
      multiSearch = multiSearch.map(tQuery => {
        if (tQuery) {
          return new RegExp(tQuery, 'i');
        }
      });

      tempQuery = new RegExp(tempQuery, 'i');
      tDb
        .collection('guests')
        .find({ names: { $all: multiSearch } })
        .toArray((tError, tGuests) => {
          if (tError) {
            sendResponse([], tError, 400);
          } else {
            sendResponse(tGuests, tError, 200);
          }
        });
    } else {
      sendResponse([], null, 200);
    }
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

  // FUNCTION EXECUTION
  init();
};
