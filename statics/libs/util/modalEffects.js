//--改写，以符合vue组件使用,
class ModalEffects{

	constructor(id) {  //--modal的id
	  this.id = id;

	  this.rootEl = document.documentElement;
	  this.open = this.openHandler.bind(this);
	  this.close = this.closeHandler.bind(this);
	}

	openHandler(){  //---打开模态窗
		let modal = document.querySelector(this.id)

		modal.classList.add('md-show');
		setTimeout(function (){
			this.rootEl.classList.add('md-perspective')
		}.bind(this),30)
	}

	closeHandler(){  //--关闭模态窗
		let modal = document.querySelector(this.id)
		
		modal.classList.remove('md-show');
		this.rootEl.classList.remove('md-perspective','md-close');	
	}
}

window.ModalEffects = ModalEffects;  //--class声明的类没有挂载在window属性上
