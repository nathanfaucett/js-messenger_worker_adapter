var assert = require("assert"),
    Messenger = require("messenger"),
    MessengerWorkerAdaptor = require("../../src/index");


var adaptor = new MessengerWorkerAdaptor("worker.js"),
    messenger = new Messenger(adaptor);


function onPongCallback(error, data) {
    console.log(data.data);
    setTimeout(ping, 1000);
}

function ping() {
    messenger.emit("ping", {
        data: "ping"
    }, onPongCallback);
}

ping();
