
import store from '../store/index.js';
import {getters,actions} from '../getters/index.js';
import modal,{open} from '../alter/modal.js'

const template = __inline('./index.html');
const NAME = 'Package';

export default Vue.extend({
	template,
	data(){
		let options = this.createOptions();
		return {
			fetching: true,  //--是否在请求中
			package : {},  //--学习包基本信息
			inward :Object.assign({},options),  //---本来
			current: Object.assign({},options),
			currentType: '',
			present:Object.assign({},options),   //---赠送
			payment :Object.assign({},options),  //--全额
			promotion:Object.assign({},options),  //---推广
			keys:'', //---编辑的字段
			saving: false,  //----正在保存
			classes:'normal'
		}
	},

	methods:{
		ajax(){
			return store.fetch().then( result => { //---获取学习包数据
				let code = result['result_code'];
				let message = result['result_msg'];
				if(code>=0){ //---成功的
					let lists = result['data_list'];
					let inward = lists.find(item => item['prom_type']=='0'); //--原值
					let price = result['promotion_price'];
					this.assignOptions(inward);  //---继承
					lists.forEach(this.assign);  //--克隆
					this.package = result; //---赋值
					console.log(JSON.stringify(this.package));
					this.CUSTOMER_DISPATCHER_PRICE(price)
				}
				return {code,message};
			})
		},

		fetch(){
			this.ajax().then(result => {
				let {code,message} = result
				code<0 && this.notify(message,3);
				this.currentType = 'payment';
				this.fetching = false
			}).catch( error => {
				let message = error.message;
				this.fetching = false
				this.notify(message,3);
			});
		},

		save(){  //---保存数据
			let keys = this.keys.split('.');
			let key = keys[0];
			let options = keys.slice(1);
			let expose = {};

			if(key=='package'){  //---元数据；
				expose = this.filter(this.inward);
				options.forEach(option=>{
					expose[option] = this['package'][option];
				})
			}else{
				expose = this.filter(this[key]);
			};

			expose["course_way"] = 1;
			expose['course_type'] = 2;

			this.saving = true;
			store.save(expose).then(result =>{
				let code = result['result_code']
				let message = result['result_msg'] || '保存失败,请重试';
				if(code>=0){
					this.notify('修改成功,正在更新数据',1);
					return this.ajax();
				}else{
					this.notify(message,3);
					return {}
				};
			}).then(result => {
				let {code,message} = result

				if(code>=0){
					clearTimeout(this.timer)
					this.timer = setTimeout(function (){
						this.notify('数据更新成功',1);
						this.saving = false;
						this.keys = '';
					}.bind(this),1000)
				}else{
					this.saving = false;
				}

			}).catch(error => {
				console.log(error)
				let message = error.message || '数据更新失败，请刷新浏览器';
				this.notify(message,3);
				this.saving = false;
			})
		},

		modify(key,...options){

			if(!key){
				return this.notify('计算数据，不可更改',3)
			}

			if(this.keys){
				return this.notify('请先保存！',3)
			}

			this.keys = `${key}.${options.join('.')}`;
			console.log('keys',this.keys);
		},

		filter(object){  //---过滤需要的参数
			let option1 = this.extendOptions();
			let option2 = this.createOptions();
			let options = Object.assign({},option1,option2);

			Object.keys(options).forEach(key =>{
				options[key] = object[key]
			});

			options['idx'] = object['idx'];
			return options
		},

		assign(item){  //---覆盖继承属性
			let type = item['prom_type'];
			let unit_price = item['lesson_price_list'];

			switch(type){
				case '0' :  //---本来的
					Object.assign(this.inward,item,{unit_price});
					break;
				case '1': //---赠送
					Object.assign(this.present,item,{unit_price});
					break;
				case '2' :  //--全额付款
					Object.assign(this.payment,item,{unit_price});
					break;
				case '3': //--推广
					Object.assign(this.promotion,item,{unit_price});
					break;
			}
		},

		extendOptions(){   //---全额支付，赠送，推广继承字段
			return {
				"course_level":"",
	            "class_limit":"",
	            "lesson_days_week":"",
	            "lesson_num_day":"",
			}
		},

		createOptions(){  //---//---全额支付，赠送，推广可编辑字段
			return {
				    "lesson_num":"0",
				    "lesson_timeunit":"0",
		            "unit_price":"0",
		            "prom_type":"0",
			}
		},

		assignOptions(item){  //---继承字段
			let options = this.extendOptions();

			Object.keys(options).forEach(key=>{
				options[key] = item[key];
			})

			Object.assign(this.present,options,{prom_type:'1', idx:'2'}) //---赠送
			Object.assign(this.payment,options,{prom_type:'2', idx:'3'}) //---全额
			Object.assign(this.promotion,options,{prom_type:'3', idx:'4'});  //--推广
		},

		tab(type){  //---推广，全额，赠送等切换

			if(this.keys){
				return this.notify('请先保存数据',3)
			}

			this.classes = 'level';
			clearTimeout(this.timer)

			this.timer = setTimeout(function (){
				this.currentType = type;
				this.classes = 'come';
			}.bind(this),300)

		},

		createUrl(){  //---生成链接
			if(this.keys){
				return this.notify('请先保存数据',3)
			};

			modal.open();

		},

		notify(message,type){
			window.notie.alert(type,message,4)
		}
	},

	filters:{

		limit(idx){ //--上课形式
			let words = ['Group Class'];
			if(idx==0){
				return words[idx]
			}else{
				return `1-On-${idx}`
			};
		},

		level(idx){
			let words = ['General','Special','Trial'];
			return words[idx-1]
		},

		way(idx){
			let words = ['Online','Oncampus','Onsite'];
			return words[idx-1]
		},

		rules(item){
			let week = item['lesson_days_week'];
			let num = item['lesson_num_day'];

			if(week=='5'){
				return `${num} Lessons/day; Only weekday`;
			}

			return ` ${num} Lessons/day; Any day`;
		},

		type(idx){
			let words = ['teach','coach'];
			return words[idx-2]
		},

		timeunit(unit){ //---时间单位
			let words = ['day','month','year','week'];
			return words[unit-1]
		},

		format(price){  //--处理价格
			return Number(price).toFixed(2)
		},

		certificate(idx){
			if(Number(idx)==1){
				return 'Yes';
			}
			return 'No'
		}
	},

	ready(){
		this.fetch();
	},

	route:{
		canActivate(transition){
			window.user.canActivate(transition,NAME)
		}
	},

	watch:{
		currentType(){
			let type = this.currentType;
			let types = {
					"present": this.present,
					"payment": this.payment,
					"promotion": this.promotion,
			};
			console.log(type)
			this.current = types[type]
		}
	},

	vuex:{
		getters,
		actions
	}
});




/*

							<template v-if="keys==''">
								<td v-if='saving'>
									<button class="btn btn-danger">正在保存...</button>
								</td>
								<td v-else>
									<button class="btn btn-success" @click='save'>保存</button>
								</td>
							</template>
							<template v-else>
								<td @dblclick="modify('','')"></td>
							</template>

*/
