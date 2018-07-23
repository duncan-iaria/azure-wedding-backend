const mongodb = require('mongodb');
const [DB_URI, DB_NAME] = require('../Utils').getConfigOptions();
let client = null;

module.exports = function(context, req) {
  context.log('Get Guest endpoint hit');
  let tempQuery = '';

  const init = () => {
    if (req.query.guestSearch || (req.body && req.body.guestSearch)) {
      tempQuery = req.query.guestSearch || req.body.guestSearch;

      if (tempQuery.includes('request')) {
        sendResponse([], 'Please pass a valid search query', 400);
      } else {
        createDatabaseConnection();
      }
    } else {
      sendResponse([], 'Please pass a valid search query', 400);
    }
  };

  const createDatabaseConnection = () => {
    if (client) {
      onDbConnect(null, client);
    } else {
      context.log('trying');
      mongodb.MongoClient.connect(
        DB_URI,
        { useNewUrlParser: true },
        onDbConnect
      );
    }
  };

  const sendResponse = (tData, tError, tStatus) => {
    context.res = {
      status: tStatus || 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        data: tData,
        error: tError || null
      }
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
      sendResponse([], tError, 502);
    } else {
      client = tClient;
      const db = tClient.db(DB_NAME);
      getGuest(db);
    }
  };

  // FUNCTION EXECUTION
  init();
};
