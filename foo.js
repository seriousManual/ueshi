var ueshi = require('./index');

function Foo() {}

Foo.prototype.bar = function(cb) {
    setTimeout(function() {
        cb(42)
    }, 1000);
};

Foo.prototype.bax = function(p1, cb) {
    setTimeout(function() {
        cb(23);
    }, 1000);
};

Foo.prototype.baz = function(p1, p2, p3, cb) {
    setTimeout(function() {
        cb(111, 222, 333);
    }, 100);
};

var Wrapper = new ueshi();
var foo = new Foo();

Wrapper.wrap(foo);

Wrapper.on('invoke', function(event) {
    console.log(event);
});

foo.bar(function() {console.log(arguments);});
foo.bax(1, function() {console.log(arguments);});
foo.bax(1, function() {console.log(arguments);});
foo.baz(1, 2, 3, function() {console.log(arguments);});
foo.baz(1, 2, 3, function() {console.log(arguments);});