var Messenger = require("@nathanfaucett/messenger"),
    MessengerWorkerAdaptor = require("../../src/index");


var adaptor = new MessengerWorkerAdaptor(),
    messenger = new Messenger(adaptor);
    

function onPing(data, next) {
    console.log(data.data);
    next(undefined, {
        "data": "pong"
    });
}

messenger.on("ping", onPing);
