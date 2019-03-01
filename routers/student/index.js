//--老师的学生模块
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var user = require('user');

module.exports = Object.create({

	findStudentByName(req,res){
		var url = config.path+'/admin/user_teacher_list';
		var username = (req.body.username || '').toLowerCase();

		new Promise(function (resolve,reject){
				request.get(url).end(function (err,result){
					err ? reject(err) : resolve(result.body)
				})
		}).then(function (result){
			var lists = result['data_list'];
			var expose = lists.filter(function (item){
					var name = (item['username'] || '').toLowerCase()
					return  name == username
			});

			return expose;
		}).then(function (result){
			res.send(result)
		}).catch(function (error){
			res.send({});
		})	
	},
	
	findUserByName(req,res){
		var username = req.body.username;
		var count = req.body.count;
		var url = `${config.path}/user/list/userid/${username}`;
		return new Promise(function (resolve,reject){
			request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			})
		}).then(function (results){
			var list = results['user_list'] || [];
			results['count'] = count;
			res.send(results)
		}).catch(err=>{
			res.send({
				result_code:-1,
				count,
				result_msg: err.message
			})
		})
	}

})