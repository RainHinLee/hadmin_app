
import store from '../store/index.js';
import getters from '../getters/index.js';
import modal from '../alter/modal.js'

let template = __inline('./index.html');

export default Vue.extend({
	template,
	data(){
		return {
			lists:[],
			fetching : false
		}
	},

	methods:{
		fetch(){
			this.fetching = true
			let username = this.student.username;
			store.getCourseByUserName(username).then(function (result){
				this.lists =  result['rows'];
				this.fetching = false
			}.bind(this))
		},

		show(item,alter){
			this.change_current(item);
			this.change_alter(alter);
			Vue.nextTick(modal.open.bind(modal))
		}
	},


	watch:{
		student(){
			if(this.student.username){
				this.fetch();
			}
		},

		current(item){
			let index = this.lists.findIndex(list => list['product_user_sn'] == item['product_user_sn']);
			this.lists.$set(index,item)
		}
	},

	filters:{
		limit(item){  //--期限
			let ret = item['limit_timelenS'];
			let extra = item['extra_timelen']
			if(extra>0){
				ret = ret + '+'+item['extra_timelenS']
			};
			return ret
		},

		off(item){ //---休学
			let ret = item['off_timelenS']
			let extra = item['extra_off_timelen'];

			if(extra>0){
				ret +'+'+item['extra_off_timelenS']
			};
			return ret || '0 days';
		},

		finishNum(num1,num2){  //--完成课时计算，num2为冻结课时
			return Number(num1) + Number(num2)
		}
	},

	vuex:{
		actions:{
			change_current(store,item){
				store.dispatch('COURSE_CHANGE_CURRENT',item)
			},

			change_alter(store,alter){
				store.dispatch('COURSE_CHANGE_ALTER',alter)
			}	
		},

		getters
	}
})