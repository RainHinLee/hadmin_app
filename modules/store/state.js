
let state = {
		calendar:{  //---时间安排部分
			idleList:{},
			days : '',
			week : '', //--周期
			fetching: false,
			isExpired : false,
			shortcuts : []
		},

		teacher:{  //--安排老师
			students:[], //--学生元数据，选择列表使用
			teachers:[],//--老师元数据,选择列表使用
			student:{}, //---当前学生
			teacher:{}, //--当前学生
			updateTeacherList: false,  //--是否更新老师列表
			updateStudentList:false  //---是否更新学生列表
		},

		course:{  //--课程信息
			students:[],  //---选择学生列表
			student:{}, //---选择了的学生
			current : {}, //---选择了的学生的课程包
			alter : '', //---模态窗：详情 | 休学
		},

		history:{
			course:{},   //--课程列表
			recordSn : ''   //---记录课程的sn；模态窗同步到显示组件
		},

		classroom:{
			shows : [],     //---课程列表
		},

		customer:{
			price:'',
		}
}

export default state
