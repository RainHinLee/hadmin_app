
import store from '../store/index.js';
import getters from '../getters/index.js'

let template = __inline('./index.html');

let Timetable = Vue.extend({
		template,
		props:['teacher'],
		data(){
			let lists = window.util.date.getCalendarDays();
			let {year,month} = window.util.date.getProps();
			let id = this.getId(year,month);
			return {
				weeks:['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
				current:{year,month},
				lists,
				id,
				mode : 'normal',  //--是否休假
				selects:[]  //---休假选择日期
			}
		},
		methods:{
			next(){ //---下一个月
				let {year,month} = this.current

				if(month>=11){
					month=0;
					year+=1;
				}else{
					month++
				}
				this.current = {year,month};
			},

			prev(){ //---上一个月
				let {year,month} = this.current

				if(month==0){
					month=11;
					year-=1;
				}else{
					month--
				}
				this.current = {year,month};
			},

			click:function (ev,value,index){
				let el = ev.currentTarget
				let items = document.querySelectorAll('.timetable table td');

				if(!value){
					return this.notify('Time is not optional',3);
				}

				if(this.mode=='shortcut'){  //--当前为休假模式
					if(el.classList.contains('selected')){ //--已经选择
						el.classList.remove('selected');
						return this.selects.$remove(value);
					}

					this.validate(el,value,index) && this.selects.push(value)
				}else{ //--正常情况
					Array.from(items).forEach(item=>item.classList.remove('active'));
					el && el.classList.add('active');
					el && this.change(el,value,index)
				}
			},

			change(el,value,index){  //--切换
				let week = this.weeks[index];
				let suffix = window.util.date.suffix;
				let {year,month} = this.current;
				let isExpired = el.classList.contains('disable') //--是否过期

				let days = [year,suffix(Number(month)+1),suffix(value)].join('-');

				this.changeDays(days);
				this.changeWeek(week);
				this.changeExpired(isExpired)
			},

			validate(el,value,index){  //---休假时间校验
				let key = Number(value)
				let items = this.idleList[key];

				if(el.classList.contains('disable')){
					this.notify('Expiration time is not optional',3)
					return false
				}

				if(items && items.length){
					let message =`${value} Time conflict, not optional`
					this.notify(message,3)
					return false
				}
				el.classList.add('selected')
				return true
			},

			getId(year,month){ //---当前时间的id，2016-05
				month = Number(month)+1;
				return year+'-'+window.util.date.suffix(month)
			},

			getInitClickDay(){  //--默认第一个激活的日期，过去时间不激活，未来时间返回01,当前月返回当天
				let props = window.util.date.getProps();
				let {year,month} = this.current;

				let origin = props.year+''+window.util.date.suffix(props.month)
				let target = year +''+window.util.date.suffix(month);

				let diff = target - origin;

				if(diff==0){ //--当前月
					return props.day;
				}else{
					return '01'
				}
			},

			getItemByDay(day){  //--日期获取元素
				let items = document.querySelectorAll('.timetable table td');
				let results = Array.from(items).filter( item =>{
						return Number(item.dataset.index) == Number(day)
				})
				return results[0]
			},

			fetch(){  //---获取老师时间
				let start = this.id.replace('-','')+'01'; //--开始时间
				let _this = this;
				let idle_list = {};
				let options = {start,uid: this.teacher || window.user.uid};

				this.toggleFetching(true);
				store.getTimesAsync(options).then(function (result){ //--ajax请求
					_this.toggleFetching(false);
					result['idle_list'].forEach(item =>{  //---忙碌时间
						let key = item['date_str'];
						let days = key.split('-');
						let times = item['stime'].split(':');
						let month = Number(days[1])-1;
						let year = Number(days[0])

						if(month==-1){  //--跨年
							month = 11;
							year--;
						};

						let date = new Date(year,month,days[2],times[0],times[1],0);
						let diff = date.getTime() - Date.now();
						item['isExpired'] = diff<0;  //--是否已经过期
						item['editing'] = false;
						idle_list[key] = idle_list[key] || [];
						idle_list[key].push(item);
					});

				}).then(function (){
					let results = {};
					Object.keys(idle_list).forEach( item=>{ //--item:2016-05-30
						if(item.startsWith(_this.id)){
							let key = Number(item.slice(8,10));
							results[key] = idle_list[item]
						}
					});
					_this.fill(results);
				}).then(function (){ //--激活默认项
					let initDay = _this.getInitClickDay();
					let {year,month} = _this.current;
					let weekIndex = ''

					if(initDay=='01'){  //--第一天
						weekIndex = window.util.date.getFirstWeekOfMonth(year,month)
					}else{
						weekIndex = new Date().getDay();
					}
					let ev = {currentTarget: _this.getItemByDay(initDay)};
					initDay && _this.click(ev,initDay,weekIndex)
				}).catch(err=>{
					_this.notify(`Faiular:${err.message}`,3);
					_this.toggleFetching(false);
				})
			},

			shortcutStart(){  //--开始休假
				this.mode = 'shortcut';
			},

			shortcutSure(){  //--确定休假
				this.changeShortcuts(this.selects);
				this.shortcutCancel();
			},

			shortcutCancel(){ //--取消休假
				let items = document.querySelectorAll('.timetable table td');
				Array.from(items).forEach(item => item.classList.remove('selected'));
				this.selects = [];
				this.mode = 'normal'
			},

			notify(message,type){
				window.notie.alert(type,message,4)
			},

			refresh(){
				let {year,month} = this.current;

				this.lists = window.util.date.getCalendarDays(year,month)
				this.id = this.getId(year,month);

				this.mode = 'normal';
				this.selects = [];
				this.changeShortcuts([])

				this.fill() //--清空数据
				this.fetch() //--获取数据
			},
		},

		ready(){  //---请求老师的忙碌时间
			this.fetch();
		},

		watch:{
			current(){
				this.refresh()
			},
			teacher(){
				this.refresh()
			}
		},

		vuex:{
			actions : {
				fill(store,idleList){
					store.dispatch('CALENDAR_FILL',idleList)
				},

				toggleFetching(store,fetching){  //---请求中
					store.dispatch('CALENDAR_CHANGE_FETCHING',fetching)
				},

				changeDays(store,days){
					store.dispatch('CALENDAR_CHANGE_DAYS',days)
				},

				changeWeek(store,week){
					store.dispatch('CALENDAR_CHANGE_WEEK',week)
				},

				changeExpired(store,isExpired){
					store.dispatch('CALENDAR_CHANGE_ISEXPIRED',isExpired)
				},

				changeShortcuts(store,selects){
					store.dispatch('CALENDAR_CHANGE_SHORTCUTS',selects)
				}
			},
			getters
		},

		filters:{
			getItemstate(value){  //---状态
				let props = window.util.date.getProps();
				let {year,month} = this.current;

				let origin = props.year+''+window.util.date.suffix(props.month)
				let target = year +''+window.util.date.suffix(month);

				let result= '';

				if(target==origin  ){
					Number(value)==props.day && (result='now')
					value<props.day && (result='disable');
				};

				if(value==0 || target<origin){
					result='disable'
				};
				return result
			},

			showBtn(current){  //--是否显示休假等按钮
				let props = window.util.date.getProps()
				let suffix = window.util.date.suffix
				let {year,month} = current;

				let origin = [props.year,props.month].join('');
				let target = [year,suffix(month)].join('');
				return target>=origin
			}
		}
});

export default Timetable
