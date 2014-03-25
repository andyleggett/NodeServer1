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

		ws = io.connect();

		ws.on('connect', function(){
			addMessage("connected!");

			ws.on('error', function(error){
				addMessage(error.toString());
			});

			ws.on('stop', function(){
				clearInterval(interval);
				addMessage("complete!");
			});

			ws.on('message', function(data){
				console.log(data.message);
				addMessage(data.message);
			});

			var counter = 1;

			var interval = setInterval(function(){
				ws.emit("message", "instruction set - " + counter++);
			}, 250);
		});

	}

	function addMessage(message){
		messages.push(message);
		messageBox[0].innerHTML +=  message + "<br/>";
	}

})(jQuery, io);