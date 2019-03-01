//--Schedule子组件；

var template = __inline('./index.html');
var NAME = 'Schedule';

export default Vue.extend({
	template,
	
	route:{
		canActivate(transition){
			window.user.canActivate(transition,NAME);
		}
	},	
})
