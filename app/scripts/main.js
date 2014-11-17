'use strict';



var testApp = {
	stage:null,
	renderer:null,
	container:null,

	player:null,
	position:{
		x:1,
		y:1
	},

	options:{
		x:30,
		y:30
	},

	grid:null,
	socket:null,

	players:{},

	init:function(){
		var me = this, socket, player;
		socket = this.socket = io('http://192.168.0.10:3000');
		//this.socket.connect('http://192.168.0.10:3000');
		this.stage = new PIXI.Stage(0xFFFFFF);
		this.renderer = PIXI.autoDetectRenderer();
		this.container = document.getElementById('wrapper');

		this.container.appendChild(this.renderer.view);
		this.grid = new Grid(this.options.x,this.options.y);
		this.grid.show(this.stage);
		this.resize();
		
		//g.setCenter(window.innerWidth/2, window.innerHeight/2);

		function createPlayer(id, position){
			var pl = new GridItem(me.grid);
			pl.setPosition(position.x, position.y);
			me.players[id] = pl;
			pl.id = id;

			return pl;
		}
	


		socket.on('init', function(data, callback){
			
			player = createPlayer(data.id, me.position );
			callback(player.gridPosition);

			socket.emit('move', player.gridPosition);

			for (var id in data.players){
				if (id !== player.id){
					createPlayer(id, data.players[id]);
				}
			}
		});

		socket.on('player.disconnect', function(data){			
			me.players[data.id].remove();
			delete me.players[data.id];
		});

		socket.on('player.join', function(data){
			console.log(data);
			me.players[data.id] = createPlayer(data.id, data.position);
		});

		socket.on('player.move', function(data){
			me.players[data.id].setPosition(data.position.x, data.position.y);
		});





		document.addEventListener('keydown', function(evt){
			if (!player) return;

			switch (evt.keyCode){
				case 37:
					me.position.x--;
				break;
				case 39:
					me.position.x++;
				break;
				case 38:
					me.position.y--;
				break;
				case 40:
					me.position.y++;
				break;
			}

			me.position.x = me.position.x < 0 ? 0 : me.position.x > me.options.x-1 ? me.options.x-1 : me.position.x;
			me.position.y = me.position.y < 0 ? 0 : me.position.y > me.options.y-1 ? me.options.y-1 : me.position.y;

			player.setPosition(me.position.x, me.position.y);
			me.socket.emit('move', player.gridPosition);
		});

		window.addEventListener('resize',this.resize);
		window.requestAnimationFrame(testApp.update);
	},
	resize:function(){	
		var style = window.getComputedStyle(testApp.container);
		testApp.renderer.resize(parseInt(style.width),parseInt(style.height));
		testApp.grid.centerOnItem(testApp.position.x,testApp.position.y);		
	},
	update:function(){
		testApp.renderer.render(testApp.stage);
		window.requestAnimationFrame(testApp.update);		
		TWEEN.update();

		testApp.grid.centerOnItem(testApp.position.x,testApp.position.y);
	},
	remove:function(){
		window.removeEventListener(testApp.update);
		window.cancelAnimationFrame(testApp.update);
	}
}



testApp.init();