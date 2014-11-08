var util = require('util');
var Emitter = require('events').EventEmitter;

var hirestime = require('hirestime');

var hop = function(obj, prop) {
    return obj.hasOwnProperty(prop)
};

var KEY_EXCLUDE_PRIVATE = 'excludePrivate';

function Ueshi(options) {
    this._options = options || {};

    Emitter.call(this);
}

util.inherits(Ueshi, Emitter);

Ueshi.prototype.wrap = function(subject) {
    for(var a in subject) {
        if (hop(subject, subject[a])) continue;
        if (this._options[KEY_EXCLUDE_PRIVATE] && a[0] == '_') continue;

        this._wrapFunction(subject, a, subject[a]);
    }
};

Ueshi.prototype._wrapFunction = function(subject, fnName, fn) {
    var that = this;

    var subjectName = subject.constructor.name;

    subject[fnName] = function() {
        var parameters = Array.prototype.slice.call(arguments, 0);

        var elapsed = hirestime();
        var oldCallback = parameters.pop();
        parameters.push(function() {
            oldCallback.apply(null, Array.prototype.slice.call(arguments, 0));

            var logData = {
                name: fnName,
                elapsed: elapsed()
            };

            if (subjectName) logData.subject = subjectName;

            that.emit('invoke', logData);
        });

        fn.apply(subject, parameters);
    };
};

module.exports = Ueshi;