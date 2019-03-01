//--所有的方法统一使用了post;
let getTimesAsync = function (params){  //---获取时间
		let url ="_domain/store/calendar/getTimes";
		let uid = window.user.uid;
		let expose = {
				start:params.start,
				end:params.end,
				uid:params.uid,
		};
		return window.util.fetch(url,expose)
};

let removeItemAsync = function (sns){ //--删除时间
		let url ="_domain/store/calendar/removeTimes";
		let expose = {sns};
		return window.util.fetch(url,expose)
}

let saveItemAsync = function (uid,data){  //--保存时间
		let url ="_domain/store/calendar/saveTimes";
		let expose = {uid,data};
		return window.util.fetch(url,expose);
}

let modifyItemAsync = function (uid,data){ //--更改时间
		let url ="_domain/store/calendar/modifyTimes";
		let expose = {uid,data};
		return window.util.fetch(url,expose)
};

let fetchTeachers = function(){ //--获取老师
		var url = '_domain/store/teacher/getTeachers';
		var expose =  {};
		return window.util.fetch(url,expose);
}

export default {getTimesAsync,removeItemAsync,saveItemAsync,modifyItemAsync,fetchTeachers};
