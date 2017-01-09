/**
 * Created by meteor on 15/7/28.
 */

//node default require,global,process,__filename,__dirname, module,exports
// setTimeout,clearTimeout,setInterval,clearInterval,Buffer
// Class
//console.log(setInterval, Buffer);

//******system for node ********/
//global.sys = require('sys');
global.dgram =require('dgram')
global.path=require('path');
global.url=require('url');
global.os=require('os');
global.crypto=require('crypto') ;
//global.assert=require('assert') ;
global.child_process=require('child_process') ;
global.spawn=child_process.spawn;
global.exec=child_process.exec ;
global.execFile=child_process.execFile ;
global.fork=child_process.fork ;
//global.cluster=require('cluster');
// global.dns = require('dns');
// global.http = require('http');
// global.https = require('https');
// global.net = require('net');
// global.events = require("events");
// global.punycode = require("punycode");
global.querystring = require("querystring");
// global.readline = require("readline");
// global.repl = require("repl");
// global.string_decoder = require("string_decoder");
// global.tls = require("tls");
// global.tty = require("tty");
// global.dgram = require("dgram");
// global.vm = require('vm');
// global.zlib = require('zlib');
global.fs=require('fs');
//global.domain=require('domain');
global.config=JSON.parse(require("fs").readFileSync(require('path').join(__dirname,"..","config.json"), 'utf8'));
//global.log=config.logger;
global.uuid = require('uuid');
//global.later = require('later');
global.jstypeof=require('../tools/jstypeof.js');
global.util=require('../tools/util.js');
global.Promise=require('bluebird');

