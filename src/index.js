var environment = require("environment");


var MessengerWorkerAdaptorPrototype,
    globalWorker;


if (environment.worker) {
    globalWorker = self;
}


module.exports = MessengerWorkerAdaptor;


function MessengerWorkerAdaptor(url) {
    this.__worker = environment.worker ? globalWorker : new Worker(url);
}
MessengerWorkerAdaptorPrototype = MessengerWorkerAdaptor.prototype;

MessengerWorkerAdaptorPrototype.addMessageListener = function(callback) {
    this.__worker.addEventListener("message", function onMessage(e) {
        callback(JSON.parse(e.data));
    });
};

MessengerWorkerAdaptorPrototype.postMessage = function(data) {
    this.__worker.postMessage(JSON.stringify(data));
};
