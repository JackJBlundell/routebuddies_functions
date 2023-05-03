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
