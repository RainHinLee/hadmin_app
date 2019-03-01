
let template=__inline('./index.html')
let COUNT = 0;
let CACHED = "";
export default Vue.extend({
	template,
	data(){
		return {
			students:[],
			username: "",
			fetching:false,
		}
	},
	
	props:{
		"selected":{
			type:Function,
			required: true
		},
	},
	
	methods:{
		change(username){
			if(username==this.username){
				return
			};
			this.username = username;
			
			if(username.length>=3){
				this.fetchUsers();
			}else{
				this.students = [];
			}
		},
		
		fetchUsers(username){
			let url = '_domain/store/student/findUserByName';
			let options={
				username:this.username,
				count: ++COUNT
			};
			this.fetching = true;
		
			this.students = [];
			window.util.fetch(url,options).then(result=>{
				let {count,result_code,result_msg,user_list} = result;
				
				if(count==COUNT && result_code>=0){
					this.fetching = false;
					this.students = this.username.length>=3 ? user_list : [];
				}
				
				if(result_code<0){
					window.util.notify(result_msg,3);
					this.students = [];
				}
			})
		}
		
	},
})
