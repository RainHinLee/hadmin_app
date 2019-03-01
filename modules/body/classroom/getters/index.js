
export default Object.create({

	getters:{
		shows: state => state.classroom.shows
	},

	actions:{
		dispactherShows(store,shows){
			store.dispatch('CLASSROOM_DISPATCHER_SHOWS',shows)
		}
	},
})