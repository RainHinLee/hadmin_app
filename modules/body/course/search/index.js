
import getters from '../getters/index.js';

let template = __inline('./index.html');

export default Vue.extend({
	template,
	data(){
		return {
			studentId: ''
		}
	},
	
	watch:{
		studentId(){
			let uid = this.studentId;
			if(uid){
				let target = this.students.find(item => item.uid == uid )
				this.change_student(target);
			}
		}
	},

	ready(){
		this.change_student({});
	},

	vuex:{
		actions:{
			change_student(store,student){
				store.dispatch('COURSE_CHANGE_STUDENT',student)
			}
		},

		getters
	}
})
