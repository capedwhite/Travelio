
import { Package } from "../Model/packageModel.js";
import { PackageRequest } from "../Model/requestModel.js";

export const createPackage = async (req, res) => {
  console.log("api hit for create package")
  try {
    const basicInfo = JSON.parse(req.body.basicInfo);
    const pricing = JSON.parse(req.body.pricing);
    const locations = JSON.parse(req.body.locations);
    const hotels = JSON.parse(req.body.hotels);
    const touristSpots = JSON.parse(req.body.touristSpots);
    const itinerary = JSON.parse(req.body.itinerary);
    const availability = JSON.parse(req.body.availability);
 let coverImage = null;
    let touristImages = [];
req.files.forEach(file => {
      if (file.fieldname === "coverImage") {
        coverImage = file.path.replace(/\\/g, "/");
      } else if (file.fieldname === "touristImages") {
        touristImages.push(file.path.replace(/\\/g, "/"));
      } else {

        const match = file.fieldname.match(/hotelImages\[(\d+)\]/);
        if (match) {
          const hotelIndex = Number(match[1]);
          if (!hotels[hotelIndex].hotelImages) hotels[hotelIndex].hotelImages = [];
          hotels[hotelIndex].hotelImages.push(file.path.replace(/\\/g, "/"));
        }
      }
    });
    const insertPackage = await Package.create({
      title: basicInfo.title,
      description: basicInfo.description,
      duration: basicInfo.duration,

      price: {
        originalPrice: pricing.originalPrice,
        discountedPrice: pricing.discountedPrice,
        currency: pricing.currency,
      },

      locations,
      hotels,
      
      touristSpots,
      itinerary,

      inclusions: availability.inclusion
        ? availability.inclusion.split("\n")
        : [],

      exclusions: availability.exclusion
        ? availability.exclusion.split("\n")
        : [],

      images: {
        coverImage,
        tourist: touristImages,
      },

      tags: [basicInfo.tag],

      seasonalDiscount: {
        isActive: Boolean(pricing.discountpercentage),
        label: pricing.label || null,
        percentage: Number(pricing.discountpercentage) || 0,
      },

      availability: {
        startDate: availability.startDate,
        endDate: availability.endDate,
        maxBookings: availability.maxBookings,
        currentBookings: 0,
      },

      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Successfully inserted vacation package",
      data: insertPackage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getPackage = async(req,res)=>{
  try {
      const packages = await Package.findAll()
      console.log(packages)
      res.status(200).send({data:packages,message:"sucessfully fetched all packages"})

  } catch (error) {
    console.log(error.message)
    res.status(500).send({message:error.message})
  }
}
export const getactivePackage = async(req,res)=>{
  try {
      const packages = await Package.findAll({where:{status:"Active"}})
      console.log(packages)
      res.status(200).send({data:packages,message:"sucessfully fetched all packages"})

  } catch (error) {
    console.log(error.message)
    res.status(500).send({message:error.message})
  }
}
export const deletePackage = async (req, res) => {
  try {
    console.log("delete api hitting");

    const { id } = req.params;

    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).send({ message: "Package not found" });
    }

    if (pkg.status === "Inactive") {
      return res.status(400).send({ message: "Package already inactive" });
    }

    pkg.status = "Inactive";
    await pkg.save();

    return res.status(200).send({
      message: "Package deleted successfully",
    });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
export const updatePackage = async (req, res) => {
  console.log("api hit for update package");
  try {
    const { id } = req.params; 

    
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }


    const basicInfo = req.body.basicInfo ? JSON.parse(req.body.basicInfo) : null;
    const pricing = req.body.pricing ? JSON.parse(req.body.pricing) : null;
    const locations = req.body.locations ? JSON.parse(req.body.locations) : null;
    const hotels = req.body.hotels ? JSON.parse(req.body.hotels) : null;
    const touristSpots = req.body.touristSpots ? JSON.parse(req.body.touristSpots) : null;
    const itinerary = req.body.itinerary ? JSON.parse(req.body.itinerary) : null;
    const availability = req.body.availability ? JSON.parse(req.body.availability) : null;

    let coverImage = null;
    let touristImages = [];
req.files.forEach(file => {
      if (file.fieldname === "coverImage") {
        coverImage = file.path.replace(/\\/g, "/");
      } else if (file.fieldname === "touristImages") {
        touristImages.push(file.path.replace(/\\/g, "/"));
      } else {

        const match = file.fieldname.match(/hotelImages\[(\d+)\]/);
        if (match) {
          const hotelIndex = Number(match[1]);
          if (!hotels[hotelIndex].hotelImages) hotels[hotelIndex].hotelImages = [];
          hotels[hotelIndex].hotelImages.push(file.path.replace(/\\/g, "/"));
        }
      }
    });

    const updateData = {};

    if (basicInfo) {
      if (basicInfo.title) updateData.title = basicInfo.title;
      if (basicInfo.description) updateData.description = basicInfo.description;
      if (basicInfo.duration) updateData.duration = basicInfo.duration;
      if (basicInfo.tag) updateData.tags = [basicInfo.tag];
    }

    if (pricing) {
      updateData.price = {
        originalPrice: pricing.originalPrice || pkg.price.originalPrice,
        discountedPrice: pricing.discountedPrice || pkg.price.discountedPrice,
        currency: pricing.currency || pkg.price.currency,
      };

      updateData.seasonalDiscount = {
        isActive: Boolean(pricing.discountpercentage),
        label: pricing.label || null,
        percentage: Number(pricing.discountpercentage) || 0,
      };
    }

    if (locations) updateData.locations = locations;

    if (hotels) {hotels.forEach((hotel, index) => {
    const existingHotelImages = pkg.hotels[index]?.hotelImages || [];
    const newHotelImages = hotel.hotelImages || [];
    hotel.hotelImages = [...existingHotelImages, ...newHotelImages];
  })};
  updateData.hotels = hotels;
    if (touristSpots) updateData.touristSpots = touristSpots;
    if (itinerary) updateData.itinerary = itinerary;

    if (availability) {
      updateData.inclusions = availability.inclusion
        ? availability.inclusion.split("\n")
        : pkg.inclusions;

      updateData.exclusions = availability.exclusion
        ? availability.exclusion.split("\n")
        : pkg.exclusions;

      updateData.availability = {
        startDate: availability.startDate || pkg.availability.startDate,
        endDate: availability.endDate || pkg.availability.endDate,
        maxBookings: availability.maxBookings || pkg.availability.maxBookings,
        currentBookings: pkg.availability.currentBookings, 
      };
    }

    updateData.images = {
 coverImage: coverImage || pkg.images.coverImage,
  tourist: [...(pkg.images.tourist || []), ...touristImages],
    };

    await pkg.update(updateData);

    res.status(200).json({
      message: "Package updated successfully",
      data: pkg,
    });
    await pkg.reload();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
 export const getPackageByid = async(req,res)=>{
  try{
    console.log("getpackage api hiting")
    const {id} = req.params
    const packages = await Package.findOne({where:{id:id}})
    console.log("packages are",packages)
    res.status(200).send({data:packages,message:"fetched package by id sucessfully"})
  }
  catch(error){
    res.status(500).send({message:error.messaege})
  }
 }

export const createPackageRequest = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    const { destination, duration, travelers, budget, travelDate, specialRequests } = req.body;

    // Validate required fields
    if (!destination || !duration || !travelers || !budget || !travelDate) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const packageRequest = await PackageRequest.create({
      userId,
      destination,
      duration,
      travelers: Number(travelers),
      budget,
      travelDate,
      specialRequests: specialRequests || null,
    });

    res.status(201).send({
      message: "Package request submitted successfully! We'll get back to you soon.",
      data: packageRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};