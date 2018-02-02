var chokidar = require('chokidar');
var debug = require('debug')('express-reload');
var path = require('path');
var fs = require('fs');
var loadedFolder = {};

module.exports = function(folder) {
  var rootFolder = folder;
  try {
    rootFolder = require.resolve(folder);
    rootFolder = rootFolder.substring(0, rootFolder.lastIndexOf(path.sep) + 1);
  } catch (e) {
  }
  debug('Folder to require and watch', rootFolder);
  if(!loadedFolder[rootFolder]) {
    var watcher = chokidar.watch(rootFolder);
    loadedFolder[rootFolder] = true;
    watcher.on('ready', function () {
      watcher.on('all', function () {
        Object.keys(require.cache).forEach(function (id) {
          if (id.startsWith(rootFolder)) {
            console.log('Clearing ' + id + ' module cache from server');
            delete require.cache[id];
          }
        })
      })
    });
  }
  require(folder);
  return function(req, res, next) {
    debug('require hot reload');
    require(folder)(req, res, next);
  }
}
