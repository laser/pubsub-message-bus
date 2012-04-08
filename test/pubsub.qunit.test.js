module("PubSub", {});

test("will subscribe and unsubscribe topics on message bus", function() {
    var tokens = [];
    var spy = sinon.spy();

    tokens.push(PubSub.subscribe("some:event", spy));
    tokens.push(PubSub.subscribe("some:event", spy));
    tokens.push(PubSub.subscribe("some:event", spy));

    equal(tokens.length, 3, "should have three tokens");
    equal(PubSub["subscriberCount"], 3, "should have three subscribers");

    var id_0 = Number(tokens[0].split("_")[1]);
    var id_1 = Number(tokens[1].split("_")[1]);
    var id_2 = Number(tokens[2].split("_")[1]);

    ok(id_0 < id_1, "id_0: \"" + id_0.toString() + "\" < id_1: \"" + id_1.toString() + "\"");
    ok(id_1 < id_2, "id_1: \"" + id_0.toString() + "\" < id_2: \"" + id_1.toString() + "\"");

    PubSub.unsubscribe(tokens[0]);
    PubSub.unsubscribe(tokens[1]);
    PubSub.unsubscribe(tokens[2]);
});

test("will notify subscriber when broadcasting a topic", function() {
    var spy,
        token;

    spy = sinon.spy();
    token = PubSub.subscribe("some:event", spy);
    PubSub.publish("some:event");
    PubSub.publish("some-other:event"); // topic has no subscribers
    equal(spy.callCount, 1, "should have called it once");

    PubSub.unsubscribe(token);
});

test("will throw exception if unsubscribe is invoked with invalid token", function() {
    var spy,
        invalidToken;

    spy = sinon.spy();
    invalidToken = "invalid_invalid";
    PubSub.subscribe("some:event", spy);

    raises(function() {
        PubSub.unsubscribe(invalidToken);
    }, null, "should blow up on bogus token")
});

test("will throw exception if unsubscribe is invoked more than once for a token", function() {
    var spy,
        validToken;

    spy = sinon.spy();
    validToken = PubSub.subscribe("some:event", spy);

    PubSub.unsubscribe(validToken);

    raises(function() {
        PubSub.unsubscribe(validToken);
    }, null, "should blow up on subsequent unsubscribe calls");

    raises(function() {
        PubSub.unsubscribe(validToken);
    }, null, "should blow up on subsequent unsubscribe calls");
});
