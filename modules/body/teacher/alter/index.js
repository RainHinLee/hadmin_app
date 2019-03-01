
import getters from '../getters/index.js'; //--父组件的getters
import store from '../store/index.js';
import modal,{open,close} from './modal.js';

let template = __inline('./index.html');

export default Vue.extend({
		template,

		data(){
			return {
				lists : [],
				levels:['主课老师','1级代课老师','2级代课老师'], //--对应idx1，2，3
				type : '1',
				select: '',
				loading: false,
				adding: false,
			}
		},

		methods:{
			add(){
				let uid = this.student.uid;
				let tid = this.teacher.uid;
				let idx = this.type;

				if(this.isContains()){
					return this.notify(`${this.teacher.name}老师已存在，请重新选择`,3)
				}

				this.adding = true
				store.addAsync(uid,tid,idx).then(function (result){
					let code = result['result_code'];
					let message = result['result_msg'];

					if(code<0){
						this.notify(message,3)
					}else{
						message =`添加老师${this.teacher.name}成功`;
						this.notify(message,1);
						this.fetch();
						this.refreshStudentList(true);
					}
					this.adding = false;
				}.bind(this));
			},

			isContains(){  //--学生是否已经安排该老师了
				return this.lists.find(item=> item.uid == this.student.uid)
			},

			remove(item){
				let uid = item.uid;
				let tid = this.select
				store.removeAsync(uid,tid).then(function (result){
					if(uid == this.student.uid){
						this.refreshStudentList(true);
					}
				}.bind(this));
				this.lists.$remove(item)
			},

			fetch(){ //--获取老师的学生
				this.loading = true;
				store.getTeacherById(this.select).then(function (result){
					let list = result['data_list'][0]
					this.lists = list ? list['user_list'] : [];
					this.loading = false;
					this.refreshTeacherList(false)
				}.bind(this))
			},

			notify(type,message){
				window.notie.alert(message,type,3)
			},

			close,
		},

		watch:{
			select(){
				let target = this.teachers.find(item => item.uid==this.select);
				if(this.adding){
					this.select= this.teacher.uid;
					this.notify('请等待请求完成',3);
					return
				};
				this.change_teacher(target)
				this.fetch();
			},

			updateTeacherList(){
				this.updateTeacherList && this.fetch();
			}
		},


		filters:{
			format(timestr){
				let times = timestr.split(',');
				let target = times[0].replace('--',' / ');
				return target
			}
		},

		vuex:{
			actions:{
				refreshTeacherList(store,bool){
					store.dispatch('TEACHER_CHANGE_UPDATETEACHERLIST',bool)
				},

				refreshStudentList(store,bool){
					store.dispatch('TEACHER_CHANGE_UPDATESTUDENTLIST',bool)
				},

				change_teacher(store,teacher){
					store.dispatch('TEACHER_CHANGE_TEACHER',teacher)
				}
			},
			getters
		}
});



