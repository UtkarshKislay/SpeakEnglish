const OpenAI = require("openai");
const messageModel = require("../modal/Message");
const { v4: uuidv4 } = require('uuid');

class OpenAiChat {

  static initializeChatResponseWithUser = async (req, res) => {
    try {
      const { email } = req.body;
      const prevChat = await messageModel.find({
        $or: [{ email: email, senderAdd: "User" }, { email: email, senderAdd: "openAi" }]
      })
      .select('-_id uniqueId message senderAdd createdAt')
      .sort({createdAt:1});
      console.log(prevChat);
      return res.status(200).json({ message: "Initialize Chat", data: prevChat });

    } catch (err) {
      return res.status(500).json({ error: "An error occurred" });
    }
  }



  static chatResponse = async (req, res) => {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY_OLD });
      const { email, message,uniqueId,createdAt } = req.body;
      console.log("email: ", email," ",message);
      const messageModelStruct = {
        uniqueId:uniqueId,
        email: email,
        senderAdd: "User",
        message: message,
        createdAt: createdAt
      }
      console.log(messageModelStruct);
      await messageModel(messageModelStruct).save();
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: message
        //  +" "+process.env.SECRET_COMMAND
         }],
        model: "gpt-3.5-turbo",
      });
      const messageRecieved = chatCompletion.choices[0].message["content"];
      console.log(messageRecieved);
      const messageModelStructByOpenAi = {
        uniqueId:uuidv4(),
        email: email,
        senderAdd: "openAi",
        message: messageRecieved,
        createdAt: new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'})
      }
      await messageModel(messageModelStructByOpenAi).save();
      const dataToSend = { ...messageModelStructByOpenAi };
      delete dataToSend.email;
      console.log(dataToSend);
      return res.status(200).json({ message: "Query execute Successfully", data: dataToSend });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
}

module.exports = OpenAiChat;

