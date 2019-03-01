
import store from '../store/index.js';
import Search from '../search/index.js';
import Show from '../show/index.js';
import Alter from '../alter/index.js';


let template = __inline('./index.html')
const NAME = 'Teachers';

let Teacher = Vue.extend({
		template,

		components:{
			'h-search' : Search,
			'h-show' : Show,
		},

		methods:{
			fetch_students(){ //--取学生数据
				store.getStudentsAsync().then(function (result){
					let lists = result['data_list'];
					this.fill_students(lists)
				}.bind(this))
			},

			fetch_teachers(){ //--取老师数据
				store.getTeachersAsync().then(function (result){
					let lists = result['data'];
					this.fill_teachers(lists)
				}.bind(this))				
			},
		},

		ready(){
			this.fetch_students();
			this.fetch_teachers();
		},


		route:{
			canActivate(transition){
				window.user.canActivate(transition,NAME)
			}
		},
		
		vuex:{
			actions:{
				fill_students(store,students){
					store.dispatch('TEACHER_CHANGE_STUDENTS',students)
				},

				fill_teachers(store,teachers){
					store.dispatch('TEACHER_CHANGE_TEACHERS',teachers)
				}
			},
		}
})

export default Teacher
