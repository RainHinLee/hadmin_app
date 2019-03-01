//---权限配置项，包含有教学主管，客服，管理员，销售，老师

(function(){
	const RIGHT = { //---权限配置
			admin: ["Finance","RainHinLee"], //--管理员
			charge:['keelary Huang'],  //--主管
			service: ['Studentservice'], //--客服
			seller: ['Katherine li']  //--销售
	};

	const LABELS = {  //---views可浏览，edit可编辑
			charge:{//--主管
				views : ['Calendar','Classroom','Courses','Students','Users','Teachers',"Schedule"],
				edits:['Calendar','Classroom','Students','Courses','Teachers',"Schedule"],
			},

			service:{	//--客服
				views : ['Calendar','Classroom','Courses','Students','Users',"Schedule",'Teachers'],
				edits:['Calendar','Classroom','Students','Courses',"Schedule",'Teachers'],
			},

			admin: {	//--管理员
				views : ['Calendar','Classroom','Courses','Students','Users','Teachers','Package',"Schedule"],
				edits:['Calendar','Classroom','Students','Courses','Users','Teachers','Package',"Schedule"],
			}, 

			seller:{	//--销售
				views : ['Calendar','Classroom','Courses','Students','Users','Teachers'],
				edits:['Calendar','Classroom','Students','Courses','Teachers'],

			},

			teacher:{ //--老师
				views : ['Calendar','Classroom','Courses','Students',],
				edits:['Calendar','Classroom','Students','Courses'],
			}
	};


	const ROUTERS = {   //--路由配置
		'Calendar':'/calendar',
		'Classroom':'/classroom',
		'Courses' : '/history',
		'Students':'/student',
		'Teachers':'/teacher',
		'Users':'/course',
		'Package':'/customer',
		"Schedule": "/schedule",   //---课程安排
	};

	let RIGHTNAME = 'teacher'; //---默认权限角色为老师

	for(var key in RIGHT){ //--处理权限角色
		var names = RIGHT[key];
		var isContain = names.some(function (item){
				return window.user.name.toLowerCase() == item.toLowerCase()
		});

		if(isContain){
			RIGHTNAME = key;
			break;
		}
	};

	let routerArr = LABELS[RIGHTNAME].views.map(label =>{
			let router = ROUTERS[label];
			return {[label]:router}
	});

	window.user['rightName'] = RIGHTNAME;
	window.user['labels'] = LABELS[RIGHTNAME];
	window.user['routers'] = routerArr;

	window.user['canActivate'] = function (transition,label){  //---路由器拦截程序
		var views = window.user.labels.views;
		if(views.includes(label)){
			return transition.next()
		}
		window.notie.alert(3,'You do not have permission to open this link',3)
		transition.abort()
	};
})()
