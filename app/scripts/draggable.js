

function TouchEventHandler(){
	
	this.position = {x:0,y:0};
	this.velocity = {x:0,y:0};
	this.delta = {x:0,y:0,t:0};
	this.step = {x:0,y:0,t:0};
	this.timestamp = null;
	
}

TouchEventHandler.prototype = {
	getPointerPosition:function(evt){
		return {x:evt.originalEvent.pageX,y:evt.originalEvent.pageY,t:evt.originalEvent.timeStamp};
	},
	reset:function(evt){
		var pos = this.getPointerPosition(evt);
		
		this.position.x = pos.x;
		this.position.y = pos.y;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.delta.x = 0;
		this.delta.y = 0;
		this.delta.t = 0;
		this.step.x = 0;
		this.step.y = 0;
		this.step.t = 0;
		this.timestamp = pos.t;
	},
	add:function(evt){
		var pos = this.getPointerPosition(evt);
		
		var dx = pos.x - this.position.x;
		var dy = pos.y - this.position.y;
		var dt =  pos.t - this.timestamp;

		this.position.x = pos.x;
		this.position.y = pos.y;
		this.velocity.x = dx/dt;
		this.velocity.y = dy/dt;
		this.step.t = dt;
		this.step.x = dx;
		this.step.y = dy;
		this.delta.x += dx;
		this.delta.y += dy;
		this.delta.t += dt;

		return this;
	}
}


function Draggable(sprite, surface){
	if (!surface) surface = sprite;
	this.sprite = sprite;
	this.surface = surface;
	this.surface.interactive = true;
	this.dragging = false;

	this.touch = new TouchEventHandler();
	this.bounds = null;

	this._dragstart = function(evt){
		this.dragging = true;
		this.touch.reset(evt);
	}.bind(this);

	this._drag = function(evt){
		if (this.dragging){
			this.touch.add(evt);
			this.sprite.x += this.touch.step.x;
			this.sprite.y += this.touch.step.y;			
		}
	}.bind(this);


	this._dragend = function(evt){
		if (this.dragging){
			console.log('eee')
			var me = this;
			var t = new TWEEN.Tween(this.sprite.position)
				.to({x:200,y:200}, 500)
				.onUpdate(function(){
				
			
				})
				.easing(TWEEN.Easing.Elastic.Out)
				.start();
		}
		this.dragging = false;
	}.bind(this);

	this.surface.mousedown = this.surface.touchstart = this._dragstart;
	this.surface.mousemove = this.surface.touchmove = this._drag;
	this.surface.mouseup = this.surface.touchend = this.surface.touchendoutside = this.surface.mouseupoutside = this._dragend;
}

Draggable.prototype = {
}