
export default Object.create({
	getList(uid){
		var url = '_domain/store/teacher/getTeacher';
		var expose = {uid};
		return window.util.fetch(url,expose)
	},

	findStudentByName(username){
		let url = '_domain/store/student/findStudentByName';
		let expose = {username}
		return window.util.fetch(url,expose)
	}
})


