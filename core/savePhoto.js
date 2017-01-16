/**
 * Created by xueting-bo on 17/1/6.
 */

function getDateStringFromData(fileDate){
    if(fileDate instanceof Date){
        var year = fileDate.getFullYear(); //getFullYear getYear
        var month = fileDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var date = fileDate.getDate();
        if (date < 10) date = "0" + date;
        return year + '' + month+''+date;
    }else{
        return null;
    }
}

function baseConverter (number,ob,nb) {
    //http://www.geneffects.com/briarskin/programming/newJSMathFuncs.html/
    // Created 1997 by Brian Risk.  http://brianrisk.com
    number = number.toUpperCase();
    var list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var dec = 0;
    for (var i = 0; i <=  number.length; i++) {
        dec += (list.indexOf(number.charAt(i))) * (Math.pow(ob , (number.length - i - 1)));
    }
    number = "";
    var magnitude = Math.floor((Math.log(dec))/(Math.log(nb)));
    for (var i = magnitude; i >= 0; i--) {
        var amount = Math.floor(dec/Math.pow(nb,i));
        number = number + list.charAt(amount);
        dec -= amount*(Math.pow(nb,i));
    }
    return number;
}

function getphotocode(photoCode){
    var photoCode_fix=photoCode.substring(0,5);
    photoCode=photoCode.substring(5,15+5);
    var StrphotoCode=photoCode_fix+baseConverter(photoCode,4,4);
    var arrayAU=['0','1','2','3','4','5','6','7','8','9'
        ,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u'];
    var random=Math.ceil(Math.random()*(30-0)+0);
    StrphotoCode+=arrayAU[random].toString().toUpperCase();
    return StrphotoCode;
}

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
        url:util.enUrl(url.format(photoPath.substring(path.join(config.folderPrefix.savePath, '..', '..').toString().length + 1)))
    };
}

function filterStorePhoto(photoPath, photoName, size, thumbnail, stat, levels, storeSiteId) {
    this._id = objectid();
    this.siteId = storeSiteId;
    this.thumbnail = thumbnail;if(!this.thumbnail) this.thumbnail={};
    this.shootOn = stat.ctime;if(!this.shootOn) this.shootOn = new Date();
    this.extractOn = new Date();
    this.createdOn = new Date();
    this.modifiedOn = new Date();
    this.customerIds = [];
    this.shareInfo = [];
    this.comments = [];
    this.tagBy = [];
    this.editHistorys = [];
    this.photoStatus = 'checked';
    this.originalFileName = photoName;
    this.rawFileName = photoName;
    this.belongslevels = levels;
    var dataString = getDateStringFromData(stat.mtime)
    this.photoId = config.siteId  + config.siteTerminalCode + dataString;
    this.photoId = this.photoId.toString().toUpperCase();
    this.photoCode = getphotocode(this.photoId);
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
        url:util.enUrl(url.format(photoPath.substring(path.join(config.folderPrefix.savePath, '..', '..').toString().length + 1)))
    };
}

function Padstr(str,totalWidth, paddingChar, isRightPadded) {
    if (str.length < totalWidth) {
        var paddingString = new String();
        for (var i = 1; i <= (totalWidth - str.length); i++) {
            paddingString += paddingChar;
        }
        if (isRightPadded) {
            return (str + paddingString);
        } else {
            return (paddingString + str);
        }
    } else {
        return str;
    }
}

module.exports = {
    filterPhoto: filterPhoto,
    filterStorePhoto: filterStorePhoto
}
