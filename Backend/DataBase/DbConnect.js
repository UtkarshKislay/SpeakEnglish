const mongoose=require('mongoose');
const UserName=process.env.DataBase_UserName;
const PassWord=process.env.DataBase_Password;
const DBName=process.env.DataBase_Name;
const ConnectDB=async()=>{
    try{
        const conn= await mongoose.connect(
            `mongodb+srv://${UserName}:${PassWord}@cluster2.tusgmxo.mongodb.net/
            SpeakEnglish?retryWrites=true&w=majority`);
        console.log(conn.connection.host);
    }catch(err){
        console.log(err);
    }
} 

module.exports=ConnectDB;