
let getters = {
		student : state => state.course.student,
		students : state => state.course.students,
		current : state => state.course.current,
		alter : state => state.course.alter
}

export default getters