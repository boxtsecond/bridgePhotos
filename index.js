/**
 * Created by xueting-bo on 17/1/5.
 */
require('./tools/global.js');
var gmCreate = require('./core/gmCreate.js');
var filters = require('./core/savePhoto.js');
var photoModel = require('./mongoDB/Model/photoModel.js');
var storePhotoModel = require('./mongoDB/Model/storePhotoModel.js');
var chokidar = require('chokidar');
// var watcher = chokidar.watch(config.folderPrefix.sourcePath, {
//     persistent: true,
//     followSymlinks: false,
//     usePolling: true,
//     depth: 5,
//     interval: 1000,
//     ignorePermissionErrors: false,
//     binaryInterval: 300,
//     depth: 2,
//     awaitWriteFinish: {
//         stabilityThreshold: 2000,
//         pollInterval: 1000
//     },
//     alwaysStat: true
// });
//
// watcher
//     .on('ready', function () {
//         console.log('Initial scan complete. Ready for changes.');
//     })
//     .on('add', function (path) {
//         if(gmCreate.isImage(path)){
//             console.log('add photo into mongo from ', path);
//             start(path);
//         }
//     })
//     .on('error', function (err) {
//         console.error('Chokidar file watcher failed. ERR: '+ err.message);
//     })


function start(photoPath) {
    gmCreate.createThumbnail(photoPath, config.folderPrefix.savePath)
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

var watcherStorePhotos = chokidar.watch(config.folderPrefix.storePhotosPath, {
    persistent: true,
    followSymlinks: false,
    usePolling: true,
    depth: 5,
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

watcherStorePhotos
    .on('ready', function () {
        console.log('Initial scan complete. Ready for changes.');
    })
    .on('add', function (path) {
        if(gmCreate.isImage(path)){
            console.log('add photo into mongo from ', path);
            createStorePhotos(path);
        }
    })
    .on('error', function (err) {
        console.error('Chokidar file watcher failed. ERR: '+ err.message);
    })

function createStorePhotos(photoPath) {
    gmCreate.createThumbnail(photoPath, config.folderPrefix.storePhotosSavePath)
        .then(function (thumbnail) {
            var stat = fs.statSync(photoPath);
            var photoName = photoPath.toString().split('/')[photoPath.toString().split('/').length-1];
            return gmCreate.getSize(photoPath)
                .then(function (size) {
                    var photoInfo = new filters.filterStorePhoto(photoPath, photoName, size, thumbnail, stat, config.storeLevels, config.storeSiteId);
                    return photoInfo;
                })
        })
        .then(function (photo) {
            return storePhotoModel.createAsync(photo)
                .then(function(){
                    console.log(photo._id, ' create success');
                })
        })
        .catch(function (error) {
            console.error(error);
        })
}