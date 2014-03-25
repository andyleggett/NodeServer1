var express = require("express"),
app = express(),
server = require("http").createServer(app),
io = require("socket.io").listen(server),
net = require("net"),
renderSocket = net.Socket(),
port = Number(process.env.PORT || 5000);

//set up socket to renderer and connect
renderSocket.on("error", function(error){

	console.log(error);
	io.sockets.emit("message", {message: error.toString()});
});

renderSocket.on("data", function(data){
	console.log(data);
	io.sockets.emit("message", {message: data.toString()});
});

renderSocket.connect(6100, function(){
	io.sockets.emit("message", {message: "renderer socket connected"});
});

// set up middleware and engine
app.use(express.logger());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//routes
app.get("/", function(req, res) {
  res.render("index.html");
});

//websocket events
io.sockets.on("connection", function(socket){

	socket.on("message", function(data){
		console.log(data);

		renderSocket.write(data.toString());

		if (data == "instruction set - 20"){
			console.log("stopping");
			socket.emit("stop");
		}
	});
});

//start http server listening
server.listen(port, function() {
  console.log("App listening on " + port);
});





