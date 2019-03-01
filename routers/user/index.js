
var session = require('../session.js');

module.exports = {
	login(req,res){
		session.login(req,res);
	},
	
}

//function login(req,res){  //---登陆
//	console.log(req.body);
//	var body = req.body;
//	res.send(body)
//}
//
//
//module.exports = {login}


