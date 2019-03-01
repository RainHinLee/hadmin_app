
import Calendar from '../calendar/app/index.js';
import Classroom from '../classroom/app/index.js';
import Course from '../course/app/index.js';
import Teacher from '../teacher/app/index.js';
import Student from '../student/app/index.js';
import _History from '../history/app/index.js';
import Customer from '../customer/app/index.js';
import Schedule from '../schedule/app/index.js';

//--Schedule子组件；
import Plan from '../schedule/components/Plan/app/index.js';
import Timetable from '../schedule/components/Timetable/app/index.js';
import TimetableCalc from '../schedule/components/TimetableCalc/app/index.js';

import HSelect from '../public/HSelect/index.js';
import HSelectStudents from '../public/HSelectStudents/index.js';
import router from '../../router/index.js';


Vue.component('h-select',HSelect)
Vue.component('h-select-students',HSelectStudents)


let template = __inline('./index.html')

export default Vue.extend({
		template,
		components:{
			'h-calendar' : Calendar,
			'h-classroom' : Classroom,
			'h-course' : Course,
			'h-teacher' : Teacher,
			'h-student' : Student,
			'h-history' : _History,
			'h-customer' : Customer,
			'h-schedule' : Schedule
		},
});

//--配置路由
router.map({
	'/calendar' : {
		name : 'home',
		component : Calendar,
	},

	'/classroom' :{
		name: 'classroom',
		component : Classroom,
	},

	'/student': {
		name:'student',
		component : Student,
	},	

	'/course': {
		name:'course',
		component : Course,
	},

	'/teacher': {
		name : 'teacher',
		component : Teacher,
	},

	'/history':{
		name : 'history',
		component: _History
	},

	'/customer':{
		name : 'customer',
		component: Customer
	},
	
	'/schedule' : {
		name : "schedule",
		component: Schedule,
		subRoutes:{
			"/plan" : {
				component:Plan
			} ,

			"/timetable":{
				component:Timetable
			},
			
			"/calc" : {
				component:TimetableCalc
			}
		}
	}
});


router.redirect({
	"/": "/calendar",
	"/schedule" : "/schedule/timetable"
})
