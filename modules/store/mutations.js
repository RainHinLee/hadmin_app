
let mutations = {
		//--时间管理mutations
		CALENDAR_ADD(state,key,item){ //--添加忙碌列表项
			let lists = state.calendar.idleList;

			if(!lists[key]){
				Vue.set(lists,key,[])
			}
			lists[key].push(item)
		},

		CALENDAR_FILL(state,idleList={}){  //---填充项
			state.calendar.idleList = idleList;
		},

		CALENDAR_CHANGE_DAYS(state,days){ //---当前日期
			state.calendar.days = days;
		},

		CALENDAR_CHANGE_WEEK(state,week){ //--星期
			state.calendar.week = week;
		},

		CALENDAR_CHANGE_ISEXPIRED(state,isExpired){  //--是否过期
			state.calendar.isExpired = isExpired
		},

		CALENDAR_CHANGE_SHORTCUTS(state,shortcuts){ //--休假日期
			state.calendar.shortcuts = shortcuts;
		},

		CALENDAR_CHANGE_FETCHING(state,fetching){ //--是否请求中
			state.calendar.fetching = fetching;
		},
		//--安排老师
		TEACHER_CHANGE_STUDENTS(state,students){
			state.teacher.students=students
		},
		TEACHER_CHANGE_TEACHERS(state,teachers){
			state.teacher.teachers=teachers
		},

		TEACHER_CHANGE_STUDENT(state,student){
			state.teacher.student=student
		},

		TEACHER_CHANGE_TEACHER(state,teacher){
			state.teacher.teacher = teacher;
		},

		TEACHER_CHANGE_UPDATETEACHERLIST(state,bool){
			state.teacher.updateTeacherList = bool
		},

		TEACHER_CHANGE_UPDATESTUDENTLIST(state,bool){
			state.teacher.updateStudentList = bool
		},

		//---course模块
		COURSE_CHANGE_STUDENTS(state,students){
			state.course.students = students;
		},

		COURSE_CHANGE_STUDENT(state,student){
			state.course.student = student
		},

		COURSE_CHANGE_CURRENT(state,item){
			state.course.current = item
		},

		COURSE_CHANGE_ALTER(state,alter){
			state.course.alter = alter
		},

		//---课程记录
		HISTORY_CHANGE_COURSE(state,course){
			state.history.course = course
		},

		HISTORY_CHANGE_RECORDSN(state,sn){ //--记录学生的timetable-sn
			state.history.recordSn = sn
		},

		//---进入教室
		CLASSROOM_DISPATCHER_SHOWS(state,shows){
			state.classroom.shows = shows;
		},

		//---生成订单
		CUSTOMER_CHANGE_PRICE(state,price){
			state.customer.price = price;

		}

}


export default mutations
