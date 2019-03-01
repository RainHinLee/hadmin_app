
var path = require('path')
var template = path.resolve(__dirname,'../views/login.html')
module.exports = function (req,res){
	if(req.user.uid){
		return res.redirect('/hadmin');
	}
	
	res.sendFile(template)
}


