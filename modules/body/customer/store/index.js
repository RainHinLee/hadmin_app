
export default Object.create({
	fetch(sn){ //--获取学习包信息
		var url = '_domain/store/customer/fetch';
		var expose = {sn};
		return window.util.fetch(url,expose);
	},

	save(body){ //---保存编辑
		var url = '_domain/store/customer/save';
		var expose = {body};
		return window.util.fetch(url,expose);		
	},

	search(searchText){ //---搜索用户
		var url = '_domain/store/customer/search';
		var expose = {searchText};
		return window.util.fetch(url,expose);	
	},

	create(options){ //--创建订单链接
		var url = '_domain/store/customer/create';
		var expose = {options};
		return window.util.fetch(url,expose);			
	},
	
	payment(options){
		var url = '_domain/store/customer/payment';
		var expose = {options};
		return window.util.fetch(url,expose);			
	}
})

