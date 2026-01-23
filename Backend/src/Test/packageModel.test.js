const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const PackageMock = dbMock.define("Package", {
  id: 1,
  title: "pokhara package",
  description: "wow",

  price: {
    originalPrice: 23,
    discountedPrice: 12,
    currency: "INR",
  },

  duration: "4 weeks",

  locations: ["location1", "location2"],
  hotels: ["hotel 1", "hotel 2"],
  status: "Active",

  touristSpots: ["spot1", "spot2"],
  itinerary: ["day1", "day2"],

  inclusions: ["auhhdahwdd", "dwhduwahdawd"],
  exclusions: ["dawduiawdiaw", "dawuhdwa"],

  images: {
    coverImage: "/image.jpg",
    tourist: ["/image1.jpg"],
  },

  tags: ["Budget Friendly"],

  seasonalDiscount: {
    isActive: false,
    label: null,
    percentage: 0,
  },

  availability: {
    startDate: null,
    endDate: null,
    maxBookings: 50,
    currentBookings: 0,
  },

  isActive: true,
  createdBy: 1,
});

describe("Package Model", () => {
  it("it should create a package", async () => {
    const packages = await PackageMock.create({
      id: 1,
      title: "pokhara package",
      description: "wow",

      price: {
        originalPrice: 23,
        discountedPrice: 12,
        currency: "INR",
      },

      duration: "4 weeks",

      locations: ["location1", "location2"],
      hotels: ["hotel 1", "hotel 2"],
      status: "Active",

      touristSpots: ["spot1", "spot2"],
      itinerary: ["day1", "day2"],

      inclusions: ["auhhdahwdd", "dwhduwahdawd"],
      exclusions: ["dawduiawdiaw", "dawuhdwa"],

      images: {
        coverImage: "/image.jpg",
        tourist: ["/image1.jpg"],
      },

      tags: ["Budget Friendly"],

      seasonalDiscount: {
        isActive: false,
        label: null,
        percentage: 0,
      },

      availability: {
        startDate: null,
        endDate: null,
        maxBookings: 50,
        currentBookings: 0,
      },

      isActive: true,
      createdBy: 1,
    });
    expect(packages.title).toBe("pokhara package");
    expect(packages.description).toBe("wow");
    expect(packages.price.discountedPrice).toBe(12);
    expect(packages.price.originalPrice).toBe(23);
    expect(packages.price.currency).toBe("INR");
    expect(packages.duration).toBe("4 weeks");
    expect(packages.locations).toEqual(["location1", "location2"]);
    expect(packages.availability.maxBookings).toBe(50);
    expect(packages.availability.currentBookings).toBeLessThan(
      packages.availability.maxBookings,
    );
    expect(packages.isActive).toBe(true);
    expect(packages.status).toBe("Active");
    expect(packages.seasonalDiscount.isActive).toBe(false);
    expect(packages.seasonalDiscount.percentage).toBe(0);
  });
});
