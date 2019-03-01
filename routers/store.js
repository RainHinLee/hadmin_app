
var calendar = require('./calendar');
var user = require('./user');
var course = require('./course');
var classroom = require('./classroom');
var student = require('./student');
var history = require('./history');
var customer = require('./customer');
var schedule = require('./schedule');
var teacher = require('./teacher');
var store = {
		calendar,
		user,
		teacher,
		course,
		classroom,
		student,
		history,
		customer,
		schedule
};

module.exports = function (req,res){
	var key = req.params.key
	var action = req.params.action;
	var handler = store[key][action];
	
	if(handler){
		handler(req,res)
	}else{
		res.status(404);
		res.send({});
	}
}





