/**
 * Created by xueting-bo on 17/1/6.
 */

//photoName:  BPSGFD7D8A4819027,bpsg,20161230201041277,201612300027_19,2BP_0251_L1,2016-12-30.jpg
//stat: 文件状态
function filterPhoto(photoPath, photoName, size, thumbnail, stat) {
    this._id = objectid();
    this.thumbnail = thumbnail;if(!this.thumbnail) this.thumbnail={};
    this.appServerIP = config.appServerIP;if(!this.appServerIP) this.appServerIP='';
    this.storageServerIP = config.storageServerIP;if(!this.storageServerIP) this.storageServerIP='';
    this.shootOn = stat.ctime;if(!this.shootOn) this.shootOn = new Date();
    this.extractOn = new Date();
    this.createdOn = new Date();
    this.modifiedOn = new Date();
    this.customerIds = [];
    this.userIds = [];
    this.orderHistory = [];
    this.shareInfo = [];
    this.comments = [];
    this.tagBy = [];
    this.editHistorys = [];
    this.photoStatus = 'checked';
    this.originalFileName = photoName;
    this.rawFileName = photoName;
    var photoInfo = photoName.split(',');
    if(photoInfo.length > 1){
        this.photoCode = photoInfo[0];
        this.siteId = photoInfo[1].toString().toUpperCase();
    }
    if(!this.photoCode)this.photoCode=''; if(!this.siteId)this.siteId='';
    this.thumbnailType = [];
    for(var i in thumbnail){
        this.thumbnailType.push(i);
    }
    this.originalInfo= {
        originalName:photoName,
        path:photoPath,
        width: size.width,
        height:size.height,
        url:util.enUrl(url.format(photoPath.substring(path.join(config.folderPrefix.savePath, '..').toString().length + 1)))
    };
}

module.exports = {
    filterPhoto: filterPhoto
}
