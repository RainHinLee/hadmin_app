import store from '../store/index.js';
import store1 from '../../Plan/store/index.js'
let template = __inline('./index.html');

let COUNT = 1;
let DATA = [];

export default Vue.extend({
	template,
	data(){
		let calendar = window.util.date.getCalendarDays();
		let {year,month,day} = window.util.date.getProps();
		
		return {
			weeks:['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
			types:{
				1: "学校课表",
				2: "老师课表",
				3: "学生课表"
			},
			courses:{},
			shows:[],
			
			teachers:[],
			student:{},
			calendar,
			current:{year,month,day},
			
			params:{
				teacherId: "",
				studentId: "",
				showCancel: "0"
			},
			
			fetching:false,
		}
	},
	
	methods:{
		next(){ //---下一个月
			let {year,month,day} = this.current
			
			if(month>=11){
				month=0;
				year+=1;
			}else{
				month++
			}
			this.current = {year,month,day:"1"};
		},

		prev(){ //---上一个月
			let {year,month} = this.current
			if(month==0){
				month=11;
				year-=1;
			}else{
				month--
			}
			this.current = {year,month,day:'1'};
		},
		
		initCadenlarClickDay(){  //--默认第一个激活的日期,未来时间返回01,当前月返回当天
			let props = window.util.date.getProps();
			let {year,month,day} = this.current;

			let origin = props.year+''+window.util.date.suffix(props.month)
			let target = year +''+window.util.date.suffix(month);

			let diff = target - origin;
			

			if(diff==0){ //--当前月
				day = day>1 ? day : props.day;
			};
		
			let ev = {
					currentTarget: this.getCadenlarItemByDay(day)
			};
			
			this.click(ev);	
		},		

		getCadenlarItemByDay(day){  //--日期获取元素
			let items = document.querySelectorAll('.schedule.timetableBox .calendar table td');

			let results = Array.from(items).filter( item =>{
					return Number(item.dataset.index) == Number(day);
			})
			return results[0]
		},
		
		fetchTimetable(){  //--获取学校课程
			let {year,month} = this.current;
			let {type,teacherId,studentId} = this.params;
				
			let baseText = `${year}${window.util.date.suffix(Number(month)+1)}`;
			let sdate = baseText+"01";
			let edate = baseText+window.util.date.getSize(year,month);
			
			let count = ++COUNT;
			let promise = null;
			let params = {sdate,edate,count};
			
			this.fetching = true;

			return store.fetchTimetableSchool(params).then(result=>{
				let {result_code,result_msg,count} = result;
				if(count==COUNT && year== this.current.year && month==this.current.month){  //--匹配请求
					if(result_code>=0){
						DATA = result['timetable_list'] || [];
						this.filterCoursesShow();
						this.initCadenlarClickDay();
					}else{
						window.util.notify(result_msg,3)
					}
				};
				this.fetching = false
			})
		},
		
		fetchTeachers(){  //--获取老师
			store1.fetchTeachers().then(result =>{
				this.teachers = [{name:"请选择老师",uid:""}].concat(result['data'])
			})
		},
		
		click(ev){
			let {year,month} = this.current;
			let el = ev.currentTarget
			let items = document.querySelectorAll('.schedule.timetableBox .calendar table td');
			let day = el.dataset.index;

			if(day==0){
				return window.util.notify('Time is not optional',3);
			}

			Array.from(items).forEach(item=>item.classList.remove('active'));	
			el && el.classList.add('active');
			
			this.shows = this.courses[day] || [];
			this.current['day'] = day;
		},
		
		change(){  //--变动
			let {year,month} = this.current;
			this.calendar = window.util.date.getCalendarDays(year,month);

			this.reset();
			return this.fetchTimetable();
		},
		
		view(item){
			window.util.trigger('schedule:timetable:view',item);
		},
		
		add(){ //--增加
			let params = {
					date : this.getCurrentDayStr(),
					teacherId: this.params.teacherId,
			};
			
			window.util.trigger('schedule:timetable:add',params);
		},	
		
		getCurrentDayStr(){
			let suffix = window.util.date.suffix;
			let {year,month,day} = this.current;	
			return `${year}-${suffix(Number(month)+1)}-${suffix(day)}`;
		},

		reset(){
			DATA = [];
			this.shows = [];
			this.courses = {};
		},
		
		filterCoursesShow(){   //--过滤显示
			this.courses=[];
			this.shows=[];
			DATA.forEach(item=>{
				let day = Number(item['class_datetime'].slice(8,10)).toString();
				let {teacher_uid,book_list} = item;
				let {studentId,teacherId,showCancel} = this.params;
				if(!this.courses[day]){
					let key = `courses[${day}]`;
					this.$set(key,[]);					
				};
				
				if(showCancel=="0" && item.timetable_state=="2"){
					return
				};
				
				if(teacherId && teacher_uid != teacherId){
					return
				}
				
				if(studentId){
					let isInclude =  (book_list || []).filter(item1=>{
							return item1['uid'] == studentId;
					});
					
					if(!isInclude.length){
						return
					}
				}				
				this.courses[day].push(item)
			});			
		},
	
		hselect_selected(student){  //--选择学生后；
			let uid = student ? student['uid']  : "";
			this.params.studentId = uid;
			this.student = student;
		}
		
	},
	
	filters:{

		getDayStr(type){
			let day = this.getCurrentDayStr();
			return  day
		},
		
		getMonthStr(){
			let day = this.getCurrentDayStr();
			return day.slice(0,7) 			
		},
		
		getItemstate(value){  //---状态
			let props = window.util.date.getProps();
			let {year,month} = this.current;

			let origin = props.year+''+window.util.date.suffix(props.month)
			let target = year +''+window.util.date.suffix(month);

			let result= '';

			if(target==origin){
				Number(value)==props.day && (result='now')
				value<props.day && (result='disable');
			};

			if(value==0 || target<origin){
				result='disable'
			};
			return result
		},
		
		getClassStr(item){
			return ["2","3"].includes(item['course_way']) ? "offline" : "";
		}
	},
	
	watch:{
		current(){
			this.change();
		},

		"params":{
			deep:true,
			handler(){
				this.filterCoursesShow();
				this.initCadenlarClickDay();
			}
		},	
	},
	
	ready(){
		this.change();
		this.fetchTeachers();
		
		window.util.on('schedule:timetable:refresh',()=>{
			this.change().then(()=>{
				let {day} = this.current;
				this.courses[day] && window.util.trigger('schedule:timetable:view:refresh',this.courses[day]); //--更新弹窗数据
			})
		});
	}

	
})
