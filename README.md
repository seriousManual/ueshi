# ueshi [![Build Status](https://travis-ci.org/zaphod1984/ueshi.png)](https://travis-ci.org/zaphod1984/ueshi)

benchmarking

````javascript
var Ueshi = require('ueshi');

function Foo() {}

Foo.prototype.bar = function(cb) {
    setTimeout(function() {
        cb(42)
    }, 1000);
};

var Wrapper = new Ueshi();
var foo = new Foo();

Wrapper.wrap(foo);

Wrapper.on('invoke', function(event) {
    console.log(event);
    //event: {elapsed: 1000ms, name: 'bar'}
});

foo.bar(function() {
    console.log(arguments);
});
````