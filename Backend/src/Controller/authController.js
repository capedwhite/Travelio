import { User } from "../Model/userModel.js";

const login = async(req,res)=>{
    try{
const body = req.body;
if(body.username=null){
return res.status(401).send({message:"cannot leave email field empty"})
}
if(body.password=null){
    return res.status(401).send({message:"cannot leave password field empty"})
}
const user = User.findOne({
where:{username:body.username ,
    password:body.password}
})
if(user){
    res.status(200).send({data:user,message:"logged in sucessfully"})
}
}
catch(e){
    res.status(500).send({message:e.message})
}
}

const signUp = async(req,res)=>{
try{
    const body = req.body;
    if(!body.email||!body.password||!body.username||!body.number){
       return res.status(401).send({message:"Cannot leave fields empty"})
    }
    const userExists = User.findOne({where:{email:body.email}})
    if(userExists){
        return res.status(401).send({message:'user already exists in email'})
    }
    const usernameExists = User.findOne({Where:{username:body.username}})
    if(usernameExists){
        return res.status(401).send({message:"Username already in-use"})
    }
}
catch(e){
    res.status(500).send({message:e.message})
}
    
}

const getUser = async(req,res)=>{

}
export{login,signUp,getUser}