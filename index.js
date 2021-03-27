var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3100});

wss.on('connection', (ws) => {
    console.log('connected')
    ws.on('message', (message) => {
        message = JSON.parse(message);
        for(var key in message){
            // console.log(key, message[key]);
        }
    });
    setInterval(function(){
        var position = [Math.random()*100, Math.random()*100];
        position = JSON.stringify(position);
        ws.send(position);
        console.log(position);
    }, 400)
});