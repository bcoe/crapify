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
  var i = 0,
    ii = 0,
    buffer = new Buffer(chunk.length);

  // iterate over the bytes of a chunk with `i`, and copy a byte into
  // a temporary buffer at location `ii` if it is not to be dropped.
  for (; i < chunk.length; i++) {
    this.byteCount++;
    if (this.byteCount % this.dropFrequency === 0) {
      continue;
    }
    buffer[ii] = chunk[i];
    ii++;
  }

  // since the buffer may be shorter due to dropped bytes, it is needed
  // to slice off the unassigned bytes at the end of the buffer.
  this.push(buffer.slice(0, ii));

  return next();
}

CrappyStream.prototype._flush = function(done) {
  return done();
};

module.exports = CrappyStream;
