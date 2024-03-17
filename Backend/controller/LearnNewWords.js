const OpenAI = require("openai");
const messageModel = require("../modal/Message");
const { v4: uuidv4 } = require('uuid');

class LearnNewWords{
  static getSomeNewWords=async(req,res)=>{
    const { email } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });
    try{
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Proivde me 5 English words in fromat of word then hyphen then it's meaning " }],
            model: "gpt-3.5-turbo",
          });
          const messageRecieved = chatCompletion.choices[0].message["content"];
          console.log(messageRecieved);
          return res.status(200).json({ data: messageRecieved });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred" });
    }
  }

  static getStory=async(req,res)=>{
    const { email,words } = req.body;
    console.log(words);
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });
    try{
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Provide an story using the words ${words} it should be short and consise and meaningful and quite thril, movtivating, innovative` }],
            model: "gpt-3.5-turbo",
          });
          const messageRecieved = chatCompletion.choices[0].message["content"];
          console.log(messageRecieved);
          return res.status(200).json({data: messageRecieved });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred" });
    }
  }

  static getExcercise=async(req,res)=>{
    const { email,words } = req.body;
    console.log(words);
    const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });
    try{
      // Provide minimum of 25 and maximum of 30 fill ups question. 
      //        Fill in the blank with the most appropriate word and those answer can
      //         be among ${words} 
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user",
             content: `
             Can you provide 25 to 30 question of in the format of fill in the blank and their answer must be anyone from ${words} and the answer
             as well but question and answer be in key value pair 
             Can you send all these question, answer in an array format so that it's become easy to parse 
              ` }],
            model: "gpt-3.5-turbo",
          });
          const messageRecieved = chatCompletion.choices[0].message["content"];
          console.log(messageRecieved);
          return res.status(200).json({data: messageRecieved });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred" });
    }
  }
}

module.exports=LearnNewWords;