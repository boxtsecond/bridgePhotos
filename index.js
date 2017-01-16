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

//console.log(util.deUrl('57a760c22329982d04401028530644044e01b0c59a20a65e456fafc5808bd07a727246149c4135f87bc945cc46916428f219c6de3aa7bc3b1390089a77f024441b02eca7ec970daf2ff7458ddd0d9e7053e987996a5d4b5535f1b0a76df3c481'));