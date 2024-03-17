const OpenAI = require("openai");
const messageModel = require("../modal/Message");
const { v4: uuidv4 } = require('uuid');



class SpeakwithAi{

  static getChatResponse=async(req,res)=>{
    const { email,resFromUser } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });
    try{
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Start the chat by asking how are you or how was your day and feels them like you are 
            a real person not an ai ${resFromUser}` }],
            model: "gpt-3.5-turbo",
          });
          const messageRecieved = chatCompletion.choices[0].message["content"];
          console.log(messageRecieved);
          // io.emit('aiResponse', { data: messageRecieved });
          return res.status(200).json({ data: messageRecieved });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred" });
    }
  }
}

module.exports=SpeakwithAi;