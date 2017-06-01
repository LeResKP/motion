const webpush = require('web-push');

var data = JSON.parse(process.argv[2]);

webpush.sendNotification(
    JSON.parse(data.subscription),
    JSON.stringify(data.payload),
    data.options
);
