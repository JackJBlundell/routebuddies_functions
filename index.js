const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://routebuddies-app.firebaseio.com",
});
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!");
  response.send("Hello from Firebase!");
});

exports.newNotification = functions.database
  .ref("/notifications/{pushId}/{notificationId}")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();

    const deviceToken = original.deviceToken;

    console.log(original.deviceToken);
    const payload = {
      notification: {
        title: original.title,
        body: original.body,
      },
    };
    console.log(deviceToken, payload);

    admin
      .messaging()
      .sendToDevice([deviceToken], payload)
      .then((val) => {
        console.log("Successfully sent", val.results[0].error);
      })
      .catch((val) => {
        console.log("Failed send: ", val);
      });
    return snapshot.ref.child("sent").set(true);
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
  });
