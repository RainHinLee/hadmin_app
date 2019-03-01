
//--老师安排模块数据中心
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var user = require('user')

var store = Object.create({

		getStudents:function (req,res){ //--获取学生
			var url = config.path+'/admin/user_teacher_list';

			new Promise(function (resolve,reject){
					request.get(url).end(function (err,result){
						err ? reject(err) : resolve(result.body)
					})
			}).then(function (result){
				var lists = result['data_list'].map(function (item){  //--过滤掉多余数据
						return {
							name : item['username'],
							uid : item['uid']
						}
				});

				result['data_list'] = lists
				res.send(result);

			}).catch(function (error){
				res.send(error)
			})
		},

		getTeachers:function (req,res){  //---获取老师数据
			var url = config.host+'cmsapi/wp/posts/post_type/teacher';
			var expose ={};
			console.time("all");
			new Promise(function (resolve,reject){ //---从wp上取得数据
				 console.time("teachers")
					request.get(url).end(function (err,result){
						err ? reject(err) : resolve(result.body)
					})
			}).then(function (result){
				console.timeEnd("teachers")
				var states = ['不限',"线上",'线下']; //--老师状态
				var ret = result['data'].filter(function(item){
						return states.indexOf(item['teacher_type']) >=0
				});
				result['data'] = ret;
				return result

			}).then(function (result){ //--根据姓名从服务器取得id
				console.time("map")
				expose = result
				return Promise.map(expose['data'],function (item){
					var name = item['post_title'];
					return user.findByName(name);
				})

			}).then(function (lists){ //---过滤多余数据
				console.timeEnd("map")
				expose['data'] = lists.map(function (item){
					var user = item['user_list'][0];
					return {
						name : user ? user['username'] : '',
						uid : user ? user['uid'] : ''
					}
				}).sort((a,b)=>{
					return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
				})
				return expose;

			}).then(function (expose){
				res.send(expose)
				console.timeEnd("all");
			}).catch(function (error){
				res.send(error)
			})
		},

		getStudent:function (req,res){ //--学生的老师列表
			var uid = req.body.uid
			var url=config.path+`/admin/user_teacher_list/uid/${uid}`;
			new Promise(function (resolve,reject){
					request.get(url).end(function (err,result){
						err ? reject(err) : resolve(result.body)
					});
			}).then(function (result){ //---wp上取得老师信息；


				var lists = result['data_list'][0] || {};
				var teachers = lists['teacher_list'] || []; //--老师列表；

				var wp_url = config.host+'cmsapi/wp/posts/post_type/teacher';

				return new Promise(function (resolve,reject){
					request.get(wp_url).end(function (err,result){
						err ? reject(err) : resolve(result.body)
					});
				}).then(function (body){
					var data = body['data'] || [];

					for(var i=0;i<data.length;i++){
						var item = data[i];
						var i_name = item['post_title'].toLowerCase();

						for(var j=0;j<teachers.length;j++){
							var teacher = teachers[j];
							var t_name = teacher['username'].toLowerCase();
							if(i_name==t_name){
								teacher['w_remark'] = item['remark'];
								teacher['w_state'] = item['teacher_type'];
								teacher['w_experience'] = item['experience']
							}
						}
					};

					return result
				})

			}).then(function (result){
				res.send(result)
			}).catch(function (error){
				res.send(error)
			})
		},

		getTeacher:function (req,res){ //--老师的学生列表
			var uid = req.body.uid
			var url=config.path+`/admin/teacher_user_list/uid/${uid}`;

			new Promise(function (resolve,reject){
					request.get(url).end(function (err,result){
						err ? reject(err) : resolve(result.body)

					})
			}).then(function (result){
				res.send(result)

			}).catch(function (error){
				res.send(error)
			})
		},

		add: function (req,res){  //--添加老师
			var uid = req.body.uid
			var tid = req.body.tid
			var idx = req.body.idx
			var url = config.path+`/admin/user_assign_teacher/teacher_uid/${tid}/uid/${uid}/idx/${idx}`

			new Promise(function (resolve,reject){
					request.post(url).end(function (err,result){
						err ? reject(err) : resolve(result['body'])
					})
			}).then(function (result){
				res.send(result)
			}).catch(function (error){
				res.send(error)
			})
		},

		remove: function (req,res){ //--删除老师
			var uid = req.body.uid
			var tid = req.body.tid
			var idx = req.body.idx
			var url = config.path+`/admin/user_assign_teacher/teacher_uid/${tid}/uid/${uid}/idx/${idx}`

			new Promise(function (resolve,reject){
					request.post(url).end(function (err,result){
						err ? reject(err) : resolve(result['body'])
					})
			}).then(function (result){
				res.send(result)
			}).catch(function (error){
				res.send(error)
			})
		}
})

module.exports = store
