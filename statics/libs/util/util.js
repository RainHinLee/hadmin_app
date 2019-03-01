
window.util = window.util || {};
			
window.util.fetch =function (url,values){  //--ajax请求数据
	var config={
			method :'post',
			credentials: "include",
			headers:{
				'Accept' : 'application/json',
				"Content-Type" : 'application/json',
			},
			"body" : JSON.stringify(values)
	};
	
	return window.fetch(url,config).then(function (response){
		return response.json()
	})
};


window.util.validate={
	empty:function (value){
		return !value.length
	}
};


window.util.notify = function(message,type){
	window.notie.alert(type,message,3)
}

//--全局分发中心

window.util.dispatcher = {};

window.util.on = function (event,fn){  //--添加事件
	var dispatcher = window.util.dispatcher;
	var arr = dispatcher[event] = dispatcher[event] || [];
	arr.push(fn);
	
	return function (){window.util.off(event,fn)};
};

window.util.off = function (event,fn){  //--取消事件
	var dispatcher = window.util.dispatcher;
	var arr = dispatcher[event] || [];
	
	for(var i=0;i<arr.length;i++){
		var val = arr[i];
		if(val==fn){
			arr.splice(i,i+1,0);
		}
	};
};

//--data数据，callback，执行后的回调函数
window.util.trigger = function (event,data,callback){
	var dispatcher = window.util.dispatcher;
	var arr = dispatcher[event] || [];
	var isAttched = false

	if(typeof data =='function'){
		callback = data;
		data={};
	}
	
	for(var i=0;i<arr.length;i++){
		var fn = arr[i];
		if(fn){
			var promise = fn(data);
			if(!isAttched && callback){
				isAttched = true
				promise && promise.then ? promise.then(callback) : callback();
			}
		}
	};	
};


