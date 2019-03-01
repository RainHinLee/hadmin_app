//---对于更新频率较低的数据接口进行缓存;

let cached = {
		fetchStudents:{
			data:null,  //--请求回来的数据
			promise: null   //--请求的promie 对象；
		},
		
		fetchTeachers:{
			data:null,  //--请求回来的数据
			promise: null   //--请求的promie 对象；			
		}
};

export default Object.create({
	fetchStudents(){ //--获取学生
		var url = '_domain/store/teacher/getStudents';
		var expose = {};
		var cacheObj = cached['fetchStudents'];
		
		if(cacheObj.data){  //--已缓存数据
			return Promise.resolve(cacheObj.data)
		};
		
		if(cacheObj.promise){
			return cacheObj.promise;
		};
		
		return cacheObj.promise = window.util.fetch(url,expose).then(result=>{
				return cacheObj.data = result;
		})
	},
	
	fetchTeachers(){ //--获取老师
		var url = '_domain/store/teacher/getTeachers';
		var expose =  {};
		
		var cacheObj = cached['fetchTeachers'];
		
		if(cacheObj.data){  //--已缓存数据
			return Promise.resolve(cacheObj.data)
		};
		
		if(cacheObj.promise){
			return cacheObj.promise;
		};
		
		return cacheObj.promise = window.util.fetch(url,expose).then(result=>{
				return cacheObj.data = result;
		})		
	},
	
	fetchRecords(options){ //--获取记录
		var url = '_domain/store/schedule/fetchPlanRecords';
		var expose = {options};
		return window.util.fetch(url,expose);		
	},
	
	fetchCompanys(){  //--获取公司
		var url = '_domain/store/schedule/fetchPlanCompanys';
		return window.util.fetch(url);			
	},
	
	add(options){  //--增加课程
		let url = '_domain/store/schedule/addPlanRecord';
		return window.util.fetch(url,options);
	},
	
	update(options){  //--更新课程
		let url = '_domain/store/schedule/updatePlanRecord';
		return window.util.fetch(url,options);
	},	
	
	
	
	
	
	
	
	
	
	
})
