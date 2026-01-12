import Bargain from "../Model/bargainModel.js"
import { Booking } from "../Model/bookingModel.js"
import { Package } from "../Model/packageModel.js"
import { User } from "../Model/userModel.js"

export const bookpackage=async(req,res)=>{

    console.log("booking package api is being called")
    try {
            const userid = req.user.id
            console.log(userid)
        console.log(req.body)
          const {fullname,email,phone,travelers,date,packageid}=req.body
    if(!fullname || !email || !phone || !travelers || !date ){
        return res.status(500).send({message:"cannot leave any empty fields"})
    }
    const book = await Booking.create({
packageId:packageid,
Fullname:fullname,
Email:email,
Phone:phone,
Travelers:travelers,
Date:date,
userId:userid,
    })
    console.log(book)
    res.status(200).send({data:book,message:"created booking sucessfully"})
}
    catch (error) {
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
}

export const bargain = async(req,res)=>{
    try{
        const userid = req.user.id
        const {offerprice,offerdate,notes,packageid}=req.body
        if(!offerprice || !offerdate || !notes || !packageid){
           return res.status(500).send({message:"cannot leave any empty fields"})
        }
        const bargaining = await Bargain.create({
            packageId:packageid,
            offerprice,
            offerdate,
            notes,
            userId:userid
        })
res.status(200).send({data:bargaining,message:"sucessfully submitted bargain request"})
    }
    catch(error){
res.status(500).send({message:error.message})
    }
}

export const getAllbookings = async(req,res)=>{
    console.log("api hitting")
    try {
        const getbookings = await Package.findAll({include:[{model:Booking,include:[{model:User}]}]})
        console.log(getbookings)
        res.status(200).send({data:getbookings,message:"sucessfully fetched all bookings"})
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}

export const getallbargains = async(req,res)=>{
    console.log("api hit for bargain")
    try {
        const getbargains = await Package.findAll({include:[{model:Bargain,include:[{model:User}]}]})
        console.log(getallbargains)
        res.status(200).send({data:getbargains,message:"sucessfully fetched the bargain"})
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}