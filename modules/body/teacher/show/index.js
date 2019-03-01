

import getters from '../getters/index.js';
import store from '../store/index.js';
import modal ,{open,close} from '../alter/modal.js'

let template = __inline('./index.html');

let Show = Vue.extend({
		template,

		data:function (){
			return {
				headers:['姓名','级别','经验','类型','备注','操作'],
				levels:['主课老师','1级代课老师','2级代课老师'], //--对应idx1，2，3
				lists:[],
				loading: false,
			}
		},

		methods:{
			open,
			fetch(){  //--获取老师列表
				let uid = this.student['uid']
				this.loading = true;
				store.getStudentById(uid).then(function (result){
					this.lists = result['data_list'][0]['teacher_list'];
					this.loading = false;
					this.refreshStudentList(false);
				}.bind(this))
			},

			remove(item){ //--删除老师;
				let tid = item.uid;
				let uid = this.student.uid;
		
				if(this.teacher.uid == tid){
					this.refreshTeacherList(true)
				}
				store.removeAsync(uid,tid);
				this.lists.$remove(item);
			},
		},

		watch:{
			student(){
				if(this.student.name){
					this.fetch()
				}
			},

			updateStudentList(){
				this.updateStudentList && this.fetch();
			}
		},

		vuex:{
			actions:{
				refreshTeacherList(store,bool){
					store.dispatch('TEACHER_CHANGE_UPDATETEACHERLIST',bool)
				},

				refreshStudentList(store,bool){
					store.dispatch('TEACHER_CHANGE_UPDATESTUDENTLIST',bool)
				}
			},			
			getters
		}
})

export default Show

