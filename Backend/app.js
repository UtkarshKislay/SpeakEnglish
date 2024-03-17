const express = require('express');
const http=require("http");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const {Server}=require('socket.io');
const OpenAI = require("openai");
const session = require("express-session");
const app = express();
const server=http.createServer(app);
dotenv.config();
const cors = require('cors');
const userRoute = require('./routes/User');
const openAiRoute = require('./routes/OpenApi');
const bodyParser = require('body-parser');
const databaseConnect = require('./DataBase/DbConnect');
const MongoStore = require("connect-mongo")(session);
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
  });
const corsOption = {
  origin: ['http://localhost:3000','http://localhost:3000/login'],
  methods: ["GET"],
}
app.use(cors(corsOption));
app.use(cors());

require("./Config/passport");
const passport = require("passport");
databaseConnect();

app.use('/', userRoute);
app.use('/', openAiRoute);
const UserName=process.env.DataBase_UserName;
const PassWord=process.env.DataBase_Password;
const DBName=process.env.DataBase_Name;
// const mongoStore = new MongoStore({
//     mongooseConnection: mongoose.connection,
//   });
console.log(MongoStore);
app.use(
    session({
      secret: "mysecretkey",
      resave: false,
      saveUninitialized: true,
      store:  new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use("/*", (req, res) => {
    res.redirect("http://localhost:3000/");
});


const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:['GET','POST']
    }
});

io.on('connection',(socket)=>{
    console.log("A new user is connected",socket.id);
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });

    socket.on('userMessage', async (message) => {
        let prevRes=[];
        message.map((msg) => (
            prevRes.push(
                `${msg.role}:${msg.content}`
            )
        ));
        // console.log(prevRes);
        const prompt=`If there are previous response you have to analyze how the
        chats was gone so far and based on that talk the relvent thing and if the previous chat 
        is empty talk by asking how are your or how was your day 
        So, the previous response are here: ${prevRes}.
        Also don't give very long reponses , keep it short and also give time to users so that they got chance to talk
        it will be more interactive.`;
        // console.log(prompt);
        const prompt2=`Hello, I am a developer who used opena ai api so that I can creat an ai chat bot which help
        students or anyone in english speaking So, I will provide the responses of the chat been so far and if the response are empty 
        that means chat not started till so you can start by aksing how are your or how was your day.
        Also give more chances to speak the user.
        Also don't tell the end user that you are an ai, response like you are an actual user and behave  friendly .
        So the previous responses are here:${prevRes}.
        Also  reply with reponse don't any other thing like "Ai:" or "User:".
        Also if it possible try to end your reponse with a question so that user get a view what he/she has to reponse
        Also on essential topic give response in detail`;
        try {
            // console.log(message);
            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: "user", content:prompt2 }],
                model: "gpt-3.5-turbo",
            });
            const messageReceived = chatCompletion.choices[0].message["content"];
            console.log(messageReceived);
            socket.emit('aiResponse', messageReceived);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
})

server.listen(PORT, (req, res) => {
    console.log(`Server is running on ${PORT}`);
})










