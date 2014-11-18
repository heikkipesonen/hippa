
function GridItem(grid){
	this.options = {
		size:64,
		x:0,
		y:0
	}

	this.grid = grid;	
	this.item = new PIXI.Graphics();
	this.item.beginFill(0x000000);
	this.item.drawRect(0,0,this.options.size, this.options.size);
	this.grid.addChild(this.item);

	this.gridPosition = {x:0,y:0};
	this.position = this.item.position;
}

GridItem.prototype = {
	remove:function(){
		this.grid.removeChild(this.item);
	},
	setPosition:function(x,y){
		this.gridPosition.x = x;
		this.gridPosition.y = y;
		var position = this.grid.getGridPosition(x,y);
		
		this.position.x = position.x;
		this.position.y = position.y;
	}
}
