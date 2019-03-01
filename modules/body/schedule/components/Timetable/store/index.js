//---对于更新频率较低的数据接口进行缓存;


export default Object.create({
	
	fetchTimetableSchool(options){  //--获取所有课表
		var url = '_domain/store/schedule/fetchTimetableSchool';
		return window.util.fetch(url,options);			
	},
})
