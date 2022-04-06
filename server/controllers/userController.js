const { ObjectId } = require('mongodb');
const User = require('../model/userModel.js');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/chat";
const bcrypt = require('bcrypt');  
module.exports.register = async(req, res, next) =>{
    try{
    const {username, email, password} = req.body
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
    return res.json({msg: "Username already used", status: false});
    const emailCheck = await User.findOne({email});
    if(emailCheck)
    return res.json({msg: "Email already used", status: false});
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username,
        password: hashedPassword,
    });
    delete user.password;
    return res.json({status: true, user})
   }
   catch(e){
    next(e)
   }
}
module.exports.login = async(req, res, next) =>{
    const bcrypt = require('bcrypt');  
        try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.json({msg: "incorrect username", status: false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({msg: "incorrect password", status: false});
        }
        delete user.password;
        return res.json({status: true, user})
       }
       catch(e){
        next(e)
       }
    }
    module.exports.setAvatar = async(req,res,next)=>{
        try{
            const userId = req.params.id;
            const avatarImage = req.body.image;
            var pos = avatarImage.lastIndexOf("\\");
            const userData = await User.findByIdAndUpdate(userId, {
                isAvatarImageSet: true,
                avatarImage: avatarImage.substr(pos+1, avatarImage.length)
            })
            return res.json({
                isSet: userData.isAvatarImageSet,
                image: userData.avatarImage
            })
        }catch(err){
            next(err)
        }
    }
    module.exports.allusers = async(req,res,next)=>{
        try{
            MongoClient.connect(url, (err, db)=>{
                var col = db.db("chat").collection("users");
                var user = col.find({}).toArray((err, result)=>{
                    return res.json({the: result})
                })
            })
        }catch(err){
            next(err)
        }
    }