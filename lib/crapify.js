var _ = require('lodash'),
  chalk = require('chalk'),
  CrappyStream = require('./crappy-stream'),
  http = require('http'),
  proxy = require('monkey-proxy'),
  Throttle = require('throttle');

function Crapify(opts) {
  _.extend(this, {
    port: 5000,
    speed: 5000,
    concurrency: 10,
    dropFrequency: 0
  }, opts)
}

Crapify.prototype.start = function() {
  var _this = this;

  this.server = proxy(http.createServer(), {
    transformRequest: [
      function() {
        return new CrappyStream({
          dropFrequency: _this.dropFrequency
        })
      },
      function() {
        return new Throttle(_this.speed);
      }
    ],
    transformResponse: [
      function() {
        return new CrappyStream({
          dropFrequency: _this.dropFrequency
        })
      },
      function() {
        return new Throttle(_this.speed);
      }
    ],
    concurrency: this.concurrency
  });

  this.server.listen(this.port, function () {
    console.log(chalk.yellow('proxy serving on :' + _this.port + ' at ' + _this.speed + ' bytes/sec, max concurrency = ' + _this.concurrency + ', dropped bytes frequency = ' + _this.dropFrequency));
  });

  this.server.on('connection', function (socket) {
    _this.socket = socket;
  });
};

Crapify.prototype.stop = function(cb) {
  var _this = this;

  this.server.close(function() {
    _this.socket.destroy();
    return cb();
  });
};

module.exports = Crapify;
