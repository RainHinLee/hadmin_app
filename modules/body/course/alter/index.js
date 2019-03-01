
import Editor from '../editAlter/index.js';
import Vacation from '../vacationAlter/index.js';
import getters from '../getters/index.js';
import modal from './modal.js'

let template = __inline('./index.html')

export default Vue.extend({
	template,

	components:{
		'editor' : Editor,
		'vacation' : Vacation
	},

	vuex:{
		getters,
	}
})


