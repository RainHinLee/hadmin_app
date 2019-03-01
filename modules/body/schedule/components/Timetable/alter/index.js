
import store from '../../Plan/store/index.js';
import modal,{open,close} from './modal.js';

let template = __inline('./index.html');

export default Vue.extend({
		template,
		
		data(){
			let date = window.util.date.getFormatDay();
			return {
				students:[],
				teachers:[],
				course:{},
				limits:{
					0 : "Group Class",
					1 : "1-On-1 Class",
					2 : "1-On-2 Class",
					3 : "1-On-3 Class",
					4 : "1-On-4 Class",
					8 : "1-On-8 Class",
					12 : "1-On-12 Class",
					20 : "1-On-20 Class",					
				},
				
				levels:{
					1: 'General(核心课)', //核心课程
//					2: "Special(专业课)", //专业课程
					3: "Trial(试听课)", //--视听课
				},
				
				ways:{
					1:"Online(线上)",
					2:'Oncampus(学校)',
					3: 'Onsite(客户处)'
				},
				
				options:{ //--新增基本数据
					"course_date":date,
					"course_time": "08:00",
					"course_level" : "1",  // 课程类型
					"class_limit": "1",  //--上课人数
					"course_way" :"1",
					"lesson_num" : "1",
					"teacher" : "", 
					"student" : "",
				},

				status:{
					1:"schedule(排课)",
					2:"cancelled(取消)",
					3:"checked(已复核)",
					4:"confirmed(上课确认)",
					5:"apply(约课)",
					11:"recorded(已记录)",
					12:"reject(否决)"
				},	
				
				updates:{
					"course_date":"",
					"course_time": "",
					"course_level":"",
					"course_way":"",
					"class_limit":"",
					"lesson_num":"",
					"timetable_list":[],
					"timetable_state":"",
					"username_str":"",
					"teacher_uid":""
				},	
				
				submiting:false,
				type:"",
			}
		},
		
		methods:{
			close(){
				this.submiting ? window.util.notify('等待请求完成...',3) : close();
			},
			
			fetchTeachers(){  //--获取老师
				store.fetchTeachers().then(result =>{
					this.teachers = [{name:"无",uid:""}].concat(result['data'])
				})
			},
			
			submit(){ //--提交信息	
				if(this.submiting ||this.validate()){
					this.submiting = true;
					store.add(this.options).then(result=>{
						let code = result['result_code'];
						let message = result['result_msg'];
						
						this.submiting=false;
						code<0 ? window.util.notify(message,3) : this.triggerRefresh();
						
					})
				}
			},
			
			update(){  //--修改课表
				if(this.submiting ||this.validateUpdate()){
					this.submiting = true;
					store.update(this.updates).then(result=>{
						let code = result['result_code'];
						let message = result['result_msg'];
						this.submiting=false;
						code<0 ? window.util.notify(message,3) : this.triggerRefresh();
					})
				}
			},
			
			validateUpdate(){  //--校验数据
				let {course_date,course_time,lesson_num} = this.updates
				
				if(!course_date){
					window.util.notify('请填写上课日期',3)
					return false;
				};
				
				if(!course_time){
					window.util.notify('请填写上课时间',3)
					return false;
				};	
				
				if(!lesson_num || lesson_num==0){
					window.util.notify('请填写课数',3)
					return false
				};
				
				return true
			},
			
			triggerRefresh(){ //--通知数据更新
				var message = this.type == 'add' ? '添加成功，正在更新数据....': "修改成功，正在更新数据....";
				window.util.notify(message,1)
				
				window.util.trigger('schedule:timetable:refresh',()=>{
					var text = this.type == 'add' ? '添加成功,数据已更新': '修改成功,数据已更新';
					setTimeout(()=>{window.util.notify(text,1)},1000);
				});
			},
			
			validate(){  //--校验数据；
				let {course_date,course_time,teacher,student,lesson_num} = this.options
				
				if(!course_date){
					window.util.notify('请填写上课日期',3)
					return false;
				};
				
				if(!course_time){
					window.util.notify('请填写上课时间',3)
					return false;
				};

				if(!teacher){
					window.util.notify('请选择老师',3)
					return false;
				};
				
				if(!student){
					window.util.notify('请选择学生',3)
					return false;
				};
				
				if(!lesson_num || lesson_num==0){
					window.util.notify('请填写课数',3)
					return false
				}
				return true;
			},
			
			addHandler(params){
				this.type='add';
				this.options = {
					"course_date":params.date,
					"course_time": "08:00",
					"course_level" : "1",  // 课程类型
					"class_limit": "1",  //--上课人数
					"course_way" :"1",
					"lesson_num" : "1",
					"teacher" : params.teacherId, 
					"student" : "",
				};
				open();
			},
			
			modify(){
				this.updates={
					"class_limit": this.course["class_limit"],
					"course_way": this.course["course_way"],
					"lesson_num": this.course["lesson_num"],
					"timetable_sn": this.course['timetable_sn'],
					"course_date": this.course['class_datetime'].slice(0,10),
					"course_time": this.course["class_time"],
					"course_level": this.course["course_level"],
					"teacher_uid": this.course["teacher_uid"],
					"timetable_state": this.course["timetable_state"],
					"username_str":this.course['username_str'],
				};					
					
				this.type='update';		
				open();
			},
			
			viewHandler(course){
				this.course = course;
				this.type = 'view';
				open();
			},
			
			hselect_selected(student){
				let uid = student['uid'];
				this.options['student'] = uid;
			}
		},
		
		ready(){
			this.fetchTeachers();
			
			window.util.on('schedule:timetable:add',this.addHandler.bind(this));  //--添加
			window.util.on('schedule:timetable:view',this.viewHandler.bind(this)); //--查看详情
			window.util.on('schedule:timetable:view:refresh',(course)=>{ //--修改后数据更新
				let sn = this.course['timetable_sn'];
				var target = course.find(item=>{
						return sn == item['timetable_sn'];
				});
				
				if(!target){
					return
				}
				this.course = target;
				this.updates={
					"class_limit": this.course["class_limit"],
					"course_way": this.course["course_way"],
					"lesson_num": this.course["lesson_num"],
					"timetable_sn": this.course['timetable_sn'],
					"course_date": this.course['class_datetime'].slice(0,10),
					"course_time": this.course["class_time"],
					"course_level": this.course["course_level"],
					"teacher_uid": this.course["teacher_uid"],
					"timetable_state": this.course["timetable_state"],
					"username_str":this.course['username_str'],
				};					
					
				
			}); 
		},
		
		filters:{
			getLevelStr(level){
				return this.levels[level]
				
			},
			
			getWayStr(way){
				return this.ways[way]
				
			},
			
			getLimitStr(limit){
				return this.limits[limit]
			},
			
			getStatusStr(status){
				return this.status[status]
			},
		}		
});



