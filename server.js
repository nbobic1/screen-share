const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');

const bodyParser = require('body-parser');
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'/public')));
const server=http.createServer(app);
const io=socketio(server);

io.on('connection',(socket)=>{
    //socket.emit('message','iddd');//ovo samo ¸1
   // socket.broadcast.emit('message','iddd');//ovov svima
   // console.log("nma ba2222b");
   // socket.on('chatMessage',(msg)=>{console.log("chatMessage"+msg);});
   // socket.on('disconnect',()=>{io.emit('message','izadao user');});
    //socket.emit('offer','moja  ponuda');
    //socket.emit('answer','ne odg');
    socket.on('ice1',(offer)=>{
        socket.broadcast.emit('ice1',offer);//ovo samo ¸1
        console.log("ice1");
    });
    socket.on('ice',(offer)=>{
        socket.broadcast.emit('ice',offer);//ovo samo ¸1
        console.log("ice");
    });
    socket.on('offer',(offer)=>{
        socket.broadcast.emit('offer',offer);//ovo samo ¸1
        console.log("offer");
    });
    socket.on('answer',(answer)=>{
        socket.broadcast.emit('answer',answer);//ovov svima
        console.log("answer");
    });
    socket.on('mouseIncomeing',(coordinates)=>{
        socket.broadcast.emit('mouseSend',coordinates);
        console.log("mouse incomeing");
    });
});

/*
server.on('connection',(socket)=>{
    console.log("nma bab");
});
*/
server.listen(3000,()=>{console.log("slusam port");});
