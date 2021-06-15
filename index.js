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
        if(message.initial){
            console.log('new player', message.uid);
            sockets[message.uid] = ws;
        }
        else{
            if(message.relation){
                for(var ii=0; ii<message.relation.length; ii++){
                    var user = message.relation[ii].uid;
                    var self = message.uid;
                    console.log(self)
                    if(sockets[user] && sockets[user].readyState === WebSocket.OPEN){
                        if(message.position){
                            var data = {
                                type:"move",
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
                        else if(message.share){
                            // console.log('share')
                            var data = {
                                type:"share",
                                from: message.uid,
                                share: message.share
                            }
                            try{
                                data = JSON.stringify(data);
                                to(user, data)
                            }
                            catch(e){
                
                            }
                        }
                        else if(message.emoji){
                            // console.log('emoji', message.emoji);
                            var data = {
                                type:"emoji",
                                from: message.uid,
                                emoji: message.emoji
                            }
                            try{
                                data = JSON.stringify(data);
                                to(user, data)
                            }
                            catch(e){
                
                            }
                        }
                        else if(message.makechat){
                            let data = {
                                type:"initChat",
                                from: message.from,
                                makechat: true,
                                id: message.id,
                                at: message.at
                            }
                            console.log("initChat", message.id);
                            openChat(self, user, data);
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
        }
    });
    // setInterval(function(){
    //     var position = [Math.random()*100, Math.random()*100];
    //     position = JSON.stringify(position);
    //     ws.send(position);
    //     // console.log(position);
    // }, 400)
});

function openChat(self, user, data){
    let counter = 30;
    let waitEnter = setInterval(function(){
        console.log(counter);
        let countdown = {
            type:"countdown",
            chat:data,
            counter:counter
        }
        countdown = JSON.stringify(countdown);
        to(user, countdown);
        to(self, countdown);
        counter --;
        if(counter < 0){
            let expire = {
                type:"expireChat",
                chat:data
            }
            expire = JSON.stringify(expire);
            to(user, expire);
            to(self, expire);
            clearInterval(waitEnter);
        }
    }, 1000)
  }