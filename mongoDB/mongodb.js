/**
 * Created by xueting-bo on 17/1/5.
 */

var mongoose = require('mongoose');
var Promise = require("bluebird");
mongoose.Promise=Promise;
Promise.promisifyAll(mongoose);
var configData=require('../config.json').DB.MongoDB;
var opts = {
    // "server":
    // {"native_parser":true,"poolSize":5,"auto_reconnect": true,"socketOptions":{"keepAlive":1},"reconnectTries":30,"haInterval":1000 },
    // "db":{"native_parser":true,"strategy": "ping","readPreference":"primaryPreferred","bufferMaxEntries":5},
    // "replset":
    // {"rs_name":"pictureWorks","readPreference":"primaryPreferred","strategy":"ping","poolSize":5,"connectWithNoPrimary":true,"haInterval":1000
    // },
    user: configData.user, pass: configData.pass
};
var connectStr="mongodb://"+configData.host+"/"+configData.dbName;


console.log(connectStr)
var db = mongoose.createConnection(connectStr,opts,function(err){
    if (err) {
        console.warn('can not connect',err);
        console.warn(err);
    } else {
        console.log('connect .. host:'+connectStr);
    }
});
db.on('error', function(error) {
    db.close();
    console.error(error);
});
db.on('reconnected',function(){
    console.log('reconnected:'+connectStr)
});

module.exports= db;