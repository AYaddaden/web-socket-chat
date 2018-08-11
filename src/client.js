/**
 * Client side implemented using HTML 5 webSockets
 */
const sendMessage = document.getElementById("sendMessage"); //button to send the message
let inputMessage = document.getElementById("inputMessage"); // input field where the message is displayed
const viewMessages = document.getElementById("view-messages"); // chat room side where the previous messages are displayed
const status = document.getElementById("status"); // status span: connecting, connected, error messages


//if user is running mozilla firefox then use built-in websocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

//check if browser supports webSockets
if (!window.WebSocket){
    //display message then disable sending messages
    status.innerText = `Sorry! Your browser doesn't support webSockets`;
    inputMessage.disabled = true;
    sendMessage.disabled = true;
    sendMessage.style.cursor = "not-allowed"; 
    
}

//the server is listenting on port 3000
const SOCKET_SERVER_PORT = 3000;

//create a new web socket connection to server
const connection = new WebSocket(`ws://localhost:${SOCKET_SERVER_PORT}/`);

//if connection is opened display message
connection.onopen = () =>{
    //socket is open, user can begin send messages
    status.innerText = `Enjoy chatting!`;
    
}


// handle message reception
connection.onmessage = (message) =>{
    //check if returned message is in JSON format and not damaged
    let json = new Object();
    /**
     * struture of the message json
     * {
     *      type: 'message',
     *      data: {
     *          text: recievedText
     *      }
     * }
     */
    try{
        json = JSON.parse(message.data);
        status.style.display = 'none';
    }catch(error){
        console.error(`Invalid JSON: ${message.data}`);
        return;
    }
   
    if (json.type === 'message'){
        let displayMessage = document.createElement('div');
        /**
         * TODO: make a difference between actual user and its interlocutor
         */

        displayMessage.className = 'message-item-left';
        displayMessage.innerText = json.data.text;
        viewMessages.appendChild(displayMessage);
    }
    
}


//handle connection errors
connection.onerror = (error) =>{
    console.error(error);
    status.style.display = '';
    status.innerText = `Sorry! There is a problem with your connection or server is down`;
}

//send the user message to the server [what a clever comment!]
const sendMessageToServer = () =>{
    if(!inputMessage.value) return;
    connection.send(inputMessage.value);
    inputMessage.value = '';
    //console.log("send");
}

// if submit message is clicked: send the message
sendMessage.onclick = function(e){
    sendMessageToServer();
}

// if enter key is hit when writing message in input text field: send the message
inputMessage.onkeydown = function(e){
    if (e.keyCode === 13)
    {
        sendMessageToServer();
        //console.log("hit enter");
    }
}