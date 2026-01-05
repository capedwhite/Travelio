
import { Package } from "../Model/packageModel.js";

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
    const coverImage = req.files?.coverImage?.[0]?.path.replace(/\\/g, '/') || null;
    const hotelImages = req.files?.hotelImages?.map(file => file.path.replace(/\\/g, '/'))|| []
    const touristImages = req.files?.touristImages?.map(file => file.path.replace(/\\/g, '/'))|| []

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
        hotels: hotelImages,
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
