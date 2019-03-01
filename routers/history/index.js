

var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var querystring = require('querystring')

module.exports = Object.create({
	fetch(req,res){
		var options = req.body.options;
		var url = config.path+`/timetable/list/teacher/teacher_uid/${options.tid}`;

		if(options.sdate){
			url = url + `/sdate/${options.sdate.replace(/-/g,'')}`;
		};

		if(options.edate){
			url = url+`/edate/${options.edate.replace(/-/g,'')}`;
		}

		new Promise(function (resolve,reject){
			return request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			})
		}).then(function (result){  //---过滤含有学生的课程
			var lists = result['teacher_list'][0] || [];
			var timeLists = lists['timetable_list'] || [];

			if(options.uid){  //---学生过滤条件
				var ret = timeLists.filter(function (item){
					var books = item['book_list'] || [];
					return books.some(function (item1){
						return item1['uid'] == options.uid
					})
				});
				result['lists'] = ret;
			}else{
				result['lists'] = timeLists;

			};

			result['rows'] = result['lists'].length;
			delete result['teacher_list'];
			
			return result

		}).then(function (result){
			res.send(result)
		}).catch(function (error){
			res.send(error)
		})
	},

	modify(req,res){   //---修改状态
		var options = req.body.options;
		var query = querystring.stringify(options,'/','/');
		var url = config.path +'/timetable/'+query;
		
		/*
		 	
		 * */
		
		new Promise(function (resolve,reject){
				request.post(url).end(function (err,result){
					err? reject(err) : resolve(result.body)
				})
		}).then(function (result){

			res.send(result)
		}).catch(function (err){
			var expose = {
					result_code : '-1',
					result_msg : err.message
			}
			res.send(expose)
		})
	}

})
