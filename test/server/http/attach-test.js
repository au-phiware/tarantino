/*
 * attach-test.js: Tests 'router.attach' functionality.
 *
 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    http = require('http'),
    vows = require('vows'),
    request = require('request'),
    tarantino = require('../../../lib/tarantino'),
    helpers = require('../helpers'),
    handlers = helpers.handlers,
    macros = helpers.macros;

function assertData(uri) {
  return macros.assertGet(
    9091,
    uri,
    JSON.stringify([1,2,3])
  );
}

vows.describe('tarantino/http/attach').addBatch({
  "An instance of tarantino.http.Router": {
    "instantiated with a Routing table": {
      topic: new tarantino.http.Router({
        '/hello': {
          get: handlers.respondWithData
        }
      }),
      "should have the correct routes defined": function (router) {
        assert.isObject(router.routes.hello);
        assert.isFunction(router.routes.hello.get);
      },
      "when passed to an http.Server instance": {
        topic: function (router) {
          router.attach(function () {
            this.data = [1,2,3];
          });

          var server = helpers.createServer(router)
            .listen(9091, this.callback);
          helpers.closeServerDelayed(server);
        },
        "a request to hello": assertData('hello'),
      }
    }
  }
}).export(module);
