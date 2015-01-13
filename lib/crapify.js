var _ = require('lodash'),
  chalk = require('chalk'),
  CrappyStream = require('./crappy-stream'),
  http = require('http'),
  proxy = require('monkey-proxy'),
  Throttle = require('throttle');

function Crapify (opts) {
  // set default options if none are specified.
  _.extend(this, {
    port: 5000,
    speed: 5000,
    concurrency: 10,
    dropFrequency: 0,
    sleep: 0,
    close: false
  }, opts)
}

Crapify.prototype.start = function () {
  var _this = this;

  this.server = proxy(http.createServer(), {
    transformRequest: [crappyStreamFactory, throttleFactory],
    transformResponse: [crappyStreamFactory, throttleFactory],
    sleep: this.sleep,
    concurrency: this.concurrency,
    close: this.close
  });

  this.server.listen(this.port, function () {
    console.log(chalk.yellow('proxy serving on :' + _this.port + ' at ' + _this.speed + ' bytes/sec, max concurrency = ' + _this.concurrency + ', dropped bytes frequency = ' + _this.dropFrequency));
  });

  this.server.on('connection', function (socket) {
    _this.socket = socket;
  });

  function crappyStreamFactory () {
    return new CrappyStream({
      dropFrequency: _this.dropFrequency
    });
  }

  function throttleFactory () {
    return new Throttle(_this.speed);
  }
};

Crapify.prototype.stop = function (cb) {
  var _this = this;

  this.server.close(function () {
    _this.socket.destroy();
    return cb();
  });
};

module.exports = Crapify;
