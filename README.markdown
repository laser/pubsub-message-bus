pubsub.js is a (currently singleton) message bus implemented in JavaScript

# Example usage

```javascript

(function() {

    var handler = function(object) {
        alert(object["name"]);
    };

    var other_handler = function(object) {
        alert("I'm totally different than the first!");
    };

    var token = PubSub.subscribe("some:message", handler);
    var other_token = PubSub.subscribe("some:message", other_handler);

    var o = {
        "name": "Erin"
    };

    PubSub.publish("some:message", o);

    PubSub.unsubscribe(token);
    PubSub.unsubscribe(other_token);
}());

```
