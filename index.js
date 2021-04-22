const WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({port: process.env.PORT || 3100});

const sockets = {};

function to(user, data) {
    if(sockets[user] && sockets[user].readyState === WebSocket.OPEN)
        sockets[user].send(data);
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message);
        // console.log(message);
        if(message.initial){
            console.log('new player');
            sockets[message.uid] = ws;
        }
        else{
            if(message.relation){
                for(var ii=0; ii<message.relation.length; ii++){
                    var user = message.relation[ii].uid;
                    if(sockets[user] && sockets[user].readyState === WebSocket.OPEN){
                        // console.log('gogo')
                        var data = {
                            from: message.uid,
                            position: message.position
                        }
                        try{
                            data = JSON.stringify(data);
                            to(user, data)
                        }
                        catch(e){
            
                        }
                    }
                }
            }
        }
        //dev only
        // if(message.position){
        //     console.log(message);
        //     var fakedata = {
        //         from: message.uid,
        //         position: [message.position[0]+10, message.position[1]+10]
        //     }
        //     fakedata = JSON.stringify(fakedata);
        //     to(message.uid, fakedata);
        // }

        // else{
        //     data = {

        //     }
        //     to(message.partner, data);
        // }
        // for(var key in message){
        //     // console.log(key, message[key]);
        // }
    });
    // setInterval(function(){
    //     var position = [Math.random()*100, Math.random()*100];
    //     position = JSON.stringify(position);
    //     ws.send(position);
    //     // console.log(position);
    // }, 400)
});