/*
 	session存储，获取，销毁
 	
 * 
 * */

const axios = require("axios");
const mysql = require('mysql');
const crypto = require('crypto');
const Promise= require('bluebird');
const config = require('./config');

module.exports = {
	
	create(uid){
		var time = Date.now();
		var random = Math.random() * Math.random();
		var key = time+random;
		var sid = key.toString();
		var d = crypto.createHash('md5').update(sid).digest('hex');
		var query = `insert into sessions(uid,sid,timestamp) values("${Number(uid)}","${d}","${time}")`
		//console.log(query);
		return module.exports.mysql(query).then(res=>{
			if(res && res.affectedRows>=1){
				return d;
			};
			return Promise.reject({
				message: "createSession api 写入数据失败"
			})
		})		
	},
	
	query(req,res,next){
		var user = {};
		var sid = req.cookies[config.sessionKey];
		var query = `SELECT uid FROM sessions where sid ='${sid}'`;
		if(sid){
			return module.exports.mysql(query).then(rows=>{
				return rows.length ? rows[0].uid : ""		
			}).then(uid =>{
				return uid ? module.exports.findById(uid) : user
			}).then(user=>{
				user['name'] = user['username']
				req.user = user;
				
				next();
			})
		}else{
			req.user = user;
			next();
		}		
	},
	
	mysql(query){ //---query 为mysql查询语句
		var connection = mysql.createConnection({
		   host : config.host,
		   port : 3306,
		   user : 'root',
		   password : "Hq103",
		   database : 'drupal'
	    });
		
	    return new Promise(function (resolve,reject){
		    connection.connect();   
		    connection.query(query,function (err,rows,fileds){
		    	err ? reject(err) : resolve(rows,fileds);
		    });
		   	connection.end(function (err){})
	    });  		
	},
	
	findById(uid){
		var url = `${config.path}/appbas/userinfo/uid/${uid}/service/1`;
		return axios.get(url).then(res=>res.data);
	},
	
	login(req,res){  //---登录
		var name = req.body.name
		var pass= req.body.pass;
		var keep = req.body.keep;
		var url = `${config.path}/user/login/userid/${encodeURIComponent(name)}/passwd/${encodeURIComponent(pass)}`;
		
		axios.get(url).then(result=>{
			var data = result.data;
			if(data && data.result_code==0){  //---登陆成功
				var uid = data.uid;
				var host = req.hostname;
				return module.exports.create(uid).then(session=>{ //---生成cookie
					var maxAge = keep ? 365*24*60*60*1000 : 1*24*60*60*1000;
					var options = {
							expires: new Date(Date.now() + maxAge)
					};
					res.cookie(config.sessionKey,session,options);
					res.send(data)
				});
			}else{
				res.send(data)
			};
		});		
	},
	
	logout(req,res){
		var sid = req.cookies[config.sessionKey];
		var query = `DELETE FROM sessions where sid='${sid}'`;
		module.exports.mysql(query).then(result=>{
			res.redirect(`${config.domain}/user/login`)
		})
	},	
	
}
