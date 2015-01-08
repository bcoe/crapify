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

CrappyStream.prototype._transform = function (chunk, encoding, next) {
  if (this.dropFrequency !== 0) {
    var i = 0,
      ii = 0,
      buffer = new Buffer(chunk.length);

    // Iterate over the bytes of a chunk with `i`, and copy a byte into
    // a temporary buffer at index `ii` if it is not to be dropped.
    // Note that this method drops bytes in a uniform distribution.
    for (; i < chunk.length; i++) {
      this.byteCount++;
      if (this.byteCount % this.dropFrequency === 0) {
        continue;
      }
      buffer[ii] = chunk[i];
      ii++;
    }

    // Since the buffer may be shorter due to dropped bytes, it is needed
    // to slice off the unassigned bytes at the end of the buffer.
    this.push(buffer.slice(0, ii));

  } else {
    // Skip iterating over bytes if nothing is to be dropped, just write
    // it and get it over with.
    this.push(chunk);
  }

  return next();
}

CrappyStream.prototype._flush = function (done) {
  return done();
};

module.exports = CrappyStream;
