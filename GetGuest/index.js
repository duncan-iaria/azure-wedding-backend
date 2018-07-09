const mongodb = require('mongodb');
const [DB_URI, DB_NAME] = require('../Utils').getConfigOptions();

module.exports = function(context, req) {
  context.log('Get Guest endpoint hit');
  let tempQuery = '';
  let database;

  context.log('\n\n db_uri:', DB_URI);
  context.log('\n\n db_name:', DB_NAME);

  const init = () => {
    if (req.query.guestSearch || (req.body && req.body.guestSearch)) {
      tempQuery = req.query.guestSearch || req.body.guestSearch;

      if (tempQuery.includes('request')) {
        sendResponse([], 'Please pass a valid search query', 400);
      } else {
        mongodb.MongoClient.connect(
          DB_URI,
          { useNewUrlParser: true },
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
      headers: {
        'Content-Type': 'application/json',
      },
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

      tDb
        .collection('guests')
        .find({ names: { $all: multiSearch } })
        .toArray((tError, tGuests) => {
          if (tError) {
            sendResponse([], tError, 400);
          } else {
            sendResponse(tGuests, null, 200);
          }
        });
    } else {
      sendResponse([], null, 200);
    }
  };

  const onDbConnect = (tError, tClient) => {
    if (tError) {
      context.log('error: ', tError);
      context.done();
    } else {
      context.log('successfully connected to the db');
      const db = tClient.db(DB_NAME);
      // context.log('\ndb:\n', db, '\n');
      getGuest(db);
    }
  };

  // FUNCTION EXECUTION
  init();
};
