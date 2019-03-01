
import store from '../store/index.js';
import {getters,actions} from '../getters/index.js';
import modal,{open,close} from './modal.js';

const template = __inline('./index.html');
let isdefiniteClause = false;  //--是否阅读过条款；

export default Vue.extend({
	template,
	data(){
		return {
			selected:{},
			searchText:'',
			searching : false,
			creating : false,
			showed: false,   //---是否显示面板
			users:[],
			installment:1,
			order_price:'0',
			url: '',
			postPaided : false,
			postPaiding: false,
			showPostPaid: window.user.rightName == "admin",
		}
	},

	methods:{
		close,
		select(item){
			this.selected = item;
			this.searchText = item['name'];
			this.showed = false
		},

		blur(){
			setTimeout(function (){
				this.showed = false;
			}.bind(this),150)
		},

		focus(){
			if(this.users.length){
				this.showed = true
			}
		},

		serach(){  //---查找数据
			if(this.searching){
				return 
			}

			if(this.searchText.length==0){
				return this.notify('请输入查询的学生姓名',3)
			};

			this.searching = true;
			store.search(this.searchText).then(result => {
				this.users = result['user_list'];
				this.searching = false;

				if(this.users.length>0){
					this.showed = true
				}else{
					this.notify(`${this.searchText}搜索结果为空!`,3)
				}
			})
		},

		create(){  //---生成订单
			let options={
					uid: this.selected.uid,
					name:this.selected.name,
					installment_num : this.installment,
					order_price: this.order_price
			};

			if(this.creating){
				return
			};

			if(this.validate()){
				this.creating = true;
				this.postPaiding = false;
				this.postPaided = false;
				store.create(options).then(result=>{
					let code = result['result_code'];
					let message = result['result_msg'] || '生成连接失败，请重新生成';
					let url = result['user_package_url'] + `/${Date.now()}`
					if(code>=0){  
						isdefiniteClause = false;
						this.notify('链接创建成功',1);
						this.url = url;
					}else{
						this.notify(message,3)
					}
					this.creating = false;
				})
			}
		},

		validate(){
			let isok = this.selected.uid && this.installment && this.price;

			if(!this.selected.uid){
				this.notify('请先选择用户',3);

			};

			if(!this.installment){
				this.notify('分期需大于等于1',3);
				return isok
			}

			if(!this.price){
				this.notify('价格为空',3);
				return isok
			}

			return isok
		},
		
		definiteClause:function (){  //---直接购买前需要阅读订单条款;
			isdefiniteClause = true
		},
		
		postpaid:function (){  //---直接购买
			if(isdefiniteClause){
				let options = {
						uid:this.selected.uid,
						num : this.installment,
						price: this.order_price						
				}
				this.postPaiding = true;
				this.postPaided = false
				store.payment(options).then((result)=>{
					let code = result['result_code'];
					let message = result['result_msg'] || "支付失败，请重新支付"
					if(code>=0){
						this.postPaided = true
						this.postPaiding = false;
						this.notify('支付成功',1)
					}else{
						
						this.postPaided = false
						this.postPaiding = false;
						this.notify(message,3)
					}
				})
			}else{
				alert('请先点击链接阅读订单详情，确认无误后再进行购买');
			}
		},

		notify(message,type){
			window.notie.alert(type,message,4)
		}
	},

	filters:{
		isActive(uid){
			if(uid==this.selected.uid){
				return 'active'
			}
		}
	},

	watch:{
		price(){
			console.log('price',this.price)
			this.order_price = this.price;
		},

		searchText(){
			this.url = '';
		}
	},

	vuex:{
		getters,
		actions
	}
})
