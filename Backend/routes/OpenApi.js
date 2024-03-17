const express=require('express');
const router=express.Router();



const openAiChat =require('../controller/openAiController');
const openAiLearnWords=require('../controller/LearnNewWords');
const SpeakWithAi=require('../controller/chatWithAi');

router.post('/openai/initializeChatResponse',openAiChat.initializeChatResponseWithUser);
router.post('/openai/chat',openAiChat.chatResponse);
router.post('/openai/learnWords',openAiLearnWords.getSomeNewWords);
router.post('/openai/getStory',openAiLearnWords.getStory);
router.post('/openai/getExcercise',openAiLearnWords.getExcercise);
router.post('/openai/speakWithAi',SpeakWithAi.getChatResponse);
module.exports=router;


