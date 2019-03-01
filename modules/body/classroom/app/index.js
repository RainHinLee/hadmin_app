
import store from '../store/index.js';
import modal,{open,close} from '../alter/modal.js';
import {getters,actions} from '../getters/index.js'

let template = __inline('./index.html');
const timers = {};
const NAME='Classroom';

export default Vue.extend({
	template,
	data(){
		return {
			fetching:false,
			course:[],      //---进入教室的，课程列表
			rooms:{ //---教室信息
				fetched : false,
				refreshing : false,
			}        
		}
	},

	methods:{
		open,
		fetchAjax(){  //---教师情况
			let teacherId = window.user.uid;
			return store.fetch(teacherId).then(result => {
				let list = result['data_list'] || [];
				//console.log("course",result)
				list.forEach(item => {
					item.requesting = false;
					item.server_id = "zoom";  //---平台，另一个为USA:webex
					
					if(item['classroom_id']){   //---有教室
						this.timeout(item)
					}
				});
				this.course = list
				this.fetching = false;
				return list
			})			
		},

		fetch(){  //--课程列表
			this.fetching = true
			this.fetchAjax()
		},

		getList(){ //---教室使用情况
			let serverId = 'USA';
			this.rooms.refreshing = true;
			store.getList(serverId).then(result => {
				let totals = result['total'];
				let lists = result['data_list'] || [];
				this.rooms =  Object.assign({},totals,{fetched : true,refreshing:false});
				
				let  ret = lists.filter(item =>{
						return !!item['room_id'];
				})
				this.dispactherShows(ret);
			});
		},

		request(item){  //---申请教室
			let sn = item['timetable_sn'];
			let timer = timers[sn] ;  //---时间定时器句柄
			let serverId = item['server_id']
			
			console.log(serverId,sn)
			//return

			if(item.requesting){  //---还在请求中，终止程序
				return 
			}

			timer && clearTimeout(timer);
			item.requesting = true;
			store.request(sn,serverId).then(function(result){
				let code = result['result_code']
				let message = result['result_msg'] || 'Failure, please reapply';

				if(code>=0){
					let expose = {
							classroom_id: result['classroom_id'],
							teacher_url: result['teacher_url'],
							meeting_status : 'NOT_INPROGRESS',
							room_id : result['room_id'],
							requesting: false,  //---是否请求中
					};

					Object.assign(item,expose);
					this.getList(); //---获取新的webex教室状态
					this.timeout(item);  //--两分钟时禁用
					this.notify('Success!',1);
				}else{
					item['requesting'] = false;
					this.notify(message,3);
				};
			}.bind(this));
		},

		notify(message,type){
			window.notie.alert(type,message,4);
		},

		timeout(item){   //--失效
			let sn = item['timetable_sn']
			let options = {
					classroom_id: '',
					teacher_url: '',
					meeting_status : '',
					room_id : ''
			};

			if(item.meeting_status=='INPROGRESS'){ //---已进入教室，链接不需要失效
				return
			}

			let timer = setTimeout(function (){ //----两分钟链接失效
					Object.assign(item,options);
					Vue.set(item,'losed',true)
			},120000);

			timers[sn] = timer
		}

	},

	route:{
		canActivate(transition){
			window.user.canActivate(transition,NAME)
		}
	},

	ready(){
		this.fetch();
		this.getList();
	},

	destroyed(){
		clearInterval(this.timer);
		this.timer = null;
	},

	vuex:{
		getters,
		actions
	}
})
