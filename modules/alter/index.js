
import Teacher from '../body/teacher/alter/index.js';
import Course from '../body/course/alter/index.js';
import _History from '../body/history/alter/index.js';
import Classroom from '../body/classroom/alter/index.js';
import Customer from '../body/customer/alter/index.js';
import SchedulePlan from '../body/schedule/components/Plan/alter/index.js';
import ScheduleTimetable from '../body/schedule/components/Timetable/alter/index.js';

let template = __inline('./index.html');
let paths = ['teacher','course','history','classroom','customer','schedule/plan',"schedule/timetable"]; 



export default Vue.extend({
	template,
	components:{
		'teacher' : Teacher,
		'course' : Course,
		'history' : _History,
		'classroom' : Classroom,
		'customer' : Customer,
		'schedule/plan' : SchedulePlan,
		"schedule/timetable": ScheduleTimetable,
	},

	computed:{
		view(){
			let path = this.$route.path.slice(1);
			return paths.indexOf(path)>=0 ? path : '';
		}
	},
})
