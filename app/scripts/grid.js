
function Grid(x,y){
	this.tween = false;
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

		

		console.log(this.count)
	},

	_drawGridItem:function(x,y){
		var xpos = x * this.options.size;
		var ypos = y * this.options.size;
		
		this.grid.lineStyle(1, 0x777777);
		this.grid.drawRect(xpos, ypos, this.options.size, this.options.size );
	},

	show:function(parent){
		parent.addChild(this.sprite);
	},

	getGridPosition:function(x,y){
		var cx = this.options.size * x;
		var cy = this.options.size * y;
		
		return {
			x:cx,
			y:cy
		}
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

			if (this.tween) this.tween.stop();
			
			this.tween = new TWEEN.Tween(this.sprite.position)
				.to({x:cx-pos.x, y: cy-pos.y},500).start();

			//this.sprite.position.x = cx - pos.x;
			//this.sprite.position.y = cy - pos.y;
		//}
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