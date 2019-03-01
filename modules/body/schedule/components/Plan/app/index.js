import store from '../store/index.js';
let template = __inline('./index.html');

let DATA=[];

export default Vue.extend({
	template,
	data(){
		let sdate = window.util.date.getFormatDay();
		let edate =  window.util.date.getFormatDay(window.util.date.getDayByOffset(new Date(),6).source);
			
		return {
			teachers:[],
			students:[],

			records: [],
			companys:[],
			levels:{
				0:"不限",
				1: 'General(核心课)', //核心课程
//				2: "Special(专业课)", //专业课程
				3: "Trial(试听课)", //--视听课
			},
			
			ways:{
				0:"不限",
				1:"Online(线上)",
				2:'Oncampus(学校)',
				3: 'Onsite(客户处)'
			},
			
			status:{
				0:"不限",
				1:"schedule(排课)",
				2:"cancelled(取消)",
				3:"checked(已复核)",
				4:"confirmed(上课确认)",
				5:"apply(约课)",
				11:"recorded(已记录)",
				12:"reject(否决)"
			},			
			
			options:{
				sdate,
				edate,
				student:"",
				teacher:'',
				company:"",
				status:"0",
				way : "0", //--上课地点
				level: "0", //--上课方式
				showCancel:"0",
			},
			
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
			
			fetched:false,
		}
	},
	
	methods:{
		fetch(){
			this.fetchRecords();
			this.fetchTeachers();
			this.fetchStudents();
			this.fetchCompanys();
		},
		
		fetchRecords(){  //--获取记录列表
			let {sdate,edate} = this.options;
			let reg = /-/g;
			sdate = sdate.replace(reg,"");
			edate = edate.replace(reg,"");
			
			if(this.validate()){
				this.fetched = true;
				
				store.fetchRecords({sdate,edate}).then(result=>{
					this.fetched = false;
					DATA= result['timetable_list'].map(item=>{
							item['editing'] = false;
							return item
					})
				
					this.change();
				})
			}
		},
		
		fetchTeachers(){  //--获取老师
			store.fetchTeachers().then(result =>{
				this.teachers = [{name:"无",uid:""}].concat(result['data'])
			})
		},
		
		fetchStudents(){ //--获取学生
			store.fetchStudents().then(result =>{
				this.students = [{name:"无",uid:""}].concat(result['data_list'])
			})			
		},	
		
		fetchCompanys(){ //---获取公司
			store.fetchCompanys().then(result=>{
				this.companys =(
					[{organ_id:"",organ_name:"无"}]
						.concat(result['result_array'])
						.sort((a,b)=>{
							return a.organ_id.localeCompare(b.organ_id)
						})
				)
			})
		},
		
		change(){ //--过滤数据
			let {teacher,student,company,status,way,level,showCancel} = this.options;
			
			var arr = DATA.filter(item=>{ //--老师
					return teacher ? teacher == item.teacher_uid : true
			}).filter(item => { //--学生
				var user = item.book_list ? (item.book_list[0] || {}) : {};
				return student ? student == user.uid : true
			}).filter(item => { //--公司
					return company ? company == item.book_list[0].organ_id : true
			}).filter(item =>{ //--状态
				return status==0 || status == item['timetable_state']
			}).filter(item=>{ //--地点
				return way==0 || way == item['course_way'];
			}).filter(item=>{ //--类型
				return level==0 || level == item['course_level'];
			}).filter(item=>{ //--是否显示取消课表	
				if(showCancel==1 || status==2){
					return true
				};
				return item['timetable_state'] !=2;
			})
			
			this.records = arr;
		},
		
		modify(item){ //--修改	
			window.util.trigger('schedule:plan:update',item);
		},
		
		add(){ //--增加
			window.util.trigger('schedule:plan:add');
		},
		
		validate(){
			let {sdate,edate} = this.options;
			let regx = /-|\s/g;
			
			if(sdate.replace(regx)>edate.replace(regx)){
				window.util.notify('开始时间大于结束时间',3);
				return false
			}	
			return true;
		},
		
		hselect_selected(student){
			this.options.student = student['uid'];
		},
		
	},
	
	watch:{
		"options.teacher": function(){ this.change.call(this,arguments)},
		"options.student": function(){ this.change.call(this,arguments)},
		"options.company": function(){ this.change.call(this,arguments)},
		"options.status": function(){ this.change.call(this,arguments)},
		"options.way": function(){ this.change.call(this,arguments)},
		"options.level": function(){ this.change.call(this,arguments)},
		"options.showCancel": function(){ this.change.call(this,arguments)},
		"options.sdate": function(){
			this.fetchRecords.call(this,arguments);
		},
		"options.edate": function(){
			this.fetchRecords.call(this,arguments)
		},
	},
	
	ready(){
		this.fetch();
		window.util.on('schedule:plan:refresh',this.fetchRecords.bind(this));
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
})
