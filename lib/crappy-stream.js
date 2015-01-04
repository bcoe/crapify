var inherits = require('util').inherits,
  Transform = require('stream').Transform;

// node v0.8.x compat
if (!Transform) Transform = require('readable-stream/transform');

function CrappyStream (opts) {
  this.dropFrequency = opts.dropFrequency;
  this.byteCount = parseInt(Math.random() * opts.dropFrequency);
  Transform.call(this);
}

inherits(CrappyStream, Transform);

CrappyStream.prototype._transform = function(chunk, encoding, next) {
  var ii = 0,
    buffer = new Buffer(chunk.length);

  for (var i = 0; i < chunk.length; i++) {
    this.byteCount++;
    if (this.byteCount % this.dropFrequency === 0) {
      continue;
    }
    buffer[ii] = chunk[i];
    ii++;
  }

  this.push(buffer.slice(0, ii));
  return next();
}

CrappyStream.prototype._flush = function(done) {
  return done();
};

module.exports = CrappyStream;
