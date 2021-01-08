# crapify

[![Build Status](https://travis-ci.org/bcoe/crapify.png)](https://travis-ci.org/bcoe/crapify)

crapify is a proxy for simulating slow, spotty, HTTP connections. It allows you to vary:

* the upload and download speed of requests.
* the maximum number of concurrent outbound HTTP connections.
* the number of bytes dropped during transfers.

[Contribute to Crapify on GitHub](https://github.com/bcoe/crapify)

## Usage

* `npm install crapify -g`
* `crapify start --port=5000 --speed=3000 --concurrency=2`, where:
  * `port` is the port crapify should start on.
  * `speed` is the connection speed in bytes/second.
  * `concurrency` is the number of concurrent outbound connections allowed.
  * `drop-frequency` is how often bytes should be dropped (`byte count` % `drop frequency`).

## Docker

* To build your image use: `docker build . -t crapify:latest`
* `docker run -d -p 5000:5000 crapify`. You can specify every crapify options thru env variables, eg:
  * `docker run -d -p 5000:5000 -e SPEED=3000 -e CONCURRENCY=2 crapify`

## Examples

### usage with npm

`npm config set proxy http://127.0.0.1:5000`

### usage with curl

`curl -v --proxy http://127.0.0.1:5000 https://www.google.com`

### usage with OSX

1. Go to `system preferences`.
2. Click on `Network`.
3. Click on `Advanced`.
4. Click on `Proxies`.
5. Enable an `http`, and an `https` proxy, with `127.0.0.1`, and `:5000`, respectively.

## If you like crapify, you may also like...

- [tylertreat/Comcast](https://github.com/tylertreat/Comcast), a Go frontend that simulates terrible network connections by directly modifying settings for your network interfaces.
