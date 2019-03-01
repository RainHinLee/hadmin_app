
//--入口组件

import Aside from '../aside/index.js';
import Header from '../header/index.js';
import Body from '../body/app/index.js';
import Alter from '../alter/index.js'

import router from '../router/index.js';
import store from '../store/index.js';

let template = __inline('./index.html');

var App = Vue.extend({
		template,
		components:{
			'h-aside' : Aside,
			'h-header' : Header,
			'h-body' : Body,
			'h-alter' : Alter
		},
		
		store
});

//--开启路由导航
router.start(App,'#app');
window.router = router;


/*
 	
 * 
 * 
 * 
 * */