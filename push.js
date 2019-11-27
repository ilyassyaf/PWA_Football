var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BFjzF1Fa23lJ8jWUBvXBNBE6JZCfWgwQp63UAzg9EBDdJf5tjW2ucCqTZJFUddpIeczw7kPd-ROC6XQzq7SY-cg",
  privateKey: "aqpIbOcPZWunDGARx7MPHJycs1NT0YBC4hPPfSiFfiE"
};

webPush.setVapidDetails(
  "mailto:ilyas.syafii@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dnQrlW8Meb0:APA91bEgSd6d6pTlrh4_aYYpBwUPeEUY05smJOsPXbf4QurVaVrnvf469sHSOREbiCf7pGwQpoOYp3WRJVgU2m23-2jW6iRN0bFpiR0EfQPT54PIXyxoBcUMCmWBt4d8xpArnQa50uN9",
  keys: {
    p256dh:
      "BG3vIhZiyUM7fIBlTIxyIV4YjiUI+pZd7mMpuvRdXPrhcO0a73u76zJFbeDzWHSqSAZ9awtHk+4woOcD0+MdQTg=",
    auth: "djGCAdiqWW5gG98jfTZ5hg=="
  }
};

var payload = "You can now receive push notification";

var options = {
  gcmAPIKey: "690584001963",
  TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);
