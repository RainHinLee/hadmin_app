
import modal,{open,close} from './modal.js';
import {getters,actions} from '../getters/index.js'

let template = __inline('./index.html');

export default Vue.extend({
	template,

	methods:{
		close,
	},

	vuex:{
		getters,
		actions
	}
})