
let options = {
	'course_level' : {
		translate : '课程类型',
		values:["course_level","class_limit"],
	} ,
	'limit_timelen':{
		translate: '课程期限',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days'
		]
	},

	'extra_timelen' : {
		translate: '奖励课时',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days'
		]
	},

	'lesson_unitnum':{
		translate: '课程计划',
		values:[
			'lesson_unitnum','lesson_timeunit',
		]
	},

	'lesson_num':{
		translate: '总课时',
		values:[
			'lesson_num'
		]
	},

	'sdate':{
		translate : '开始日期',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days'
		]
	},
	'edate':{
		translate :'结束日期',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days'
		]
	},
	'left_limit_days':{
		translate: '剩余时间',  //--不可编辑
		values : []
	},
	'finish_num':{
		translate :'已上课时', //---不可编辑
		values: []
	},
	'frozen_num':{
		translate :'冻结课时', //--不可编辑
		values : [],
	},
	'rules': {
		translate : '定课规则', 
		values : ['lesson_num_day','lesson_days_week']
	},

	'usable_state':{
		translate : '课程状态',
		values:['usable_state']
	},


	'off_timelen':{
		translate : '休学期限',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days','off_timelen','off_timeunit', 
			'extra_off_timelen', 'extra_off_timeunit'
		]
	},
	
	'extra_off_timelen':{
		translate : '奖励休学',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days','off_timelen','off_timeunit', 
			'extra_off_timelen', 'extra_off_timeunit'
		]
	},

	'finish_off_days': {
		translate : '已休学',
		values:[
			'sdate','limit_timelen','limit_timeunit',
			'edate','extra_timelen','extra_timeunit',
			'finish_off_days','off_timelen','off_timeunit', 
			'extra_off_timelen', 'extra_off_timeunit'
		]
	},

	'limit': {
		translate : '剩余休学',  //--不可编辑
		values :[]
	},

	'cur_off_sdate': {
		translate : '是否休学中',  //--不可编辑
		values : []
	},
};

export default options


// studentservice@hanbridgemandarin.com