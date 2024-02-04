var admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.FIREBASE_CRED);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heardleita-default-rtdb.europe-west1.firebasedatabase.app"
});

const TIME_TO_DELETE = 604800000;

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("users");
ref.once("value", function(snapshot) {
  console.debug("Users candidated:", snapshot.numChildren());
  snapshot.forEach((u) => {
    if (new Date().getTime() - u.val().timestamp >= TIME_TO_DELETE) {
       // Use remove method to delete the node
       ref.child(u.key).remove();
    }
    ref.child(u.key).update({ score: 0 });
  });

  console.debug("Users final:", snapshot.numChildren());
  process.exit(0); // 0 indicates successful termination
});
