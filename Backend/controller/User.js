const userModal = require('../modal/User');
const bcrypt = require('bcrypt');
class UserController {

    static Login = async (req, res) => {
        const data = req.body;
        const userName = data.userName;
        const password = data.password;
        
        try {
            const userInDatabase = await userModal.findOne({ userName: userName });
           
            if (userInDatabase != null) {
                const isValidPassword=await bcrypt.compare(password,userInDatabase.password);
                if (isValidPassword) {
                    const email=userInDatabase.email;
                    const userInformation={
                        userName:userName,
                        userEmail:email
                    }
                    return res.status(200).json({message:"Login Successfull",user:userInformation});
                }
                return res.status(200).json({message:"Password not matched"});
            }
            return res.status(200).json({message:"UserName not exist"});
        } catch (err) {
            console.log("errr in login ", err);
            return res.status(403).json({message:"Internal server error"});
        }
    }


    static Register = async (req, res) => {
        try {
            const data = await req.body;
            const email = data.email;
            const userName = data.userName;
            const password = data.password;
            const isUserForgetDetail=data.userForgetUserNamePasword;
            const hashedPassword=await bcrypt.hash(password,10);
            const userWithEmail = await userModal.findOne({ email: email });
            if (userWithEmail != null && !isUserForgetDetail) {
                return res.status(200).json("Email Already Exist");
            }
            if(userWithEmail!=null && isUserForgetDetail){
                await userWithEmail.updateOne({
                    userName:userName,
                    password:hashedPassword
                });
                return res.status(200).json("UserName and Password Updated!")
            }
            const userWithUserName = await userModal.findOne({ userName: userName });
            if (userWithUserName != null) {
                return res.status(200).json("Username Already Exist");
            }
            const newUser = userModal({
                userName: userName,
                email: email,
                password: hashedPassword
            });
            await newUser.save();
            console.log(data);
            return res.status(200).json("New user save Successfully");

        } catch (err) {
            console.log(err);
            return res.status(403).json("Internal server error");
        }
    }



}

module.exports = UserController;






