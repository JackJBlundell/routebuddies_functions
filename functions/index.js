const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://routebuddies-app.firebaseio.com",
});
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.database
  .ref("/notificationsend/{notification}")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.

    console.log("it was triggered", snapshot);
    const original = snapshot.val();

    console.log("it was triggered");
    // High priority, one hour.
    var options = {
      priority: "high",
      timeToLive: 60 * 60,
    };

    const payload = {
      notification: {
        title: original.title,
        body: original.body,
      },
    };

    if (original.data) {
      payload = { ...payload, data: original.data };
    }

    let topic = original.topic;

    if (topic) {
      admin
        .messaging()
        .sendToTopic(topic, payload, options)
        .then((val) => {
          console.log("Successfully sent", val.results[0].error);
        })
        .catch((val) => {
          console.log("Failed send: ", val);
        });
    }

    return snapshot.ref.child("sent").set(true);
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
  });

exports.sendUpdatedNotification = functions.database
  .ref("/notificationsend/{notification}")
  .onUpdate((snapshot, context) => {
    console.log("it was triggered", snapshot);

    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();

    console.log("it was triggered");
    // High priority, one hour.
    var options = {
      priority: "high",
      timeToLive: 60 * 60,
    };

    const payload = {
      notification: {
        title: original.title,
        body: original.body,
      },
    };

    if (original.data) {
      payload = { ...payload, data: original.data };
    }

    let topic = original.topic;

    if (topic) {
      admin
        .messaging()
        .sendToTopic(topic, payload, options)
        .then((val) => {
          console.log("Successfully sent", val.results[0].error);
        })
        .catch((val) => {
          console.log("Failed send: ", val);
        });
    }

    return snapshot.ref.child("sent").set(true);
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
  });

// exports.autoCloseDangerAlert = functions.database
// .ref("/danger_alerts/")
// .onCreate((snapshot, context) => {
//   // Grab the current value of what was written to the Realtime Database.
//   const original = snapshot.val();

//   console.log("it was triggered");
//   // High priority, one hour.
//   var options = {
//     priority: "high",
//     timeToLive: 60 * 60,
//   };

//   const payload = {
//     notification: {
//       title: "Danger Alert Closed",
//       body: original.body,
//     },
//     data: { ...original.data },
//   };

//   let topic = original.topic;

//   if (topic) {
//     admin
//       .messaging()
//       .sendToTopic(topic, payload, options)
//       .then((val) => {
//         console.log("Successfully sent", val.results[0].error);
//       })
//       .catch((val) => {
//         console.log("Failed send: ", val);
//       });
//   }

//   return snapshot.ref.child("sent").set(true);
//   // You must return a Promise when performing asynchronous tasks inside a Functions such as
// });
