
import store from '../store/index.js';
import getters from '../getters/index.js';
import modal from '../alter/modal.js';
import options from './options.js';

let template = __inline('./index.html');

export default Vue.extend({
	template,

	data(){
		return {
			options,
			option: '',
			modifing: false
		};
	},

	methods:{
		close(){
			modal.close()
		},

		hasEditRight(){
			const NAME = 'Users' //---权限使用
			let edits = window.user.labels.edits;
			return edits.includes(NAME)
		},

		edit(option,discard){
			
			if(!this.hasEditRight()){ //---无修改权限
				return this.notify('您没有修改信息的权限',3)
			}

			if(discard){  //--不可编辑
				let key = this.options[option].translate
				let message = `" ${key} "不可编辑`
				return this.notify(message,3);
			};

			if(this.option){  //--正在编辑，没有保存
				let key = this.options[this.option].translate
				let message = `请先保存" ${key} "的数据`
				return this.notify(message,3)
			};
			this.option = option;
		},

		save(){
			let sn = this.current.product_user_sn;
			let username = this.current.username;
			let keys = this.options[this.option].values;
			let key = this.options[this.option].translate;
			let data = this.getBody(keys);

			let value = this.current[this.option]

			if(!value){
				let message = `" ${key} "值为空！`;
				return this.notify(message,3)
			}

			this.modifing = true
			store.modify(sn,username,data).then(function (result){
				let code = result['result_code'];
				let message = result['result_msg'];
				let item = result['list']
				if(code>=0){
					this.change_current(item)
					this.option = '';
				}else{
					message = message ||  `" ${key} "数据修改失败，请重试`
					this.notify(message,3)
				}
				this.modifing = false
			}.bind(this)).catch(function (error){
				let message = message ||  `" ${key} "数据修改失败，请重试`
				this.notify(message,3);
				this.modifing = false;
			})
		},

		getBody(keys){   //--获取body数据
			let body = {};

			keys.forEach(key =>{
				body[key] = this.current[key]
			});
			//--与线上订课保持一致
			body['course_way'] = '1';
			body['course_type'] = '2'
			
			return body
		},
		
		notify(message,type){
			window.notie.alert(type,message,3)
		},

		edate(){  //--计算结束时间和剩余时间:开始时间+课程期限+奖励期限+已休学天数
			let {
				sdate, 
				limit_timelen='0', 
				limit_timeunit='1',
				extra_timelen ='0',
				extra_timeunit='1',
				finish_off_days='0'
			} = this.current;

			let days = Number(finish_off_days);
			let months = 0;

			//计算课程期限 1:day,2:month,3:year,4:week
			switch(limit_timeunit){
				case '1' :
					days = Number(days) + Number(limit_timelen);
					break;
				case '2':
					months = Number(limit_timelen);
					break;
				case '3':
					months = 12 * limit_timelen;
					break;
				case '4':
					days = Number(days) + 7 * limit_timelen
			};

			// 计算奖励期限 1:day,2:month,3:year,4:week;
			switch(extra_timeunit){
				case '1' :
					days = Number(days) + Number(extra_timelen);
					break;
				case '2':
					months = Number(months) + Number(extra_timelen);
					break;
				case '3':
					months = Number(months) + 12 * extra_timelen;
					break;
				case '4':
					days = Number(days) + 7 * extra_timelen
			};

			if(sdate){
				let [year,month,day] = sdate.split('-');
				let date = window.util.date
				month = month - 1;

				if(month<0){
					year --;
					month = 11
				};

				//--计算值
				let target = date.getDayOfSize(year,month,day,days,'day');
				target = date.getDayOfSize(target.year,target.month,target.day,months,'month');
				
				return date.getFormatDay(target.source);
			};
			return sdate
		},

		compute_limit(){  //--计算休学剩余天数
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

	computed: {
		limit(){
			return this.compute_limit();
		}
	},

	watch:{
		current:{
			handler(){
				this.current['edate'] = this.edate();
			},

			deep: true
		}
	},

	filters:{
		finishNum(num1,num2){  //--完成课时计算，num2为冻结课时
			return Number(num1) + Number(num2)
		}
	},

	vuex:{
		actions:{
			change_current(store,item){
				store.dispatch('COURSE_CHANGE_CURRENT',item)
			}
		},
		getters
	}
})
