var async = require('async'),
  Code = require('code'),
  Crapify = require('../lib/crapify'),
  fs = require('fs'),
  Lab = require('lab'),
  lab = exports.lab = Lab.script(),
  nock = require('nock'),
  port = 9999,
  request = require('request');

lab.experiment('Crapify', function () {

  lab.it('should allow speed of the request to be throttled', function(done) {
    var crapify = (new Crapify({
        port: port,
        speed: 500
      })),
      prequest = nock('http://www.google.com')
        .get('/')
        .reply(200, fs.readFileSync('./test/fixtures/response.txt')),
      start = new Date().getTime();

    crapify.start();

    request.get({
      url: 'http://www.google.com/',
      proxy: 'http://127.0.0.1:' + port
    }, function(err, res, body) {
      var stop = new Date().getTime();
      Code.expect(stop - start).to.be.greaterThan(1000);
      crapify.stop(done);
    });
  });

  lab.experiment('concurrency', function(done) {
    lab.it('should default to allowing multiple concurrent requests', function(done) {
      var crapify = (new Crapify({
          port: port,
          speed: 1000,
          concurrency: 2
        })),
        prequest = nock('http://www.google.com')
          .get('/')
          .twice()
          .reply(200, fs.readFileSync('./test/fixtures/response.txt')),
        start = new Date().getTime();

      crapify.start();

      async.parallel([
        function(done) {
          request.get({
            url: 'http://www.google.com/',
            proxy: 'http://127.0.0.1:' + port
          }, done);
        },
        function(done) {
          request.get({
            url: 'http://www.google.com/',
            proxy: 'http://127.0.0.1:' + port
          }, done);
        }
      ], function() {
        var stop = new Date().getTime();
        Code.expect(stop - start).to.be.lessThan(2000);
        crapify.stop(done);
      });
    });

    lab.it('should allow # of concurrent requests to be throttled', function(done) {
      var crapify = (new Crapify({
          port: port,
          speed: 1000,
          concurrency: 1
        })),
        prequest = nock('http://www.google.com')
          .get('/')
          .twice()
          .reply(200, fs.readFileSync('./test/fixtures/response.txt')),
        start = new Date().getTime();

      crapify.start();

      async.parallel([
        function(done) {
          request.get({
            url: 'http://www.google.com/',
            proxy: 'http://127.0.0.1:' + port
          }, done);
        },
        function(done) {
          request.get({
            url: 'http://www.google.com/',
            proxy: 'http://127.0.0.1:' + port
          }, done);
        }
      ], function() {
        var stop = new Date().getTime();
        Code.expect(stop - start).to.be.greaterThan(2000);
        crapify.stop(done);
      });
    });
  });

  lab.experiment("dropped bytes", function() {
    lab.it('should not drop any bytes by default', function(done) {
      var crapify = (new Crapify({
          port: port
        })),
        prequest = nock('http://www.google.com')
          .get('/')
          .reply(200, fs.readFileSync('./test/fixtures/response.txt')),
        start = new Date().getTime();

      crapify.start();

      request.get({
        url: 'http://www.google.com/',
        proxy: 'http://127.0.0.1:' + port
      }, function(err, res, body) {
        Code.expect(body.length).to.equal(1000);
        crapify.stop(done);
      });
    });

    lab.it('should allow bytes to be dropped', function(done) {
      var crapify = (new Crapify({
          port: port,
          dropFrequency: 500
        })),
        prequest = nock('http://www.google.com')
          .get('/')
          .reply(200, fs.readFileSync('./test/fixtures/response.txt')),
        start = new Date().getTime();

      crapify.start();

      request.get({
        url: 'http://www.google.com/',
        proxy: 'http://127.0.0.1:' + port
      }, function(err, res, body) {
        Code.expect(body.length).to.be.lessThan(1000);
        Code.expect(body.length).to.be.greaterThan(995);
        crapify.stop(done);
      });
    });
  });

});
