
import store from '../store/index.js';
import getters from '../getters/index.js';
import modal,{open,close} from '../alter/modal.js';

let template = __inline('./index.html');

export default Vue.extend({
	template,
	data(){
		let date = window.util.date
		let now = date.getProps(); 
		let sdate = date.getDayOfSize(now.year,now.month,now.day,1);

		return {
			lists : [],
			cache:{
				sdate : date.getFormatDay(sdate.source),
				edate : '',
				size : '0',
			},
			fetching: true,
			adding: false
		}
	},

	methods:{
		close,

		fetch(){  //---获取用户休学列表
			let sn = this.current['product_user_sn'];
			this.fetching = true;
			store.getOffLists(sn).then(function(result){
				let lists = result['rows'];
				let arr = [];

				lists.filter(item =>{
					let sdate = item['off_sdate'];
					return sdate.replace(/-/g,'')>0 && Number(item['cur_off_days'])>0;
				}).forEach(item=>{
					let sdate = item['off_sdate'];
					let days = item['cur_off_days'].split('.')[0];
					let edate =  this.computeEdate(sdate,days);

					item['cur_off_edate'] = edate; //--休学结束日期
					item['cur_off_state'] = this.computeState(sdate,edate); //--休学开始日期
					item['stopping'] = false; //--正在停止
					item['removing'] = false; //--正在删除
					arr.push(item)	

				});

				arr.sort(this.sortHandler)

				this.lists = arr
				this.fetching = false
			}.bind(this))
		},

		addItem(body,action=1){ //action 1为增加，2为修改
			let sn = this.current['product_user_sn'];
			return store.addOffItem(sn,body,action).then(function (result){
				return this.fetchCurrent();
			}.bind(this))
		},

		add(){ //--添加休学;
			let isok = this.validate();
			let username = this.current['username'];
			let body = this.create();
			if(isok){
				this.adding = true;
				this.addItem(body,1).then(()=>{
					this.adding = false;
					this.notify(`${this.current.username}申请休学成功!`,1);
				})
			}
		},

		stop(item){   //--停止休学
			let body = this.create();
			let nowDate = new Date();
			let sdate = window.util.date.setDate(item['off_sdate']);
			let diff = window.util.date.getDiffByDate(sdate,nowDate);

			body['cur_off_days'] = diff;
			body['finish_off_days'] = Number(this.current['finish_off_days'])-Number(this.current['cur_off_days'])+Number(diff)

			item['stopping'] = true
			this.addItem(body,2)
		},

		remove(item){  //删除休学
			let body = this.create();
			body['cur_off_days'] = 0;
			// body['cur_off_sdate'] = '0000-00-00';
			body['finish_off_days'] = Number(this.current['finish_off_days'])-Number(this.current['cur_off_days'])

			item['removing'] = true
			this.addItem(body,2)
		},

		fetchCurrent(){  //---改变当前学习信息对象;
			let username = this.student.username;
			let sn = this.current['product_user_sn']

			store.getCourseByUserName(username).then(function (result){
				let lists = result['rows'];
				let target = lists.filter(function (item){
						return item['product_user_sn'] == sn
				});
				this.change_current(target[0]);			
			}.bind(this))			
		},

		sortHandler(a,b){  //--根据结束时间排序;
			return b.cur_off_edate.replace(/-/g,'') - a.cur_off_edate.replace(/-/g,'')
		},

		create(){
			var oldsize = Number(this.current['finish_off_days']); //---已完成休学
			var newsize = Number(this.cache['size']); //--新休学天数
			var finishsize = oldsize+newsize; //--新完成休学天数;
			return {
				"lesson_days_week": this.current['lesson_days_week'],
			 	"sdate": this.current['sdate'], 
			 	"limit_timelen": this.current['limit_timelen'], 
			 	"limit_timeunit":this.current['limit_timeunit'], 
			 	"extra_timelen": this.current['extra_timelen'], 
			 	"extra_timeunit": this.current['extra_timeunit'], 
			 	"off_timelen": this.current['off_timelen'], 
			 	"off_timeunit": this.current['off_timeunit'],
			 	"extra_off_timelen": this.current['extra_off_timelen'], 
			 	"extra_off_timeunit": this.current['extra_off_timeunit'],
			 	"finish_off_days": finishsize,
			 	'cur_off_sdate' : this.cache['sdate'],
			 	"cur_off_days": this.cache['size']
			}
		},

		change(){
			let {sdate,edate} = this.cache;

			if(sdate && edate){
				let sdays = sdate.split('-');
				let edays = edate.split('-');

				let sday = new Date(sdays[0],sdays[1]-1,sdays[2]);
				let eday = new Date(edays[0],edays[1]-1,edays[2]);


				let size = window.util.date.getDiffByDate(sday,eday);
				console.log(sdate,edate,size)
				this.cache.size = Number(size)+1;
			}

		},

		validate(){  //---校验
			let {sdate,edate} = this.cache;
			let now = this.getNowDate();
			let isok = sdate && edate

			if(!isok){ 
				let message = sdate ? `请指定" 休学结束 "日期` : `请指定" 开始休学 "日期`
				this.notify(message,3)
				return isok
			};

			isok = this.cache.size>=1

			if(!isok){
				this.notify(`结束日期不能小于开始日期`,3);
				return isok
			};

			isok = sdate.replace('-','') > now.replace('-','');

			// if(!isok){
			// 	this.notify(`开始日期小于等于当前日期，休学申请必须提前一天`,3);
			// 	return isok
			// };

			isok = this.cache.size <= this.limit;
			if(!isok){
				this.notify(`休学天数超出剩余天数！`,3)
				return isok
			};

			//---当前正在休学中
			let isConflict = this.lists.some(item => {
					let state = Number(item['cur_off_state'])
					return (state==1 || state == 2)
			});

			if(isConflict){
				this.notify('请先结束或取消已有休学',3)
			};
			isok = !isConflict
			return isok
		},

		getNowDate(){ //--获取今天的日期
			let date = new Date();
			return window.util.date.getFormatDay(date)			
		},

		notify(message,type){
			window.notie.alert(type,message,3)
		},

		computeEdate(sdate,size){ //---计算结束日期,sdate,表示开始时间
			let date = sdate.split('-');
			let year = Number(date[0]);
			let month = Number(date[1]);
			let day = Number(date[2])-1;

			month = month -1;
			if(month<0){
				year--;
				month =11
			}

			let target = window.util.date.getDayOfSize(year,month,day,size,'day');
			return window.util.date.getFormatDay(target.source);
		},

		computeState(sdate,edate){ //--计算状态；0完成，1进行中,2未开始
			let reg = /-/g;
			let now = this.getNowDate().replace(reg,''); //--当前时间
			let sday = sdate.replace(reg,''); //--开始日期
			let eday = edate.replace(reg,''); //--结束日期

			let result = 0;

			if(now>=sday && now<eday){ //--进行中
				result = 1 ;
			};

			if(now< sday){ //--未开始
				result =2 ;
			}
			return result
		},

		computeLimit(){  //--计算休学剩余天数
			let {
				off_timelen,
				off_timeunit,
				extra_off_timelen,
				extra_off_timeunit,
				finish_off_days,
			} = this.current;

			let days = 0;
			let months = 0;

			//休学期限 1:day,2:month,3:year,4:week
			switch(off_timeunit){
				case '1' :
					days = Number(days) + Number(off_timelen);
					break;
				case '2':
					months = Number(off_timelen);
					break;
				case '3':
					months = 12 * off_timelen;
					break;
				case '4':
					days = Number(days) + 7 * off_timelen
			};

			// 计算奖励休学期限 1:day,2:month,3:year,4:week;
			switch(extra_off_timeunit){
				case '1' :
					days = Number(days) + Number(extra_off_timelen);
					break;
				case '2':
					months = Number(months) + Number(extra_off_timelen);
					break;
				case '3':
					months = Number(months) + 12 * extra_off_timelen;
					break;
				case '4':
					days = Number(days) + 7 * extra_off_timelen
			};

			let total = days + months * 30;
			return total - finish_off_days
		}

	},

	ready(){
		this.fetch()
	},

	watch:{
		current(){
			this.fetch();
		}
	},

	computed: {
		limit(){
			return this.computeLimit();
		}
	},

	filters:{
		stateString(index){
			let states = ['已结束','进行中','未开始']
			return states[index]
		},

		day(value){
			return value.split('.')[0]
		}
	},

	vuex:{
		actions:{
			change_current(store,item){
				store.dispatch('COURSE_CHANGE_CURRENT',item)
			},	
		},
		getters,
	}
})


