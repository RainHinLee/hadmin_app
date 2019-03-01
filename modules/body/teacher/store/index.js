
let store = Object.create({

		getStudentsAsync(){ //--获取学生列表
			var url = '_domain/store/teacher/getStudents';
			var expose = {};
			return window.util.fetch(url,expose)
		},

		getTeachersAsync(){ //---获取老师列表
			var url = '_domain/store/teacher/getTeachers';
			var expose =  {};
			return window.util.fetch(url,expose)
		},

		getStudentById(uid){  //--单个学生的信息
			var url = '_domain/store/teacher/getStudent';
			var expose = {uid};
			return window.util.fetch(url,expose)
		},

		getTeacherById(uid){ //---单个老师的信息
			var url = '_domain/store/teacher/getTeacher';
			var expose = {uid};
			return window.util.fetch(url,expose)
		},

		addAsync(uid,tid,idx){  //--添加老师,学生id,老师id
			var url = '_domain/store/teacher/add';
			var expose = {uid,tid,idx};
			return window.util.fetch(url,expose)
		},

		removeAsync(uid,tid){ //--移除老师,学生id,老师id
			var url = '_domain/store/teacher/remove';
			var idx = '-1';
			var expose = {uid,tid,idx};
			return window.util.fetch(url,expose)			
		},

});

export default store









