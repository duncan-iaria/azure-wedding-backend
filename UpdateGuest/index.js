const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const [DB_URI, DB_NAME] = require('../Utils').getConfigOptions();
let client = null;

module.exports = function(context, req) {
  context.log('Update Guest Endpoint was hit');
  let tempGuestToUpdate = {};

  const init = () => {
    if (req.query.id || (req.body && req.body.id)) {
      tempGuestToUpdate = req.body;
      createDatabaseConnection();
    } else {
      sendResponse([], 'Please pass a valid guest id', 400);
    }
  };

  const createDatabaseConnection = () => {
    if (client) {
      onDbConnect(null, client);
    } else {
      mongodb.MongoClient.connect(
        DB_URI,
        { useNewUrlParser: true },
        onDbConnect
      );
    }
  };

  const onDbConnect = (tError, tClient) => {
    if (tError) {
      context.log('error: ', tError);
      sendResponse([], tError, 400);
    } else {
      context.log('successfully connected to the db');
      client = tClient;
      const db = tClient.db(DB_NAME);
      updateGuest(db);
    }
  };

  const updateGuest = async tDatabase => {
    const updateOption = createUpdatedGuest();

    try {
      const tempResponse = await tDatabase
        .collection('guests')
        .findOneAndUpdate(
          { _id: ObjectId(tempGuestToUpdate._id) },
          { $set: updateOption },
          { $currentDate: { lastModified: true } }
        );

      sendResponse(tempResponse, null, 200);
    } catch (tError) {
      sendResponse([], tError, 400);
    }
  };

  const createUpdatedGuest = () => {
    //SOLO GUEST
    if (tempGuestToUpdate.maxGuestCount === 1) {
      return {
        isWeddingRsvp: tempGuestToUpdate.isWeddingRsvp,
        isWelcomeRsvp: tempGuestToUpdate.isWelcomeRsvp,
        attendingWeddingGuestCount: tempGuestToUpdate.isWeddingRsvp ? 1 : 0,
        attendingWelcomeGuestCount: tempGuestToUpdate.isWelcomeRsvp ? 1 : 0,
        isResponded: true
      };
    }

    //GUEST GROUP
    return {
      isWeddingRsvp: tempGuestToUpdate.isWeddingRsvp,
      isWelcomeRsvp: tempGuestToUpdate.isWelcomeRsvp,
      attendingWeddingGuestCount: tempGuestToUpdate.attendingWeddingGuestCount,
      attendingWelcomeGuestCount: tempGuestToUpdate.attendingWelcomeGuestCount,
      isResponded: true
    };
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

  //FUNCTION EXECUTION
  init();
};
