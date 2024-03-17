const {Server}=require('socket.io');
const express = require('express');
const http=require("http");
// const app=require('./app');
const app = express();
const server=http.createServer(app);


const io=new Server(server,{
    // cors:{
    //     origin:"http://localhost:3000",
    //     methods:["GET","POST"]
    // }
});

io.on('connection',(socket)=>{
    console.log("A new user is connected",socket.id);
    // socket.on("send messsage",(data)=>{
    //     console.log(data);
    // })
})


module.exports=io;