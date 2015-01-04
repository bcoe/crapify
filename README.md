# crapify

crapify is a proxy for simulating slow, spotty, HTTP connections. It allows you to limit:

* the upload and download speed of requests.
* the maximum number of concurrent outbound HTTP connections.

[Contribute to Crapify on GitHub](https://github.com/bcoe/crapify)

## Usage

* `npm install crapify -g`
* `crapify --port=5000 --speed=3000 --concurrency=2`, where:
  * `port` is the port crapify should start on.
  * `speed` is the connection speed in bytes/second.
  * `concurrency` is the number of concurrent outbound connections allowed.
  * `drop-frequency` how often should bytes be dropped? (`byte count` % `drop frequency`).

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
