var async = require('async');
var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Ueshi = require('../');

function Foo() {}

Foo.prototype.bar = function(a, callback) {
    setTimeout(function() {
        callback(a);
    }, 100);
};

Foo.prototype.baz = function(a, b, c, callback) {
    setTimeout(function() {
        callback(a, b, c);
    }, 50);
};

describe('Ueshi', function () {
    var wrapper, barCB, bazCB;
    var log = [];

    before(function(done) {
        wrapper = new Ueshi();

        var foo = new Foo();

        wrapper.wrap(foo);
        wrapper.on('invoke', function(event) {
            log.push(event);
        });

        barCB = sinon.spy(function(cb) {
            cb();
        });
        bazCB = sinon.spy(function(cb) {
            cb();
        });

        async.parallel([
            function(callback) {
                foo.bar(1, barCB.bind(null, callback));
            },
            function(callback) {
                foo.bar(2, barCB.bind(null, callback));
            },
            function(callback) {
                foo.baz(3, 3, 3, bazCB.bind(null, callback));
            },
            function(callback) {
                foo.baz(4, 4, 4, bazCB.bind(null, callback));
            },
            function(callback) {
                foo.baz(5, 5, 5, bazCB.bind(null, callback));
            }
        ], done);
    });

    it('should hand the correct parameters to the callbacks', function() {
        expect(barCB).to.be.calledTwice;
        expect(bazCB).to.be.calledThrice;

        expect(barCB.args[0][1]).to.equal(1);
        expect(barCB.args[1][1]).to.equal(2);

        expect(bazCB.args[0][1]).to.equal(3);
        expect(bazCB.args[0][2]).to.equal(3);
        expect(bazCB.args[0][3]).to.equal(3);

        expect(bazCB.args[1][1]).to.equal(4);
        expect(bazCB.args[1][2]).to.equal(4);
        expect(bazCB.args[1][3]).to.equal(4);

        expect(bazCB.args[2][1]).to.equal(5);
        expect(bazCB.args[2][2]).to.equal(5);
        expect(bazCB.args[2][3]).to.equal(5);
    });

    it('should log', function() {
        expect(log.length).to.equal(5);

        expect(log[0].name).to.equal('baz');
        expect(log[0].elapsed).to.be.within(35, 65);
        expect(log[1].name).to.equal('baz');
        expect(log[1].elapsed).to.be.within(35, 65);
        expect(log[2].name).to.equal('baz');
        expect(log[2].elapsed).to.be.within(35, 65);
        expect(log[3].name).to.equal('bar');
        expect(log[3].elapsed).to.be.within(90, 130);
        expect(log[4].name).to.equal('bar');
        expect(log[4].elapsed).to.be.within(90, 130);
    });
});
