/*
	 <h-select key="" class="select" value="" :data="" :change='()=>{console.log("change")}' :selected="" :fetching=""></h-select>
	 
	 key : 相当于option显示的字段；
	 value : 相当于option.value的字段;
	 
	 data： 注入的数据;
	 
	 change: 相当于input 的change事件的handler函数
	 
	 selected : 选择option的监控函数
	 
 * 
 * */

let template = __inline('./index.html');
let INDEX = -1;

export default Vue.extend({
	template,
	
	data(){
		return {
			text: "",
			classname: "hide",
			selectIndex: 0,
		}
	},
	
	props:{
		"key":{
			type: String,
			required: true
		},
		
		"value": {
			type: String,
			required: true
		},
		
		"lists":{
			type: Array,
			default:function (){
				return []
			}
		},
		
		"change":{
			type: Function,
			default:()=>{},
		},
		
		"selected":{
			type: Function,
			required:true,
			default:()=>{},			
		},
		
		fetching:{
			tyep:Boolean,
			default:false
		}
	},
	
	methods:{
		focus(){
			window.addEventListener('keyup',this.keyup,false);
			this.classname='show'
		},
		
		blur(){	
			window.removeEventListener('keyup',this.keyup,false);
			setTimeout(()=>{
				this.classname='hide'
			},150)
		},
		
		keyup(ev){
			let code = ev.keyCode;
			
			switch(code){
				case 13:
					if(this.fetching){
						return window.util.notify('请等待搜索完成',3)
					}else{
						let item = this.findItemByName();
						if(!item && this.text.length){
							return window.util.notify('无此用户',3)
						}
						this.selected(item);
						this.classname='hide';
						document.querySelector("._hselect input").blur();
					};
					return;
				
				case 38:
						if(this.lists.length==0){
							return
						}

						if(INDEX>0){
							INDEX--
						}else{
							INDEX = this.lists.length-1;
						};
						
						this.click(INDEX)	
						return;
				case 40:
						if(this.lists.length==0){
							return
						}

						if(INDEX<this.lists.length-1){
							INDEX++
						}else{
							INDEX = 0;
						}
						this.click(INDEX)	
						return;					
				case 37:
				case 39:
					return
			};
			
			if(this.text.length==0){
				this.selected({});
			};
			
			this.change(this.text);
		},
		
		findItemByName(){
			return this.lists.find(item=>{
				return item[this.key] == this.text;
			});
		},
		
		findItemIndexByName(){
			return this.lists.findIndex(item=>{
					return item[this.key] == this.text;
			})	
		},
		
		click(index){
			let item = this.lists[index];
			this.text = item[this.key];
			INDEX = index;
			this.selected(item);
		},
	},
	
	filters:{
		getValueStr(item){
			return item[this.key];
		},
		
		getClassStr(item){
			let val = item[this.key];
			
			if(val==this.text){
				return 'active';
			}
		}
	},
	
	ready(){
		
	},
})
