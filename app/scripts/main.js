'use strict';



var testApp = {
	stage:null,
	renderer:null,
	container:null,

	player:null,

	options:{
		x:30,
		y:30
	},

	position:{
		x:0,
		y:0
	},

	grid:null,
	socket:null,

	players:{},

	init:function(){
		var me = this, socket, player, ping, time;
		socket = this.socket = io('http://192.168.0.10:3000');
		
		this.stage = new PIXI.Stage(0xFFFFFF);
		this.renderer = PIXI.autoDetectRenderer();
		this.container = document.getElementById('wrapper');
		this.container.appendChild(this.renderer.view);
		
		

		function createPlayer(data){
			var pl = new GridItem(me.grid);
					pl.id = data.id;
					pl.setPosition(data.x, data.y);
			
			me.players[pl.id] = pl;

			return pl;
		}
	


		socket.on('init', function(data, callback){
			var players = data.players;
			var playerData = data.player;
			var game = data.game;

			me.options = data.game;

			if (me.grid) me.grid.remove(me.stage);
			if (me.player) me.player.remove();
			
			me.grid = new Grid(me.options.x,me.options.y);
			me.grid.show(me.stage);
			me.resize();

			me.player = player = createPlayer( playerData );
			me.position = player.gridPosition;

			callback(true);

			//socket.emit('move', player.gridPosition);

			for (var id in players){
				if (id !== player.id){
					createPlayer( data.players[id] );
				}
			}
		});

		socket.on('player.disconnect', function(data){			
			console.log(data);
			me.players[data.id].remove();
			delete me.players[data.id];
		});

		socket.on('player.join', function(data){
			console.log(data);
			me.players[data.id] = createPlayer(data);
		});

		socket.on('player.move', function(data){
			me.players[data.id].setPosition(data.x, data.y);
		});


		socket.on('player', function(data){			
				player.setPosition(data.x, data.y);


				ping = Date.now() - time;
				console.log(ping)
		});


		document.addEventListener('keydown', function(evt){
			if (!player) return;

			var dx = 0, dy = 0;

			switch (evt.keyCode){
				case 37:
					dx = -1;
				break;
				case 39:
					dx = 1;
				break;
				case 38:
					dy = -1;
				break;
				case 40:
					dy = 1;
				break;
			}
			/*
			me.position.x = me.position.x < 0 ? 0 : me.position.x > me.options.x-1 ? me.options.x-1 : me.position.x;
			me.position.y = me.position.y < 0 ? 0 : me.position.y > me.options.y-1 ? me.options.y-1 : me.position.y;
			*/
			//me.position.x += dx;
			//me.position.y += dy;
			//player.setPosition(me.position.x, me.position.y);
			
			me.socket.emit('move', {x:dx,y:dy});
			time = Date.now();
		});


		window.addEventListener('resize',this.resize);
		window.requestAnimationFrame(testApp.update);
	},
	resize:function(){	
		var style = window.getComputedStyle(testApp.container);
		testApp.renderer.resize(parseInt(style.width),parseInt(style.height));
		if (testApp.grid){
			testApp.grid.centerOnItem(testApp.position.x,testApp.position.y);		
		}
	},
	update:function(){
		testApp.renderer.render(testApp.stage);
		window.requestAnimationFrame(testApp.update);		
		TWEEN.update();
		if (testApp.grid){
			testApp.grid.centerOnItem(testApp.position.x,testApp.position.y);
		}
	},
	remove:function(){
		window.removeEventListener(testApp.update);
		window.cancelAnimationFrame(testApp.update);
	}
}



testApp.init();