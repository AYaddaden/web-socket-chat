/**
 * websocket server built upon a nodejs server
 */
const webSocketServer = require('websocket').server;
const http = require('http');


const WEB_SOCKET_PORT = 3000;

// array of clients connected to the server
let clients = [];

// create a node js server
const server = http.createServer(function(request,response){
    //left blank intentionnaly
    console.log('server started');
});

//start the server
server.listen(WEB_SOCKET_PORT);

// create a websocket server upon the node js server
const wsServer =  new webSocketServer({
    httpServer: server
});

//handle the requests comming from the clients
wsServer.on('request',function(request){
    //check request origin
    const connection = request.accept(null,request.origin);
    //add client connection to the array
    clients.push(connection);
    //handle message reception
    connection.on('message',function(message){
        //check if message is plain text not binary
        // in this example, only plain text is handled
        if (message.type === 'utf8'){
            //create an object with the message recieved by the user
            let obj = {
                text: message.utf8Data
            }
            // stringify the message
            let json = JSON.stringify({ type:'message', data: obj });
            //broadcast the message to all active users
            clients.map(clt => {
                clt.sendUTF(json);
                
            });
        }
    });

    // display message on server console when a user is disconnected
    // other behaviour in the future may be implemented
    connection.on('close', function(connection){
        console.log(`${connection.remoteAddress} disconnected`);
    });
});