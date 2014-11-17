var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

io.on('connection',function(socket){

	users[socket.id] = {};
	
	socket.emit('init',{id:socket.id, players:users},function(data){
		users[socket.id] = data;
  	
  	socket.broadcast.emit('player.join', {id:socket.id, position:data});
	});
	

  socket.on('move', function(position, callback){
  	users[socket.id] = position;
  	socket.broadcast.emit('player.move', {id:socket.id, position:position});
  });

	socket.on('disconnect', function(){
		
		delete users[socket.id];
		io.sockets.emit('player.disconnect', {id:socket.id});

	});

});

http.listen(3000, function(){
  console.log('joo pere');
});