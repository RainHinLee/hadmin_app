
//import getters from '../getters/index.js'; //--父组件的getters
import store from '../store/index.js';
import modal,{open,close} from './modal.js';
import {getters,actions} from '../getters/index.js'

let template = __inline('./index.html');

export default Vue.extend({
		template,
		methods:{
			close,

			modify(item,state){  //---更改状态，上课，旷课，请假
				let timeTableSn = this.course['timetable_sn'];

				let options = {
						'record':timeTableSn,
						'uid':item['uid'],
						'lesson_num':item['lesson_num'],
						'unit_price':item['lesson_unit_price'],
						'extra_fee':item['extra_fee'],
						'extra_fee_desc':item['extra_fee_desc'] ,
						'remark':item['remark'],
						'state':state,
						'charge_state':item['charge_type'],
				};

				Object.keys(options).forEach(key =>{  //---删除为空的字段
					let value = options[key];
					if(!value){
						delete options[key]
					}
				});

				if('modifing' in item){ //---如果没有则添加属性
					item.modifing = true
				}else{
					Vue.set(item,'modifing',true)
				}

				return store.modify(options).then(result => {
					let code = result['result_code'];
					let message = result['result_msg'] || 'Record failure，please agian!'

					if(code>=0){
						this.change_sn(timeTableSn)
					}else{
						this.notify(message,3);
						item.modifing = false;
					}
				})
			},


			notify(message,type){
				window.notie.alert(type,message,3)
			}
		},

		watch:{  //---修改完成
			course(){
				if(this.recordSn){
					let sn = '';
					this.change_sn(sn);
				}
			}
		},

		filters:{
			transform(state){ //--接受state数字形式
				const fonts=['定课','取消','上课','旷课','请假'];
				return fonts[state-1]
			}
		},

		vuex:{
			getters,
			actions
		}
});



