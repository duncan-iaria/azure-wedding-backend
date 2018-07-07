const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

module.exports = function(context, req) {
  context.log('Update Guest Endpoint was hit');
  let tempGuestToUpdate = {};

  const init = () => {
    if (req.query.id || (req.body && req.body.id)) {
      tempGuestToUpdate = req.body;

      mongodb.MongoClient.connect(
        process.env.DB_URI,
        { useNewUrlParser: true },
        onDbConnect
      );
    } else {
      sendResponse([], 'Please pass a valid guest id', 400);
    }
  };

  const onDbConnect = (tError, tClient) => {
    if (tError) {
      context.log('error: ', tError);
      sendResponse([], tError, 400);
    } else {
      context.log('successfully connected to the db');
      const db = tClient.db(process.env.DB_NAME);
      updateGuest(db);
    }
  };

  const updateGuest = async tDatabase => {
    const updateOption = {
      isWeddingRsvp: tempGuestToUpdate.isWeddingRsvp,
      isWelcomeRsvp: tempGuestToUpdate.isWelcomeRsvp,
      attendingGuestCount: tempGuestToUpdate.attendingGuestCount,
      isResponded: true,
    };

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

  //FUNCTION EXECUTION
  init();
};
