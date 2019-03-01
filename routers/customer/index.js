
var Promise = require('bluebird');
var request = require('superagent');
var config = require('config');
var querystring = require('querystring');
var SN = 50;
var createPaymentOptions = require('./createPaymentOptions.js');

module.exports = Object.create({

	fetch(req,res){
		var url = config.path +`/product/package/package_sn/${SN}`;
		new Promise(function (reject,resolve){
			request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			})
		}).then(function (result){
			res.send(result)
		}).catch(function (err){
			var expose = {
				result_code : '-1',
				result_msg : err.message
			};
			res.send(err)
		})
	},

	save(req,res){  //--保存自定义学习包
		var body = req.body.body;
		var url = config.path + '/product/custom_package';
		var expose = {
    			"attachment_list": [body]
		};

		new Promise(function (resolve,reject){
				request.post(url).send(expose).end(function (err,result){
					err ? reject(err) : resolve(result.body)
				})
		}).then(function (result){
			res.send(result)
		}).catch(function (err){
			var expose = {
					result_code:'-1',
					result_msg: err.message
			}
		})
	},

	search(req,res){
		var username = req.body.searchText;
		var url =`${config.path}/user/list/pagetotal/1/pagesize/100/userid/${username}`;

		new Promise(function (resolve,reject){
			request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			})
		}).then(function (result){
			var code = result['result_code']
			var message = result['result_msg'];

			if(code>=0){
				var lists = result['user_list'];
				result['user_list'] = lists.map(item =>{
					return {
						name : item['username'],
						uid : item['uid']
					}
				});
			}

			res.send(result)
		}).catch(function (err){
			var expose = {
				result_code:'-1',
				result_msg: err.message
			}
			res.send(expose)
		})
	},

	create(req,res){   //---创建订单；
		var options = req.body.options;
		var path = querystring.stringify(options,'/','/');

		var url = config.path+`/product/user_package_url/package_sn/${SN}/${path}`;
		console.log(url)
		new Promise(function (resolve,reject){
			request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			})

		}).then(function (result){
			res.send(result)
		}).catch(function (err){
			var expose = {
				result_code:'-1',
				result_msg: err.message
			}
			res.send(expose)
		})
	},
	
	payment:function (req,res){  //---直接购买
		var options = req.body.options;
		var price = options['price']; //--实际价格;
		var num = options['num'] //--分期数
		var url = config.path+`/product/package/package_sn/${SN}/uid/${options.uid}`; //---获取学习包
		console.log(url)
		
		new Promise(function (resolve,reject){ //--获取学习包信息
			request.get(url).end(function (err,result){
				err ? reject(err) : resolve(result.body)
			});
		}).then(function (result){  //--下单
			var expose = createPaymentOptions(result,price,num);
			var url = config.path+`/order/new/uid/${options.uid}/order_type/1/webdr/1`
			return new Promise(function (resolve,reject){
				request.post(url).send(expose).end(function (err,result){
					err ? reject(err) : resolve(result.body)
				})
			})	
		}).then(function (result){ //--改变订单支付状态
			var code = result['result_code'];
			if(code>=0){ //--下单成功
				var stateData = {  //---订单状态改变数据
						"fee_uid" : options['uid'],  //---用户id
						"order_sn" :result['order_sn'], //---订单号
						"pay_way": '8', //---支付方式
						"pay_amount" : price.replace(/,/g,''), //---支付金额	
						"webdr" : 1,
				};
				var pathname = querystring.stringify(stateData,'/','/');
				var url = config.path+`/order/pay/${pathname}`;

				return new Promise(function (resolve,reject){
					request.post(url).end(function (err,result){
						err ? reject(err) : resolve(result.body);
					})
				})			
			}else{
				return Promise.reject({message:result['result_msg']});
			}
		}).then(function (result){
			
			res.send(result)
		}).catch(function (err){
			var expose = {
					result_msg : err.message,
					result_code : -1,
			}
			res.send(err)
		})
		
		//res.send({code:'success'})
		
	}
})

/*

{ 
	"attachment_list":
	   [ 
		   	{  "course_level": "1",
		       "course_way": "1",
		       "course_type": "2",
		       "class_limit": "8",
		       "lesson_days_week": "7",
		       "lesson_num_day": "4",
		       "lesson_num": "3",
		       "lesson_timeunit": "4",
		       "unit_price": "4.59",
		       "prom_type": "0",
		       "limit_timelen": "2",
		       "limit_timeunit": "2" 
		    }
	    ]

}


 */