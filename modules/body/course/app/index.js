
import getters from '../getters/index.js';
import store from '../store/index.js';

import Show from '../show/index.js'
import Search from '../search/index.js';
let template = __inline('./index.html')

const NAME = 'Users' // --权限管理
let Course = Vue.extend({
		template,
		components:{
			'h-search' : Search,
			'h-show' : Show
		},

		methods:{
			fetch(){ //--取学生数据
				store.getStudentsAsync().then(function (result){
					let lists = result['rows'];
					this.fill_students(lists)
				}.bind(this))
			},

			notify(message,type){
				window.notie.alert(type,message,3)

			},
		},

		ready(){
			this.fetch();
		},

		route:{
			canActivate(transition){
				window.user.canActivate(transition,NAME)
			}
		},

		vuex :{
			actions :{
				fill_students(store,students){
					store.dispatch('COURSE_CHANGE_STUDENTS',students)
				},
			},

			getters
		}
})

export default Course
