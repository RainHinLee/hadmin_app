//---乐语开机动画
var colors = [
		[163,73,164],
		[255,127,39],
		[255,174,201],
		[0,162,232],
		[181,230,29],
		[233,191,211],
		[238,4,247],
		[57,248,6],
		[255,201,14],
		[41,150,113],
		[165,26,223],
		[247,255,39],
		[255,130,39],
		[136,0,21]
];

var number =0;   //--当前元素的序号；
var bars =[];
var time = 0;
var canvas = document.getElementById('stage');


//---条状类
var Bar = function (x,y,dir,ratio){
		this.dir = dir;  //--方向：1上，2右，3下，4左
		this.width = ratio * 210;
		this.height = ratio * 6;
		this.ratio = ratio ;
		this.shape = new createjs.Shape();
		this.shape.x = x;
		this.shape.y = y;
		this.index = number;
		this.speed = this.random(5,12);
		this.draw();
		// this.shape.rotation = this.random(0,360)
};

Bar.prototype.random = function (max,min){
	return Math.floor(Math.random() * (max-min)+min)
}

Bar.prototype.draw = function (){
	var index = this.random(0,colors.length);
	var color = colors[index];
	var startColor='rgba('+color[0]+','+color[1]+','+color[2]+',1)';
	var endColor = 'rgba('+color[0]+','+color[1]+','+color[2]+',0)';
	var width = this.width;
	var height = this.height;

	switch(this.dir){

		case 1: 
				this.drawrect(startColor,endColor,height,width);
				break;
		case 2 :
				this.drawrect(startColor,endColor,-1*width,height);					
				break;
		case 3 :
				this.drawrect(startColor,endColor,height,-1*width);					
				break;
		case 4 :
				this.drawrect(startColor,endColor,width,height);				
				break;

	}
	return this;
};

Bar.prototype.drawrect = function (startColor,endColor,width,height){
	this.shape.graphics.beginLinearGradientFill([startColor,endColor],[0,1],0,0,width,height)
		.drawRect(0,0,width,height);
};

Bar.prototype.animate = function (){    //---运动；
	switch(this.dir){
		case 1 : 
				this.shape.y -= this.speed;
				break;
		case 2 : 
				this.shape.x += this.speed;		
				break;
		case 3 : 
				this.shape.y += this.speed;
				break;
		case 4:
				this.shape.x -=this.speed;				
				break;
	}
	this.testing();
	return this;
};

Bar.prototype.testing = function (){   //--检测并销毁
	switch(this.dir){
		case 1 : 
				this.shape.y<=-1*this.width && this.destory(); //上
				break;
		case 2 : 
				this.shape.x>=(width+this.width) && this.destory(); //--右
				break;
		case 3 : 
				this.shape.y>=(height+this.width) && this.destory();  //--下
				break;
		case 4:
				this.shape.x <=-1*this.width && this.destory();
				break;
	}		
};

Bar.prototype.destory = function(){
	container.removeChild(this.shape);
	bars.forEach(function (item,index){
		if(item.index == this.index){
			bars.splice(index,1);
		}
	}.bind(this));
};


//----控制器类
var Vivo = Object.create({

		tick:function (){
			bars.forEach(function (item,index){
				item.animate();
			});
			var nowTime = new Date().getTime();
			var diff = nowTime-time;

			if(diff>= 1500){
				this.genaraterItem();
				time = nowTime;
			}
		},

		random: function (min,max){
			return Math.floor(Math.random() * (max-min)+min)
		},

		genaraterItem:function (){
			var dir = this.random(1,5);
			var x =0;
			var y= 0;
			var ratio = 1+Math.random();
			switch(dir){
				case 1:
						x = this.random(0,width);
						y = height;
						break;
				case 2:
						x = 0;
						y =this.random(0,height);
						break;
				case 3:
						x = this.random(0,width);
						y=0;
						break;
				case 4:
						x =width;
						y = this.random(0,height)
			};
			var bar = new Bar(x,y,dir,ratio);
			container.addChild(bar.shape);
			bars.push(bar);
			number++
		},

		click:function (ev){
			var dirs = [1,2,3,4];
			var ratio = 1+Math.random();
			var x = ev.pageX;
			var y = ev.pageY;
			dirs.forEach(function (item,index){
				var bar = new Bar(x,y,item,ratio);			
				container.addChild(bar.shape);
				bars.push(bar);
				number++;
			})			
		},

		layout:function (){
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
			stage.canvas.width = width;
			stage.canvas.height = height;
		},

		init:function (){
			this.layout();
			stage.addChild(container);
			time = new Date().getTime();

			var body = document.getElementsByClassName('body');

			body[0].addEventListener('click',this.click.bind(this));
			document.getElementById('login').addEventListener('click',function (ev){
				ev.stopPropagation();
			})


			createjs.Ticker.addEventListener('tick',stage);
			container.addEventListener('tick',this.tick.bind(this));

			window.addEventListener('resize',this.layout.bind(this),false)
		}
});

var Mp3 = Object.create({

		click:function (ev){
			ev.stopPropagation();
			ev.preventDefault();

			if(this.el.classList.contains('active')){
				this.pause();
			}else{
				this.play();
			}
			this.el.classList.toggle('active');
		},

		end:function (){
			this.el.classList.remove('active')
		},

		pause:function (){
			this.mp3.pause();
		},

		play:function (){
			this.mp3.play();
		},

		init: function (){
			this.el = document.getElementById('mp3');
			this.mp3 = document.getElementsByTagName('audio')[0];

			if(this.mp3){
				this.el.addEventListener('click',this.click.bind(this));
				this.mp3.addEventListener('ended',this.end.bind(this))
			}
		}
})


if(canvas){
	var stage = new createjs.Stage('stage');
	var container = new createjs.Container();
	var width = stage.canvas.width;
	var height = stage.canvas.height;

	setTimeout(function (){
		Vivo.init();
		Mp3.init();
	},2000)


}
