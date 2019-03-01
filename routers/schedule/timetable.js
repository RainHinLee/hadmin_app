var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var querystring = require('querystring')


module.exports = {
	fetchTimetableSchool(req,res){
		var options = req.body;
		var count = options['count'];
		var url = `${config.path}/timetable/list/school/opuid/1/opright/3/sdate/${options.sdate}/edate/${options.edate}`
		new Promise(function (resolve,reject){
				request.get(url).end((err,result)=>{
					err ? reject(err) : resolve(result.body)
				});
		}).then(result=>{
			result['count'] = count;
			res.send(result);
		}).catch(err=>{
			res.send({
				count,
				result_code: -1,
				result_msg: err.message
			})
		});		
	}	
}