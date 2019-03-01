
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config')

//--获取老师的时间
function getTimes(req,res){
	
	var start = req.body.start;
	var end = req.body.end;
	var uid =  req.body.uid;
	
	var url = config.path+`/admin/tcalender_list/uid/${uid}/sdate/${start}`;

	url= end ? (url +`/edate/${end}`) : url;

	request.get(url).end(function (err,result){
		err ? res.send(err) : res.send(result.body)
	})
}

//--删除时间
function removeTimes(req,res){
	var sns = req.body.sns;
	var url = config.path+`/basic/multidel/table/lw_teacher_calender/id_field/teacher_calender_sn`;

	request.post(url).send(sns).end(function (err,result){
		err ? res.send(err) : res.send(result.body)
	})
}

//---保存时间
function saveTimes(req,res){
	var body = req.body.data;
	var uid = req.body.uid;
	var item = {
			"date_str" : body['date_str'],//.replace(/-/g,''),
			"date_unit" : "1",
			"stime" : body['stime'],
			"etime" : body['etime'],
			"calender_state" : body['calender_state'],
			"remark": body['remark'],
			"sdate" : '',
			"edate" : ''
	}

	var url = config.path+`/admin/tcalender/uid/${uid}`;
	var expose = [item];
	
	request.post(url).send(expose).end(function (err,result){
		err ? res.send(err) : res.send(result.body)
	})
};

//--更改时间
function modifyTimes(req,res){
	var body = req.body.data;
	var uid = req.body.uid;
	var item = {
			"sn" : body['sn'],
			"date_str" : body['date_str'],//.replace(/-/g,''),
			"date_unit" : "1",
			"stime" : body['stime'],
			"etime" : body['etime'],
			"calender_state" :body['calender_state'],
			"remark": body['remark'],
			"sdate" : '',
			"edate" : ''
	}

	var url = config.path+`/admin/tcalender/uid/${uid}`;
	var expose = [item];
	
	request.post(url).send(expose).end(function (err,result){
		err ? res.send(err) : res.send(result.body)
	})

}

module.exports = {getTimes,removeTimes,saveTimes,modifyTimes}


