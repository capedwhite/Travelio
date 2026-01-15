import Bargain from "../Model/bargainModel.js"
import { Booking } from "../Model/bookingModel.js"
import { Package } from "../Model/packageModel.js"
import { User } from "../Model/userModel.js"

export const bookpackage = async (req, res) => {
  console.log("booking package api is being called");

  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { fullname, email, phone, travelers, date, packageid } = req.body;

    if (!fullname || !email || !phone || !travelers || !date || !packageid) {
      await transaction.rollback();
      return res.status(400).send({ message: "All fields are required" });
    }

    const pkg = await Package.findOne({
      where: { id: packageid },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!pkg) {
      await transaction.rollback();
      return res.status(404).send({ message: "Package not found" });
    }

    const max = pkg.availability.maxBookings;
    const current = pkg.availability.currentBookings;
    const remaining = max - current;


    if (travelers > remaining) {
      await transaction.rollback();
      return res.status(400).send({
        message: `Only ${remaining} slots remaining`,
      });
    }

   
    pkg.availability.currentBookings += Number(travelers);

    await pkg.save({ transaction });

    const priceSnapshot = {
      originalPrice: pkg.price.originalPrice,
      discountedPrice: pkg.price.discountedPrice,
      currency: pkg.price.currency,
      perPerson: true,
      total:
        (pkg.price.discountedPrice ?? pkg.price.originalPrice) *
        Number(travelers),
    };

    const booking = await Booking.create(
      {
        packageId: packageid,
        Fullname: fullname,
        Email: email,
        Phone: phone,
        Travelers: travelers,
        Date: date,
        userId,
        price: priceSnapshot,
      },
      { transaction }
    );

  
    await transaction.commit();

    res.status(201).send({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

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