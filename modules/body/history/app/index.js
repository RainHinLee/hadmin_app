
import store from '../store/index.js';
import modal ,{open,close} from '../alter/modal.js';
import {getters,actions} from '../getters/index.js'

let template = __inline('./index.html');
const NAME= 'Courses'

export default Vue.extend({
	template,
	data(){
		let {year,month,day} = window.util.date.getProps();
		let end = window.util.date.getDayOfSize(year,month,day,7);
		let start = window.util.date.getDayOfSize(year,month,day,-1);

		let sdate = start.formatDay;
		let edate = end.formatDay;

		let uid = '';

		return {
			search:{uid,sdate,edate}, //--查找条件
			lists:[], //--数据列表
			fetching: false, //--ajax请求
			students:[], //---学生列表
		}
	},

	methods:{
		ajax(){ //---ajax
			let options = Object.assign(this.search)
			options['tid'] = window.user.uid;
			return store.fetch(options);
		},

		fetch(){ //--获取记录列表
			this.fetching = true;
			this.ajax().then(result=>{
				let lists = result['lists'] || [];

				this.lists = lists.reverse();
				this.fetching = false;
			});
		},

		pullStduents(){  //--获取学生列表
			store.pullStduents().then(result => {
				this.students = result['data_list'];
			})
		},

		record(item){   //---记录课程，弹出模态框
			this.change_course(item);
			open()
		},

		refresh(){ //---模态框记录成功后，重新获取数据；
			this.ajax().then(result=>{
				let lists = result['lists'] || []
				this.lists = lists.reverse();
				
				return lists.filter(item =>{
					return item['timetable_sn'] == this.recordSn;
				})
			}).then(result =>{
				let course = result[0] || {};
				this.change_course(course);
			})
		},

		notify(message,type){  //---通知函数
			window.notie.alert(type,message,3)
		},
		
		isStart(date){  //---是否已开课
			let reg = /\s|-|:/g;
			let time = date.replace(reg,'')-100000000;  //---开课时间,减掉1个月,再减一个小时

			let nowDate = window.util.date.getSpread();
			let nowTime = nowDate.slice(0,6).join('');

			return nowTime > time
		},
		
		isEnd(date){  //--课程是否结束
			let reg = /\s|-|:/g;
			let time = date.replace(reg,'')-100000000+10000;  //---开课时间,减掉1个月,再加上一个小时

			let nowDate = window.util.date.getSpread();
			let nowTime = nowDate.slice(0,6).join('');
			return nowTime > time			
		},
		
		isStarting(date){  //--正在上课
			return this.isStart(date) && !this.isEnd(date)
			
		},
		
			//---1排课,2取消,3已复核,4上课确认,5约课,6,7,8,9,10,11已记录,1否决
		isActionType(item){  //---状态是否可修改,排课和已记录返回true
			let state = item['timetable_state'];
			let isok = (state=='1' || state=='11');
			return isok 
		},		

	},

	watch:{
		search:{
			handler(){
				let sdate = this.search.sdate.replace(/-/g,'')
				let edate = this.search.edate.replace(/-/g,'');

				if(edate && edate<sdate){
					return this.notify('End date less than start date',3)
				}
				this.fetch();
			},
			deep:true
		},

		recordSn(){
			this.recordSn && this.refresh();
		}
	},

	filters:{

		f_transform(state){ //--翻译数据,1,2,3,4,5,11,12
			let transforms = ['排课','取消','已复核','已确认','约课','已记录','已否决'];
			let text = transforms[state-1]

			if(state==11 || state==12){
				text = transforms[state-6];
			}
	
			return text
		},

		f_isEnd(item){  //--课程是否结束
			let time = item.class_datetime
			return this.isEnd(time);
		},
		
		f_isActionType(item){ //--可以设置
			return this.isActionType(item)
		},
		
		f_isStarting(item){ //---正在开始上课
			let date = item['class_datetime'];
			return this.isStarting(date)
		},
		
		f_getStyles(item){  //--获取样式，able,disable,success
			let date = item['class_datetime'];
			let classname = 'able';
			
			if(!this.isStart(date)){ //--未开课
				classname = 'disable'	
			}else if(this.isStarting(date)){ //--正在进行
				classname = 'success'
			}else if(this.isEnd(date) && !this.isActionType(item)){ //--结束了,并且为不可更改状态
				classname = 'disable'
			}
			return classname
		}

	},

	ready(){
		this.pullStduents();
		this.fetch();
	},

	route:{
		canActivate(transition){
			window.user.canActivate(transition,NAME)
		}
	},

	vuex:{
		getters,
		actions
	}
})

