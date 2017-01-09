/**
 * Created by xueting-bo on 17/1/5.
 */
require('./tools/global.js');
var gmCreate = require('./core/gmCreate.js');
var chokidar = require('chokidar');
var watcher = chokidar.watch(config.photosPath, {
    persistent: true,
    followSymlinks: false,
    usePolling: true,
    depth: undefined,
    interval: 100,
    ignorePermissionErrors: false
});

// watcher
//     .on('ready', function () {
//         console.log('Initial scan complete. Ready for changes.');
//     })
//     .on('add', function (path) {
//
//     })
//     .on('error', function (err) {
//         console.error('Chokidar file watcher failed. ERR: '+ err.message);
//     })


function start() {
    return Promise.resolve()
        .then(function () {
            return gmCreate.createThumbnail(config.photosPath+ 'bbb.JPG');
        })
        .then(function (pathInfo) {
            console.log(pathInfo);
        })
}

start();