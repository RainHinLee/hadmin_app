var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


var routers = require('./routers');
var app = express();
var port = 18080;

var staticFile1 = path.resolve(__dirname,'./modules');
var staticFile2 = path.resolve(__dirname,'./dist');
var staticFile3 = path.resolve(__dirname,'./statics');

//--静态文件设置
app.use(express.static(staticFile1));
app.use(express.static(staticFile2));
app.use(express.static(staticFile3));
//--解析数据
app.use(cookieParser())
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ 'extended': true })); // application/x-www-form-urlencoded

app.use(routers.session.query)
app.get('/',routers.home); //--首页
app.get('/user/login',routers.login)//--登录页
app.get('/user/logout',routers.session.logout)//--登录页
app.post('/store/:key/:action',routers.store)  //--数据仓库

//--监听端口 ，；，，，
app.listen(port);

//zoom: https://zoom.us/j/313595733?uname=RainHinLee

/*
 	https://hanbridge.webex.com/hanbridge/m.php?MTID=m61ea8c5b82654b7bb55b00e7f30cf724
 	https://hanbridge.webex.com/hanbridge/e.php?MTID=mee6950db7b31713ff83cb1aa398fd1cb
 	https://hanbridge.webex.com/hanbridge/e.php?MTID=mee6950db7b31713ff83cb1aa398fd1cb
 
 * 
 * */