//--组件入口

import Timetable from '../timetable/index.js';
import Timepanel from '../timepanel/index.js';
import store from '../store/index.js';
let template = __inline('./index.html');
const NAME='Calendar'

let Calendar = Vue.extend({
		template,
		components: {
			'h-timetable' : Timetable,
			'h-timepanel' : Timepanel
		},

		data(){
			let isCanShowSearch = ['admin','charge','service'].includes(window.user.rightName);
			return {
				teachers:[],
				params:{
					teacher: window.user.uid,
				},
				isCanShowSearch,
			}
		},

		methods:{
			fetchTeachers(){  //--获取老师
				store.fetchTeachers().then(result =>{
					this.teachers = [{name:"无",uid:""}].concat(result['data'])
				})
			},
		},
		route:{
			canActivate(transition){
				window.user.canActivate(transition,NAME)
			}
		},
		ready(){
			this.isCanShowSearch && this.fetchTeachers();
		}
});

export default Calendar
