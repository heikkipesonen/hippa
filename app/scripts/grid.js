
function Grid(x,y){
	
	this.options = {
		size:64,
		x:x,
		y:y	
	}
	this.currentItem = {
		x:0,
		y:0
	}
	this.count = 0;
	this._init();	
}

Grid.prototype = {	
	_init:function(){
		this.grid = new PIXI.Graphics();
		
		var cx = this.options.x;
		var cy = this.options.y;


		while (cy > 0){
			cx = this.options.x;
			cy--;
			while(cx > 0){
				cx--;
				this._drawGridItem(cx,cy);
			}
			
		}

		this.options.center = {
			x: (this.options.x * this.options.size)/2,
			y: (this.options.y * this.options.size)/2,
		}

		this.sprite = new PIXI.Sprite(this.grid.generateTexture());		
	},

	_drawGridItem:function(x,y){
		var xpos = x * this.options.size;
		var ypos = y * this.options.size;
		
		this.grid.lineStyle(1, 0x777777);
		this.grid.drawRect(xpos, ypos, this.options.size, this.options.size );
	},

	addChild:function(item){
		this.sprite.addChild(item);
	},

	removeChild:function(item){
		this.sprite.removeChild(item);
	},

	show:function(parent){
		parent.addChild(this.sprite);
	},
	
	remove:function(parent){
		parent.removeChild(this.sprite);
	},

	getGridPosition:function(x,y){
		var cx = this.options.size * x;
		var cy = this.options.size * y;
		
		return {
			x:cx,
			y:cy
		}
	},

	getPositionOnGrid:function(x,y){
		var px = x / this.options.size;
		var py = y / this.options.size;


	},

	getGridCenterPosition:function(x,y){
		var cx = (this.options.size * x) + this.options.size/2;
		var cy = (this.options.size * y) + this.options.size/2;
		return {
			x:cx,
			y:cy
		}
	},

	centerOnItem:function(x,y){
		//if (this.currentItem.x !== x || this.currentItem.y !== y){
			
		this.currentItem = {x:x,y:y};
		var pos = this.getGridCenterPosition(x,y);
		var cx = window.innerWidth / 2;
		var cy = window.innerHeight / 2;

		var dx = cx - pos.x - this.sprite.position.x;
		var dy = cy - pos.y - this.sprite.position.y;		
		var dt = Date.now() - this.lastStepTIme || 16;

		this.sprite.position.x += dx/300 * dt;
		this.sprite.position.y += dy/300 * dt;

			//console.log( dx / 35  - dt)

			//if (this.tween) this.tween.stop();
			

			// this is wrong, but results very smooth animation
			//this.tween = new TWEEN.Tween(this.sprite.position)
			//	.to({x:cx-pos.x, y: cy-pos.y},500)				
			//	.start();

			//this.sprite.position.x = cx - pos.x;
			//this.sprite.position.y = cy - pos.y;
		//}

		this.lastStepTIme = Date.now();
	},

	getItemAt:function(x,y){
		var pos = parseInt( x * y );
		var item = this.grid.graphicsData[pos];
		return item;
	},



	setCenter:function(x,y){
		var cx = x - this.options.center.x;
		var cy = y - this.options.center.y;
		this.sprite.position.x = cx;
		this.sprite.position.y = cy;
	},


}