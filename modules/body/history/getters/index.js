
export default Object.create({
	getters:{
		course(state){
			return state.history.course
		},
		recordSn(state){
			return state.history.recordSn
		}
	},

	actions:{
		change_course(store,course){
			store.dispatch('HISTORY_CHANGE_COURSE',course)
		},
		change_sn(store,sn){
			store.dispatch('HISTORY_CHANGE_RECORDSN',sn)
		}
	}
})

