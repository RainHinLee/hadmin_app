import options from './options.js';

let template = __inline('./index.html');


let Header = Vue.extend({
		template,
		data(){
			return {
				user : window.user,
				labels:{},
			}
		},

		methods:{
			logout(){
				var url = '_domain/store/user/logout';
				window.util.fetch(url).then(function (){
					document.location.href= '_domain/user/login';
				})
			}
		},
		
		ready(){
			
			hashChangeHandler.call(this)
			window.addEventListener('hashchange',hashChangeHandler.bind(this));
			
			function hashChangeHandler(){
				var hash = document.location.hash.replace('#!',"").slice(1);
				var targetHash = hash ? hash.split('/')[0] : ""	;
				var option = options[targetHash] || {};
				this.labels = option;				
			}
			
		},
		
		filters:{
			hasKeys(obj={}){
				return Object.keys(obj).length;
			}
		}
});

export default Header














