

export default Object.create({
	pullStduents(){ //---获取学生列表
		var url = '_domain/store/teacher/getStudents';
		var expose = {};
		return window.util.fetch(url,expose);
	},

	fetch(options){  //---获取记录列表
		var url = '_domain/store/history/fetch';
		var expose ={options}
		return window.util.fetch(url,expose);
	},

	modify(options){
		var url ='_domain/store/history/modify';
		var expose = {options};

		return window.util.fetch(url,expose);
	}

})

