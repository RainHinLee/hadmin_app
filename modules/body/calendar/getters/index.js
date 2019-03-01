
let getters = {
		idleList: state => state.calendar.idleList,
		days : state =>state.calendar.days,
		week : state => state.calendar.week,
		isExpired: state => state.calendar.isExpired,
		shortcuts : state => state.calendar.shortcuts,
		fetching: state=>state.calendar.fetching
}

export default getters
