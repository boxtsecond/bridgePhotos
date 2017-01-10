/**
 * Created by xueting-bo on 17/1/5.
 */
require('./tools/global.js');
var gmCreate = require('./core/gmCreate.js');
var filters = require('./core/savePhoto.js');
var photoModel = require('./mongoDB/Model/photoModel.js');
var chokidar = require('chokidar');
var watcher = chokidar.watch(config.folderPrefix.sourcePath, {
    persistent: true,
    followSymlinks: false,
    usePolling: true,
    depth: undefined,
    interval: 1000,
    ignorePermissionErrors: false,
    binaryInterval: 300,
    depth: 2,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 1000
    },
    alwaysStat: true
});

watcher
    .on('ready', function () {
        console.log('Initial scan complete. Ready for changes.');
    })
    .on('add', function (path) {
        if(gmCreate.isImage(path)){
            console.log('add photo into mongo from ', path);
            start(path);
        }
    })
    .on('error', function (err) {
        console.error('Chokidar file watcher failed. ERR: '+ err.message);
    })


function start(photoPath) {
    gmCreate.createThumbnail(photoPath)
        .then(function (thumbnail) {
            var stat = fs.statSync(photoPath);
            var photoName = photoPath.toString().split('/')[photoPath.toString().split('/').length-1];
            return gmCreate.getSize(photoPath)
                .then(function (size) {
                    var photoInfo = new filters.filterPhoto(photoPath, photoName, size, thumbnail, stat);
                    return photoInfo;
                })
        })
        .then(function (photo) {
            return photoModel.createAsync(photo)
                .then(function(){
                    console.log(photo._id, ' create success');
                })
        })
        .catch(function (error) {
            console.error(error);
        })
}
