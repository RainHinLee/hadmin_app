var Form = Object.create({

		submit: function (ev){
			ev.stopPropagation();
			ev.preventDefault();
			var el = ev.currentTarget;
			this.validate() && this.post()
		},

		post:function (){
			var values = this.getValues();
			var url = '_domain/store/user/login';
			
			if(this.posting){
				return 
			}
			this.lock();
			values['keep'] = this.remember.checked 
			window.util.fetch(url,values).then(
				this.success.bind(this)
			).catch(
				this.fail.bind(this)
			)	
		},

		success: function (result){
			var code = result['result_code']
			var message = result['result_msg'];

			if(code<0){
				this.notify(message,3)
			}else{
				this.notify('Login successfully, Loading...',1);
				setTimeout(function (){
					document.location.href= '_domain/';
				}.bind(this),2000)
			};
			this.unlock()
		},

		fail:function (err){
			var message = err.message
			this.notify(message,3)
			this.unlock()
		},

		lock:function (){
			this.posting = true;
			this.submitBtn.innerText = 'Processing...';
		},

		unlock:function (){
			this.posting = false;
			this.submitBtn.innerText = 'Submit';
		},

		validate:function (){
			var values = this.getValues();
			var isok = true;

			var maps = {
				 username: '姓名',
				 password : '密码'
			}

			Object.keys(values).forEach(function (key,index){
				var value = values[key]
				var message = '请输入'+maps[key];
				if(!value.length){
					value.length || this.notify(message,3)
					isok = false
				}
			}.bind(this));

			return isok
		},

		getValues:function (){
			return {
				name : this.username.value.trim(),
				pass : this.password.value.trim(),
			}
		},

		notify:function (message,type){
			window.notie.alert(type,message,4)
		},

		init: function (){
			this.username = document.querySelector('input[name=username]');
			this.password = document.querySelector('input[name=password]');
			this.remember = document.querySelector('input[name=remember]');

			this.submitBtn = document.querySelector('#submit');
			this.submitBtn.addEventListener('click',this.submit.bind(this));
			this.username.value = ' '
		}
});


Form.init();

