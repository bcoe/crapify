var _ = require('lodash'),
  chalk = require('chalk'),
  http = require('http'),
  proxy = require('monkey-proxy'),
  Throttle = require('throttle');

function Crapify(opts) {
  _.extend(this, {
    port: 5000,
    speed: 5000,
    concurrency: 1
  }, opts)
}

Crapify.prototype.start = function() {
  var _this = this;

  this.server = proxy(http.createServer(), {
    transformRequest: function(stream) {
      return new Throttle(_this.speed);
    },
    transformResponse: function(stream) {
      return new Throttle(_this.speed);
    },
    concurrency: this.concurrency
  });

  this.server.listen(this.port, function () {
    console.log(chalk.yellow('Crapify proxy serving on :' + _this.port + ' at ' + _this.speed + ' bytes/second, with max concurrency of ' + _this.concurrency));
  });
};

module.exports = Crapify;
