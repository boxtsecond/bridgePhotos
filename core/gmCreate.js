/**
 * Created by xueting-bo on 17/1/5.
 */

var gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);

function createAllThumbnail(photoPath) {
    var pathInfo = {};
    return Promise.resolve()
        .then(function () {
            if(isImage(photoPath)) {
                var thumbnails = config.thumbnails;
                var photosServerPath = path.join(config.folderPrefix.savePath, '..');
                if((photosServerPath.charAt(photosServerPath.length-1)=="\\")==true||(photosServerPath.charAt(photosServerPath.length-1)=="/")==true){
                    photosServerPath=photosServerPath.toString().substring(0,photosServerPath.length-1);
                }
                var thPhotoPath = path.dirname(photoPath);
                if (thumbnails && thumbnails.length > 0) {
                    return Promise.each(thumbnails, function (photoSize) {
                        return Promise.resolve()
                            .then(function () {
                                return createFolderFromPath(thPhotoPath, photoSize.saveFolder);
                            })
                            .then(function () {
                                if (photoSize.width && photoSize.width.size) {
                                    var createPath = path.join(thPhotoPath, photoSize.saveFolder, path.basename(photoPath));
                                    return gm(photoPath).resize(photoSize.width.size).writeAsync(createPath)
                                        .then(function () {
                                            console.log(photoPath + ' create ' + photoSize.width.size + ' thumbnails success');
                                            pathInfo[photoSize.width.name] = {};
                                            pathInfo[photoSize.width.name].path = createPath;
                                            pathInfo[photoSize.width.name].url = util.enUrl(url.format(createPath.substring(photosServerPath.toString().length + 1)));
                                            return gm(createPath).sizeAsync();
                                        })
                                        .then(function (size) {
                                            pathInfo[photoSize.width.name].height = size.height;
                                            pathInfo[photoSize.width.name].width = size.width;
                                        })
                                }
                            })
                            .catch(function (err) {
                                console.log(photoPath + ' create ' + photoSize.width.size + ' thumbnails error');
                                console.error(err);
                            })
                    })
                } else {
                    console.error('CAN NOT FIND thumbnails config in CONFIG.JSON');
                }
            }
        })
        .then(function () {
            return pathInfo;
        })
}

function isImage(filepath){
    if(path.extname(filepath).toLowerCase()==='.png'||path.extname(filepath).toLowerCase()==='.jpg'||path.extname(filepath).toLowerCase()==='.jpeg') return true
    else return false;
}

//通过路径创建文件夹
function createFolderFromPath(existPath, newPath){
    var pathArray = newPath.split('/');
    var folderPath = path.normalize(existPath + '/');
    for(var i in pathArray){
        folderPath = path.normalize(folderPath + '/' + pathArray[i]);
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }
}

module.exports = {
    createThumbnail: createAllThumbnail,
    isImage: isImage
}

// "thumbnail" : {
//     "x1024" : {
//         "height" : 683,
//             "width" : 1024,
//             "url" : "media/57a760c22329982d0440102853064404f5249719d21d5027f61b76a383742a0a76a5af50cfd2548c0c58ab37827a9d214741201556d5db56665f3010355239e5698bca65d6d02a3692fc6decf8e47ae9",
//             "path" : "/data/website/photos/BPSG/20161219/jop/preview/jop_jop-5652-test-181344-65845942.JPG"
//     },
//     "x512" : {
//         "height" : 427,
//             "width" : 640,
//             "url" : "media/57a760c22329982d0440102853064404d8ae309263fb4c2c4a728aaa90744b390043e88576cd949299303fb9c585c7ac703d9e1800a23f2bb2f7f2777886b60609636857616e3278e3f0bce05c8a84de",
//             "path" : "/data/website/photos/BPSG/20161219/jop/thumbnail/640/jop_jop-5652-test-181344-65845942.JPG"
//     },
//     "x128" : {
//         "height" : 160,
//             "width" : 240,
//             "url" : "media/57a760c22329982d0440102853064404d8ae309263fb4c2c4a728aaa90744b39a2571165b94e3c0b9919d061e6beb102e6432a54918885b1cab4aa2ac4279ffca822be25c40a12c52a0fddef5ff53e84",
//             "path" : "/data/website/photos/BPSG/20161219/jop/thumbnail/240/jop_jop-5652-test-181344-65845942.JPG"
//     }
// }