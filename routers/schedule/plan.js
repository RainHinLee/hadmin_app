var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var querystring = require('querystring');

module.exports = {
	fetchPlanRecords(req,res){
		var options = req.body.options;
		var url = `${config.path}/timetable/list/school/opuid/1/opright/3/sdate/${options.sdate}/edate/${options.edate}`

		new Promise(function (resolve,reject){
				request.get(url).end((err,result)=>{
					err ? reject(err) : resolve(result.body)
				})
		}).then(result=>{
			res.send(result)
		}).catch(err=>{
			res.send({
				result_code: -1,
				result_msg: err.message
			})
		});
	},
	
	fetchPlanCompanys(req,res){  //--获取公司
		var url = `${config.path}/basic/get`;
		var options ={
				"where":" fn_opright_organ(1, 3, organ_id)=1",
				"select":"organ_id,organ_name",
				"from":"lw_organization"
		};
		
		new Promise(function (resolve,reject){
				request.post(url).send(options).end((err,result)=>{
					err ? reject(err) : resolve(result.body)
				})
		}).then(result=>{
			res.send(result)
		}).catch(err=>{
			res.send({
				result_code: -1,
				result_msg: err.message
			})
		})
	},
	
	addPlanRecord(req,res){ //新增课表
		var data = req.body;
		var url = `${config.path}/timetable/new/webdr/1`;
		var lesson_num = data['lesson_num']
		var course_way = data['course_way'];
		var class_timelen = 50;
		var user = req.user;
		
		if(["2","3"].indexOf(course_way)>=0){
			class_timelen = lesson_num * 60;
			//lesson_num = 1;
		}
		
		var options = {
				course_id: 'Mandarin Chinese',
				course_level:data.course_level,
				course_way:course_way,
				course_type:2,
				class_limit: data.class_limit,
				teacher_uid: data["teacher"],
				user_list: 
					[
						{ 
							charge_type: 1, 
							uid: data.student, 
							user_contact: '' 
						}
					],
				time_list:
				   	[ 
				   		{ 
				   			date: data["course_date"].replace(/-/g,''),
						    teacher_uid: data["teacher"],
						    time: data['course_time'],
						    class_timelen: class_timelen,
						    lesson_num: lesson_num,
						    num:"1",
						    uid: data.student,
						    tel: '' 
				   		} 
				   	]
		};
		
		console.log(options)
		
		new Promise(function(resolve,reject){
				request.post(url).send(options).end(function (err,result){
					err ? reject(err): resolve(result.body); 
				});				
		}).then(result=>{
			res.send(result);
		}).catch(err=>{
			res.send({
				result_code : -1,
				result_msg: err.message
			})
		});
	},
	
	updatePlanRecord(req,res){  //--更新课表
		var url = `${config.path}/timetable/mupdate/webdr/1`;
		var data = req.body
		
		var lesson_num = data['lesson_num']
		var course_way = data['course_way'];
		var class_timelen = 50;
		
		if(["2","3"].indexOf(course_way)>=0){
			class_timelen = lesson_num * 60;
		}		
		
		var options = {
				class_timelen: class_timelen,
				class_limit: data['class_limit'],
				course_way: data['course_way'],
				course_type: "2",
				lesson_num: lesson_num,
				timetable_sn:data["timetable_sn"],
				teacher_uid: data['teacher_uid'],
				class_datetime:`${data.course_date} ${data.course_time}`,
				course_level: data['course_level'],
				timetable_state: data['timetable_state']
		};
		
		var params = {
				timetable_list: [].concat(data['timetable_sn']),
		};
		
		url += `/${querystring.stringify(options,'/','/')}`;

		new Promise(function(resolve,reject){
				request.post(url).send(params).end(function (err,result){
					err ? reject(err): resolve(result.body) 
				});				
		}).then(result=>{
			res.send(result)
		}).catch(err=>{
			res.send({
				result_code : -1,
				result_msg: err.message
			})
		})		
	}
}


/*

 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * */