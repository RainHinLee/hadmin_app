
import store from '../store/index.js';

let template = __inline('./index.html');
let CACHE = null
const NAME='Students';

export default Vue.extend({
	template,

	data(){
		return {
			lists:[],
			searchName: '',
			fetching : false
		}
	},

	methods:{
		fetch(){
			let uid = window.user.uid;
			this.fetching = true
			store.getList(uid).then(result =>{
				let list = result['data_list'].length ? result['data_list'][0] : {}; 
				CACHE = list['user_list'] || [];
				CACHE.reverse()

				this.fetching = false;
				this.lists = CACHE;
			})
		},

		search(){ //--搜索
			if(this.searchName){
				this.lock();
				store.findStudentByName(this.searchName.trim()).then(function (result){
					this.unlock();
					this.lists = result;
				}.bind(this))
			}else{
				this.unlock();
				this.lists = CACHE;
			}
		},
		
		unlock(){
			this.fetching = false
		},
		
		lock(){
			this.fetching = true;
		}
	},

	ready(){
		this.fetch();
	},

	filters:{
		format(time){  //---课程日期格式化
			var time = time || '';
			var rex = /,/g ;
			var times = time.split(rex);
			return times[0].replace('--',' / ')
		}
	},

	route:{
		canActivate(transition){
			window.user.canActivate(transition,NAME)
		}
	}
})
