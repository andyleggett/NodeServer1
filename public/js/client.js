(function($, io){

	var messageBox = $("#messages");
	var messages = [];
	var ws;

	$("#connect-button").click(function(e){
		e.preventDefault();

		connectSocket();
	});

	function connectSocket(){
		addMessage("connecting...");

		ws = io.connect("ws://mysterious-cliffs-7372.herokuapp.com:5000");

		var counter = 1;
		var interval = setInterval(function(){
			ws.emit("message", "instruction-" + counter++);
		}, 250
		);

		ws.on('connected', function(data){
			addMessage("connected!");
		});

		ws.on('stop', function(){
			clearInterval(interval);
			addMessage("complete!");
		});

		ws.on('message', function(data){
			console.log(data.message);
			addMessage(data.message);
		});
	}

	function addMessage(message){
		messages.push(message);
		messageBox[0].innerHTML +=  message + "<br/>";
	}

})(jQuery, io);