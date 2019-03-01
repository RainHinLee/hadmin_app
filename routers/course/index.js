
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config')

function getCourseByUserName(req,res){ //---单个用户课程信息
	var url = config.path+`/admin/product_user/key/${encodeURIComponent(req.body.username)}`;

	request.get(url).end(function (err,result){
		err ? res.send(err) : res.send(result.body)
	})
};

function getStudents(req,res){  //--获取所有课程信息列表
	var url = config.path +'/admin/product_user';

	new Promise(function (resolve,reject){
		request.get(url).end(function (err,result){
			err ? reject(err) : resolve(result.body)
		})
	}).then(function (result){ //--去重
		var lists = result['rows'];
		var arr = [];

		lists.forEach(function (item,index){
			var isContain = arr.some(function (item1,index1){
					return item1['username'] == item['username']
			});

			if(!isContain && item['username']){
				arr.push(item)
			}
		});

		result['rows'] = arr
		return result
	}).then(function (result){
		var cached = {};
		result['rows'].sort((a,b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
		res.send(result);
	}).catch(function (error){
		var expose = {
				result_code : '-1',
				result_msg : error.message
		};
		res.send(expose)
	});
};

function modify(req,res){ //--修改课程信息
	var sn = req.body.sn;
	var body = req.body.data;
	var username = req.body.username;
	var url = config.path+'/admin/product_user/product_user_sn/'+sn;

	console.log(url,body)

	new Promise(function (resolve,reject){  //--修改数据
		request.post(url).send(body).end(function (err,result){
			err ? reject(err) : resolve(result.body)
		})
	}).then(function (result){
		var code = result['result_code'];
		if(code>=0){ //--请求数据
			var url = config.path+`/admin/product_user/key/${username}`;
			return new Promise(function (resolve,reject){
				request.get(url).end(function (err,result){
					err ? reject(err) : resolve(result.body)
				})
			})
		};
		return Promise.reject(result)
	}).then(function (result){
		var lists = result['rows'];
		var items = lists.filter(function (item,index){ //--过滤修改的项
				return item['product_user_sn'] == sn
		})

		return items[0]
	}).then(function (result){
		var expose = {
				result_code: 0,
				list : result
		}
		res.send(expose)
	}).catch(function (err){
		var expose = {
			result_code : -1,
			result_msg : err.message
		}
		res.send(expose)
	})
}

function getOffLists(req,res){  //--休学列表
	var sn = req.body.sn;
	var url = config.path+`/admin/user_off_flow/product_user_sn/${sn}`;

	new Promise(function (resolve,reject){
		 request.get(url).end(function (err,result){
		 	err ? reject(err) : resolve(result.body)
		 })
	}).then(function (result){
		res.send(result)
	})
};

function addOffItem(req,res){ //--添加休学
	var sn = req.body.sn;
	var action = req.body.action || 1;
	var data = req.body.data;

	if(action==1){
		var url = config.path+`/admin/product_user/product_user_sn/${sn}/off_new/1`;
	}else{
		var url = config.path+`/admin/product_user/product_user_sn/${sn}`;
	}

	//console.log(action,url,data)

	new Promise(function (resolve,reject){
		 request.post(url).send(data).end(function (err,result){
		 	err ? reject(err) : resolve(result.body)
		 })
	}).then(function (result){
		res.send(result)
	})
};

module.exports = {
	getCourseByUserName,
	getStudents,
	modify,
	getOffLists,
	addOffItem,
}
