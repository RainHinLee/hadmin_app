
import store from '../store/index.js';
import getters from '../getters/index.js';

let template = __inline('./index.html');

let Timepanel = Vue.extend({
		template,
		props:['teacher'],
		data(){
			let times = [];
			for(var i=0;i<24;i++){
				var index = window.util.date.suffix(i)+':00'
				times.push(index)
			};
			return {times}
		},

		methods:{
			remove(item){
				let sns = [item.teacher_calender_sn]
				store.removeItemAsync(sns).then(res=>{
					this.notify('Successful!',1);
				})
				this.lists.$remove(item);
			},

			edit(item){
				item.editing = true
			},

			save(item){ //--保存
				let {isok,message} = this.validate(item);

				if(!isok){ //--校验失败
					this.notify(message,3)
					return
				};

				let options = Object.assign({},item);
				options['stime'] = this.getStime(item['stime']);
				options['etime'] = this.getEtime(item['etime']);

				if(item['isCreated']){ //--新建
					let uid= this.teacher || window.user.uid;
					store.saveItemAsync(uid,options).then(function (result){
						var lists = result['data_list'] || [];
						var sn = lists[0];
						item['sn'] = sn;
						item['isCreated'] = false;
						this.notify('Successful!',1);
					}.bind(this))
				}else{ //--修改
					let uid= this.teacher || window.user.uid;
					store.modifyItemAsync(uid,item).then(res=>{
						this.notify('Successful!',1);
					}.bind(this))
				}
				item.editing = false;
			},

			cancel(item){
				if(item['isCreated']){  //--新建
					this.lists.$remove(item);
				}else{ //--修改
					item.editing = false
				}
			},

			getStime(stime){   //---获取开始时间，由于后台接口不支持05:00-06:00  07:00-08:00之间的06:00-07:00
				let isok = this.lists.find(item=>{
					return stime == item['etime'];
				})
				let times = stime.split(':');
				return isok ? `${times[0]+":01"}` : stime
			},

			getEtime(etime){  //--获取结束时间
				let isok = this.lists.find(item=>{
						return etime == item['stime'];
				});

				let hours = etime.split(':')[0]
				if(isok){
					hours = hours-1;
					hours = hours>=10 ? hours : "0"+ hours
				}
				return isok ? `${hours+":59"}` : etime;
			},

			validate(item){  //--数据保存校验
				let {hours,minute} = window.util.date.getProps();
				let stime = item.stime.replace(':','');
				let etime = item.etime.replace(':','');

				let result={isok : true,	message : ''	};

				if(stime>=etime){ //--结束时间小于开始时间
					result['isok'] = false;
					result['message'] = `End time ${item.etime} Less than equal start time${item.stime}`
					return result
				};

				if(this.istoday && stime.slice(0,2)<=hours){  //--开始时间小于当前时间
					result['isok'] = false
					result['message'] = `Start time {item.stime} Less than current time  ${[hours,minute].join(':')}！`;
					return result
				}

				this.lists.forEach(list =>{ //--时间与其他时间冲突
					let stime1 = list.stime.replace(':','')
					let etime1 = list.etime.replace(':','')

					if(!list.isCreated && result['isok'] && item!=list){  //--新创建的
						if(!(stime>=etime1 || etime<=stime1)){
							result['isok'] = false;
							result['message'] = `Conflict with  ${list.stime}-${list.etime}`
						}
					}
				})
				return result
			},

			notify(message,type){
				window.notie.alert(type,message,4)
			},

			create(){
				let {hours,minute} = window.util.date.getProps();

				if(this.istoday && hours==22){ //--不能添加了
					//还有${120-minute}分钟${this.days}就将成为历史,
					var message = `Not enough time to allocate!`;
					return this.notify(message,3)
				}

				let suffix =  window.util.date.suffix
				let stime = this.istoday ? [suffix(Number(hours)+1),'00'].join(':') : '00:00';
				let etime = this.istoday ? [suffix(Number(hours)+2),'00'].join(':') : '23:00'

				let item = {
						"sn":"",
						"date_str":this.days,
						"stime":stime,
						"etime":etime,
						"calender_state":"1",  //---1.空闲，2占用，3排课
						"calender_stateS":"free",
						"editing" : true,
						"isExpired" : false,
						"isCreated" : true
				};

				let key = Number(this.days.slice(8));
				this.addItem(key,item)
			},
		},

		computed:{
			lists(){
				let key = Number(this.days.slice(8));
				return  this.idleList[key] || []
			},

			istoday(){
				let {year,month,day} = window.util.date.getProps();
				let suffix = window.util.date.suffix

				let now = [year,suffix(Number(month)+1),day].join('-');
				return this.days==now
			}
		},

		watch:{
			shortcuts(){  //--监控快捷属性
				let item = {
						"sn":"",
						"date_str":'',
						"stime":"00:00",
						"etime":"23:00",
						"calender_state":"1",  //---1.空闲，2占用，3排课
						"calender_stateS":"free",
						"editing" : false,
						"isExpired" : false,
						"isCreated" : false
				};

				this.shortcuts.forEach(key =>{
					let target = Object.assign({},item,{
							'date_str' : this.days.slice(0,7)+'-'+window.util.date.suffix(key)
					});
					let uid= this.teacher || window.user.uid;
					this.addItem(key,target);
					store.saveItemAsync(uid,target).then(function (result){
						var lists = result['data_list'] || [];
						var sn = lists[0];
						item['sn'] = sn;
						this.notify('Successful',1);
					}.bind(this))
				}.bind(this));
			},
		},

		vuex:{
			actions:{
				addItem(store,key,item){
					store.dispatch('CALENDAR_ADD',key,item)
				}
			},
			getters
		},

		filters:{
			getItemClassStritem(item){ //--区分线上线下过期样式
				let classname = "";

				if(this.isExpired){
					classname = 'expired'
				}
				return classname;
			},

			getRemarkClassStritem(item){ //--区分线上线下过期样式
				let {remark} = item;
				let reg = /Oncampus|Onsite/g;
				let classname = "";

				if(reg.test(remark)){
					classname+=" offline";
				}
				return classname;
			},
		}
})

export default Timepanel
