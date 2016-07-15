MessengerWorkerAdapter
=======

messenger WebWorker adapter

```javascript
// Worker
var Messenger = require("@nathanfaucett/messenger"),
    MessengerWorkerAdaptor = require("@nathanfaucett/messenger_worker_adapter");


var adaptor = new MessengerWorkerAdaptor(),
    messenger = new Messenger(adaptor);


function onPing(data, next) {
    console.log(data.data);
    next(undefined, {
        "data": "pong"
    });
}

messenger.on("ping", onPing);

// Main Thread
var assert = require("@nathanfaucett/assert"),
    Messenger = require("@nathanfaucett/messenger"),
    MessengerWorkerAdaptor = require("@nathanfaucett/messenger_worker_adapter");


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
```
