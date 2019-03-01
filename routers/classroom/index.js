
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config')

module.exports = Object.create({
	fetch(req,res){  //--老师的进入教室课程列表
		var teacherId= req.body.teacherId;
		var url = config.path + `/timetable/teacher_timetable/teacher_uid/${teacherId}/num/4`;
		request.get(url).end(function (err,result){
			err ? res.send(err) : res.send(result.body)
		})		
	},

	getList:function (req,res){  //--获取教室列表
		var serverId= req.body.serverId;
		var url = config.path + `/timetable/webex_meeting?server_id=${serverId}`;

		request.get(url).end(function (err,result){
			err ? res.send(err) : res.send(result.body)
		})
	},

	request:function (req,res){  //--申请新的教室
		var sn = req.body.sn;
		var serverId = req.body.serverId
		var url = config.path + `/timetable/classroom_new/timetable_sn/${sn}/server_id/${serverId}`

		request.get(url).end(function (err,result){
			err ? res.send(err) : res.send(result.body)
		})
	}
})

