window.PubSub = {
    _callbacks: {},
    _lastId: -1,
    subscriberCount: 0,
    subscribe: function(topic, callback) {
        ++this["subscriberCount"];
        ++this["_lastId"];

        var id = "token_" + (this["_lastId"]).toString();

        this._callbacks[topic] = this._callbacks[topic] || {};
        this._callbacks[topic][id] = callback;

        return id;
    },
    unsubscribe: function(token) {
        var found;
        search:
        for (var topic in this._callbacks) {
            if (this._callbacks.hasOwnProperty(topic)) {
                for (var t in this._callbacks[topic]) {
                    if (this._callbacks[topic].hasOwnProperty(t) && t === token) {
                        --this["subscriberCount"];
                        delete this._callbacks[topic][t];
                        found = true;
                        break search;
                    }
                }
            }
        }
        if (!found) {
            throw("subscriber not found for token \"" + token + "\"");
        }
    },
    publish: function() {
        var args,
            topic,
            token;

        args = Array.prototype.slice.call(arguments, 0);
        topic = args.shift();

        if (this._callbacks[topic]) {
            for (token in this._callbacks[topic]) {
                if (this._callbacks[topic].hasOwnProperty(token)) {
                    this._callbacks[topic][token].apply(this, args);
                }
            }
        }
    }
};
