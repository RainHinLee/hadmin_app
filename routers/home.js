
var path = require('path')
var fs = require('fs');
var file = path.resolve(__dirname,'../views/index.html')
var config = require('./config.js');

module.exports = function (req,res){
	if(req.user.uid){
		var html = fs.readFileSync(file,'utf8').split('</head>')
		var injectHtml = `
					<script>
						window.user = ${JSON.stringify(req.user)}
					</script>
		`
		var text = html[0]+injectHtml+html[1];
		res.send(text)
	}else{
		res.redirect(`${config.domain}/user/login`)
	}
	
}



