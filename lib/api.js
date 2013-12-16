var fs = require('fs'),
    url = require('url'),

    Router = require('mixu_minimal').Router,

    Package = require('./package.js'),
    Resource = require('./resource.js');

var api = new Router();

// GET /package
api.get(new RegExp('^/([^/]+)$'), function(req, res, match) {
  var name = match[1];
  Package.getIndex(name, function(err, data) {
    if (err) {
      console.error('[500] Error: ', err);
      res.statusCode = 500;
      res.end();
      return;
    }
    res.end(JSON.stringify(data));
  });
});

// GET /package/-/package-version.tgz
api.get(new RegExp('^/(.+)/-/(.+)$'), function(req, res, match) {
  var name = match[1],
      file = match[2],
      uri = 'http://registry.npmjs.org/' + name + '/-/' + file;
  // direct cache access - this is a file get, not a metadata get
  console.log('cache get', uri);

  Resource.get(uri)
          .getReadablePath(function(err, fullpath) {
            if (err) {
              console.error('[500] Error: ', err);
              res.statusCode = 500;
              res.end();
              return;
            }
            res.setHeader('Content-type', 'application/octet-stream');
            fs.createReadStream(fullpath).pipe(res);
          });
});

function notImplemented(req, res, match) {
  console.log('Not implemented', req.url);
  res.end();
}

// /-/ or /package/-/ are special
api.get(new RegExp('^/-/(.+)$'), notImplemented);
api.get(new RegExp('^/(.+)/-(.*)$'), notImplemented);

// GET /package/version
api.get(new RegExp('^/(.+)/(.+)$'), function(req, res, match) {
  var name = match[1],
      version = match[2];
  Package.getVersion(name, version, function(err, data) {
    if (err) {
      console.error('[500] Error: ', err);
      res.statusCode = 500;
      res.end();
      return;
    }
    res.end(JSON.stringify(data));
  });
});

module.exports = api;
