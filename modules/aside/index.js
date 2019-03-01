
var template = __inline('./index.html');

const icons= {   //--icon样式
		'Calendar':'glyphicon-calendar',
		'Classroom':'glyphicon-blackboard',
		'Students':'glyphicon-sunglasses',
		'Users':'glyphicon-tasks',
		'Teachers':'glyphicon-book',
		'Courses': 'glyphicon glyphicon-send',
		'Package' : 'glyphicon glyphicon-shopping-cart',
		"Schedule" : "glyphicon glyphicon-paperclip"
};

var Aside = Vue.extend({
		template,
		data(){
			return {
				labels: this.getLabels(),
				height: ""
			}
		},
	
		methods:{
			getLabels(){
				let labels = window.user.labels;
				let expose = [];

				labels.views.forEach(label =>{
					
					let router = window.user.routers.find(router =>{
							return router[label];
					});

					let item = {
							name : label,
							link :{
								path : router[label],
								activeClass: 'active'
							} ,
							icon : icons[label]
					};
					expose.push(item)
				});
				return expose
			},
			setMinHeight(){
				this.height = document.documentElement.clientHeight;
			},
		},

		ready(){
			this.setMinHeight();
			window.addEventListener('resize',this.setMinHeight.bind(this))
		},
		
});

module.exports = Aside 

