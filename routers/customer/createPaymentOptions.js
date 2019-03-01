
//---直接支付生产订单需要的字段数据;

module.exports = function (body,price,num){
	var data = body['data_list'][0]
	return {
	    "package_name": body['package_name'],
	    "limit_days": body['limit_days'],
	    "list_price": body['list_price'],
	    "order_price": price || body['order_price'],
	    "limit_timelen": body['limit_timelen'],
	    "limit_timeunit": body['limit_timeunit'],
	    "limit_timeunitS": body['limit_timeunitS'],
	    "off_timelen": body['off_timelen'],
	    "off_timeunit": body['off_timeunit'],
	    "off_timeunitS": body['off_timeunitS'],
	    "extra_off_timelen": body['extra_off_timelen'],
	    "extra_off_timeunit": body['extra_off_timeunit'],
	    "extra_off_timeunitS": body['extra_off_timeunitS'],
	    "extra_timelen": body["extra_timelen"],
	    "extra_timeunit": body["extra_timeunit"],
	    "extra_timeunitS": body["extra_timeunitS"],
	    "product_list": [
				{
				    "course_level":data['course_level'],
				    "course_way":data['course_way'],
				    "course_type":data['course_type'],
				    "class_limit":data['class_limit'],
				    "lesson_num":data['lesson_num'],
				    "lesson_timeunit":data['lesson_timeunit'],
				    "lesson_days_week":data['lesson_days_week'],
				    "lesson_num_day":data['lesson_num_day'],
				    "unit_price":data['unit_price'],
				    "lesson_price_list":data['lesson_price_list'],
				    "lesson_price":data['lesson_price'],
				    "lesson_timeunitS":data['lesson_timeunitS'],
				    "prom_type":data['prom_type'],
				    "prom_typeS":data['prom_typeS']
				}				    	
	    ] ,
	    "installment_num": num || 1, //--分期数
	    "refund_policy": body['refund_policy'],
	    "certificate": body['certificate']
	};	

}




















