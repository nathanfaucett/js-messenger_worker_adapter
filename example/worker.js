(function(dependencies, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, global) {

var Messenger = require(1),
    MessengerWorkerAdaptor = require(2);


var adaptor = new MessengerWorkerAdaptor(),
    messenger = new Messenger(adaptor);


function onPing(data, next) {
    console.log(data.data);
    next(undefined, {
        "data": "pong"
    });
}

messenger.on("ping", onPing);


},
function(require, exports, module, global) {

var MESSENGER_ID = 0,
    MessengerPrototype;


module.exports = Messenger;


function Messenger(adaptor) {
    var _this = this;

    this.__id = (MESSENGER_ID++).toString(36);
    this.__messageId = 0;
    this.__callbacks = {};
    this.__listeners = {};

    this.__adaptor = adaptor;

    adaptor.addMessageListener(function onMessage(data) {
        _this.onMessage(data);
    });
}
MessengerPrototype = Messenger.prototype;

MessengerPrototype.onMessage = function(message) {
    var id = message.id,
        name = message.name,
        callbacks = this.__callbacks,
        callback = callbacks[id],
        listeners, adaptor;

    if (name) {
        listeners = this.__listeners;
        adaptor = this.__adaptor;

        if (listeners[name]) {
            emit(listeners[name], message.data, function callback(error, data) {
                adaptor.postMessage({
                    id: id,
                    error: error || undefined,
                    data: data
                });
            });
        }
    } else {
        if (callback && isMatch(id, this.__id)) {
            callback(message.error, message.data);
            delete callbacks[id];
        }
    }
};

MessengerPrototype.emit = function(name, data, callback) {
    var id = this.__id + "-" + (this.__messageId++).toString(36);

    if (callback) {
        this.__callbacks[id] = callback;
    }

    this.__adaptor.postMessage({
        id: id,
        name: name,
        data: data
    });
};

MessengerPrototype.on = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name] || (listeners[name] = []);

    listener[listener.length] = callback;
};

MessengerPrototype.off = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name],
        i;

    if (listener) {
        i = listener.length;

        while (i--) {
            if (listener[i] === callback) {
                listener.splice(i, 1);
            }
        }
    }
};

function emit(listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function done(err, data) {
        if (called === false) {
            called = true;
            callback(err, data);
        }
    }

    function next(err, data) {
        if (err || index === length) {
            done(err, data);
        } else {
            listeners[index++](data, next);
        }
    }

    next(undefined, data);
}

function isMatch(messageId, id) {
    return messageId.split("-")[0] === id;
}


},
function(require, exports, module, global) {

var environment = require(3);


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


},
function(require, exports, module, global) {

var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.worker = typeof(importScripts) !== "undefined";

environment.browser = environment.worker || !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.worker && !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};


}], (new Function("return this;"))()));
