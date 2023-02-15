/*const http=require('http');
const server=http.createServer(function(req, res){

  res.writeHead(200,{'Content-Type':'text/plain'});
  if(req.url=="/sum")
    res.write('helellee');
    else
    res.write("nista "+req.url);

    res.end("hejjjj");
  
  });

server.on('connection',(socket)=>{
console.log("usli smo00= ");
});

//server.listen(3000,'0.0.0.0',function (error){
  server.listen(3000,'127.0.0.1',function (error){
if(error)
{
    console.log("ne valja "+error);
}
else
console.log("dobof je");
});
console.log("listening to 3000 ",server.address());
//pristupam mu preko adrese u ethernet adapter ethernet
*/
var express = require('express');
var app=express();
var server=app.listen(4000,'127.0.0.1',function(){
  console.log("listenin 4000");
});
app.use(express.static('sss'));