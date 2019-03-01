/*--日期相关函数,时间接受参数和返回结果都依照原生js
	0-11 对应 1-12月
	0-6 对应周日-周六
*/
var _date =  {
		now : function (){ //--获取当前时间毫秒数
			return new Date().getTime()
		},

		isDate:function (date){
			return date instanceof Date
		},

		getProps:function (date){  //---获取指定时间的对象表示
			var date = date || new Date();
			return {
				year : date.getFullYear(),
				month: this.suffix(date.getMonth()),
				day : this.suffix(date.getDate()),
				hours: this.suffix(date.getHours()),
				minute : this.suffix(date.getMinutes()),
				second : this.suffix(date.getSeconds()),
				times : date.getTime(), 
				source : date,
				formatDay : this.getFormatDay(date),  //--时间日期表示，转化后的
				formarHours : this.getFormatHours(date) //--时分秒时间表示，转化后的
			};
		},

		getSpread: function (date){  //--获取数组形式表示
			var date = date || new Date();
			return [
					date.getFullYear(),
					this.suffix(date.getMonth()),
					this.suffix(date.getDate()),
					this.suffix(date.getHours()),
					this.suffix(date.getMinutes()),
					this.suffix(date.getSeconds()),
					date.getTime(),
					date,
			]
		},

		getSize: function (year,month){  //--获取某月的天数
				if(this.isDate(year)){
					var props = this.getProps(year);
					var year = props.year;
					var month = props.month;
				}

				year = Number(year)
				month = Number(month)

				if(month==11){
					month = 0;
					year = year+1;
				}else{
					month = month+1;
				}
				var date = new Date(year,month,0);
				return Number(date.getDate());
		},

		getWeek:function (year,month,day){  //---获取指定日期的周期

				if(this.isDate(year)){
					var date = year;
				}else{
					var date = new Date(year,month,day)
				}
				
				return date.getDay();
		},

		getLastWeekOfMonth: function (year,month){  //---获取指定日期的最后一天的周期
				if(month==11){   //---处理11数字
					month = 0;
					year = Number(year)+1;
				}else{
					month = Number(month)+1;
				}
				var date = new Date(year,month,0);
				return date.getDay();
		},

		getFirstWeekOfMonth:function (year,month){ //---获取指定月份的最开始的周期
			var date = new Date(year,month,1);
			return date.getDay();
		},

		//---获取日历相关的日期数组数据；strict是否严格返回；默认false：非本月日期返回0
		_getDaysOfCalendar:function (year,month,strict){  
				var size = this.getSize(year,month)
				var firstWeek = this.getFirstWeekOfMonth(year,month);
				var lastWeek = this.getLastWeekOfMonth(year,month);

				var len = 7  //--每一周的天数
				var prevLen = firstWeek   //---上个月需补天数；
				var nextLen = len-(lastWeek+1); //--下个月需补天数；

				var result = [];

				if(strict){   //--严格模式
					var days = this.getSize(year,month-1);
					for(var i=prevLen;i>0;i--){ //--上个月
						var value = (days - i) +1;
						result.push(value);
					}

					for(var i=1;i<=size;i++){  //---当前月
						result.push(i);
					}

					for(var i=1;i<=nextLen;i++){  //--下个月；
						result.push(i);
					}

				}else{
					for(var i=0;i<prevLen;i++){ //--上个月
						result.push(0);
					};

					for(var i=1;i<=size;i++){  //---当前月
						result.push(i);
					};

					for(var i=1;i<=nextLen;i++){  //--下个月；
						result.push(0);
					}

				};

				return result
		},
		//---获取日历需要的月份数据,strict是否严格返回；默认false：非本月日期返回0
		getCalendarDays:function (year,month,strict){
			if(!year){
				var year = new Date();
			}

			if(this.isDate(year)){
				var props = this.getProps(year); 
				var strict = month
				var year = props.year;
				var month = props.month;
			}
			var days = this._getDaysOfCalendar(year,month,strict);
			var result = [];
			while(days.length){
				result.push(days.splice(0,7));
			}
			return result
		},

		getFormatDay:function (date,mark){  //---获取格式化后的日期
			var spread = this.getSpread(date);
			var target = spread.slice(0,3);
			var mark = mark || '-'
			target[1] = this.suffix(Number(target[1])+1)
			return target.join(mark)
		},

		getFormatHours:function (date){  //---获取格式化后的时分秒
			var spread = this.getSpread(date);
			var target = spread.slice(3,6);
			return target.join(':')
		},

		suffix:function (target){  //--小于0的添加0
			var target = Number(target)
			if(target<10){
				target = 0+''+target
			}
			return target
		},

		getUtc: function (){  //--获取utc时间
			return Date.UTC();
		},

		getOffsetTime:function (date){ //---获取时区相对于utc的分钟差
			var date = date || new Date();
			return date.getTimezoneOffset()
		},

		getTimezone:function (date){  //---获取时区
			var offset = this.getOffsetTime(date);
			var zone = window.parseInt(offset/60)  //--区号
			var time = offset%60  //---时间

			var result = '';
			if(zone>0){ //--js中的失去分钟差与其他语言相反
				result ='-'+Math.abs(zone)+':'+time;
			}else{
				result ='+'+Math.abs(zone)+':'+time;
			}
			return result
		},

		//---获取指定日期的偏移值日期对象,offset单位为day

		getDayByOffset:function (year,month,day,offset){  
			if(this.isDate(year)){
				var date = year
				var offset = month
			}else{
				var date = new Date(year,month,day)
			};
			var times = offset*24*60*60*1000;
			var targetTimes = date.getTime()+times;
			var _date = new Date(targetTimes);
			return this.getProps(_date)
		},

		//---获取指定日期的偏移offset月的天数;offset单位为月，可谓正负
		getDiffDaysByOffset:function (year,month,day,offset){
			var days = 0;
			if(offset>0){ //--正数
				for(var i=0;i<=offset;i++){
					var _month = Number(month)+i;
					var _year = Number(year) + Math.floor(_month /12);
					if(_month>=12){
						_month=_month % 12;
					};

					var size = this.getSize(_year,_month);
					days += size;

					if(i==0){ //--第一月减去day天
						days -= day;
					};

					if(i==offset){ //--最后一个月
						var diff = size - day;
						if(diff>0){
							days -= diff
						}
					}
				}
			}else{ //--负数
				for(var i=0;i<= Math.abs(offset);i++){
					var _month = Number(month) - i;
					var _year = Number(year) + Math.floor(_month / 12)
					if(_month<=-1){
						_month = 12 - Math.abs(_month%12);
					};

					var size = this.getSize(_year,_month);
					days += size;	

					if(i==0){ //--第一月减去day天
						days = days-size + Number(day);
					};

					if(i== Math.abs(offset)){ //--最后一个月
						var diff = size - day;
						if(diff>0){
							days = days-size + diff
						}
					}
				}
			};
			return days
		},

		//--获取偏移日期
		getDayOfSize: function (year,month,day,offset,unit){ 
			var days = 0;
			switch(unit){
				case 'year':
					offset = 12 * offset;
					days = this.getDiffDaysByOffset(year,month,day,offset);
					break;
				case 'month' : 
					days = this.getDiffDaysByOffset(year,month,day,offset);
					break;
				case 'week':
					days = offset * 7;
					break;
				default:
					days = offset
			};
			return this.getDayByOffset(year,month,day,days);
		},

		getDiffByDate(origin,target){  //--两个日期对象间的差值。单位day
			var times = target.getTime() - origin.getTime();
			var size = 24 * 60 * 60 * 1000;

			return Math.ceil(times / size);
		},

		setDate(time){  //--2017-08-12生成date对象
			var rex = /-|\//g;
			var date = time.replace(rex,'');

			var year = Number(date.slice(0,4));
			var month = Number(date.slice(4,6)) - 1;
			var day = Number(date.slice(6,8));
			return new Date(year,month,day)
		}

};

window.util = window.util || {};
window.util.date = _date;


