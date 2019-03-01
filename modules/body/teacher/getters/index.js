let getters = {
		students: state => state.teacher.students,
		teachers : state =>state.teacher.teachers,
		teacher : state => state.teacher.teacher,
		student : state => state.teacher.student,
		updateTeacherList: state => state.teacher.updateTeacherList,
		updateStudentList : state => state.teacher.updateStudentList
};

export default getters
