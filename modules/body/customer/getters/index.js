

export default Object.create({
	getters:{
		price: state => state.customer.price
	},

	actions:{
		CUSTOMER_DISPATCHER_PRICE(store,price){
			store.dispatch('CUSTOMER_CHANGE_PRICE',price)
		}
	}
})