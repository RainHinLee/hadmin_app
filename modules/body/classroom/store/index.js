
export default Object.create({
	fetch(teacherId){  //--获取进入教室的列表项
		var url = '_domain/store/classroom/fetch';
		var expose = {teacherId};
		return window.util.fetch(url,expose);
	},

	getList(serverId){   //---获取教室信息
		var url = '_domain/store/classroom/getList';
		var expose = {serverId};
		return window.util.fetch(url,expose);
	},

	request(sn,serverId){
		var url = '_domain/store/classroom/request';
		var expose = {sn,serverId};
		return window.util.fetch(url,expose)
	}
})

