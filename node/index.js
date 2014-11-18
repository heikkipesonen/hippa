var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var players = {};
var session = 'ASDF';

// game canvas size
var game = {
	x:20,
	y:20
}

function findplayersInPosition(position){
	var result = [];
	for (var i in players){
		var player = players[i];
		if (player.x === position.x && player.y === position.y){
			result.push(player);
		}
	}

	return result;
}

function createPlayer(id){
	var player = {
		id:id,
		x:1,
		y:1
	}

	return player;
}

function randomizePosition(player){
	var x = parseInt( Math.random()*game.x ) -1;
	var y = parseInt( Math.random()*game.y ) -1;

			x = x > game.x ? game.x : x < 0 ? 0 : x;
			y = y > game.y ? game.y : y < 0 ? 0 : y;

	var occupied = findplayersInPosition({x:x,y:y});


	if (occupied.length > 0){
		return randomizePosition(player);
	}

	player.x = x;
	player.y = y;

	return player;
}

io.on('connection',function(socket){
	var player = createPlayer(socket.id);
	randomizePosition(player);
	players[socket.id] = player;

	/*
  
		player initialization

	*/
	socket.emit('init',{player: player, players:players, game: game},function(data){
		console.log('player.join',player);
  	socket.broadcast.emit('player.join', player);
	});
	

/*


	player movement, calculated on server

*/
  socket.on('move', function(position){
  	var dx = 0, dy = 0;
  	if (position.x === -1) dx = -1;
  	if (position.x === 1) dx = 1;
  	if (position.y === -1) dy = -1;
  	if (position.y === 1) dy = 1;
  	
  	// players new position
  	var nx = player.x + dx;
  	var ny = player.y + dy;

		  	nx = nx > game.x ? game.x : nx < 0 ? 0 : nx;
		  	ny = ny > game.y ? game.y : ny < 0 ? 0 : ny;


  	// get players on same position
  	var collision = findplayersInPosition({x:nx,y:ny});

  	if (collision.length > 0){


  	} else {
  		player.x = nx;
  		player.y = ny;
  	}

  	//console.log(callback);
  	//callback(player);

  	socket.emit('player', player);
  	socket.broadcast.emit('player.move', player);
  });

	


	socket.on('disconnect', function(){		
		io.sockets.emit('player.disconnect', player);
		delete players[socket.id];
	});

});

http.listen(3000, function(){
  console.log('joo pere');
});