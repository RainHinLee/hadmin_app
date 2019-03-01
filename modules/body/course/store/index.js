let store = Object.create({

		getStudentsAsync(){ //--获取学生列表
			var url = '_domain/store/course/getStudents';
			var expose = {};
			return window.util.fetch(url,expose)
		},

		getCourseByUserName(username){  //---获取用户课程信息
			let url = '_domain/store/course/getCourseByUserName';
			let expose={username};
			return window.util.fetch(url,expose)
		},

		modify(sn,username,data){   //--修改数据
			let url ='_domain/store/course/modify';
			let expose={sn,username,data};
			return window.util.fetch(url,expose)
		},

		getOffLists(sn){  //--获取休学列表
			let url ='_domain/store/course/getOffLists';
			let expose={sn};
			return window.util.fetch(url,expose)			
		},

		addOffItem(sn,data,action){  //--添加休学项
			let url = '_domain/store/course/addOffItem';
			let expose = {sn,data,action}
			return window.util.fetch(url,expose)			
		},

});

export default store