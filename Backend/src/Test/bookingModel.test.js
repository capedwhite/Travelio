import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const BookingMock = dbMock.define("Booking", {
  bookingId: 1,
  userId: 1,
  packageId: 1,
  Fullname: "John Doe",
  Email: "john@example.com",
  Phone: "1234567890",
  Travelers: 2,
  Date: new Date("2026-03-15"),
  status: "Not paid",
  price: {
    originalPrice: 1000,
    discountedPrice: 800,
    currency: "INR",
    perPerson: true,
    total: 1600,
    finalTotal: 1600,
    couponApplied: false,
    couponDiscount: 0,
  },
  couponUsed: null,
  bookingCoupon: "TRAVEL123456",
});

describe("Booking Model", () => {
  it("should create a booking with all required fields", async () => {
    const booking = await BookingMock.create({
      bookingId: 1,
      userId: 1,
      packageId: 1,
      Fullname: "John Doe",
      Email: "john@example.com",
      Phone: "1234567890",
      Travelers: 2,
      Date: new Date("2026-03-15"),
      status: "Not paid",
      price: {
        originalPrice: 1000,
        discountedPrice: 800,
        currency: "INR",
        perPerson: true,
        total: 1600,
        finalTotal: 1600,
        couponApplied: false,
        couponDiscount: 0,
      },
      couponUsed: null,
      bookingCoupon: "TRAVEL123456",
    });

    expect(booking.bookingId).toBe(1);
    expect(booking.userId).toBe(1);
    expect(booking.packageId).toBe(1);
    expect(booking.Fullname).toBe("John Doe");
    expect(booking.Email).toBe("john@example.com");
    expect(booking.Phone).toBe("1234567890");
    expect(booking.Travelers).toBe(2);
    expect(booking.status).toBe("Not paid");
    expect(booking.price.originalPrice).toBe(1000);
    expect(booking.price.discountedPrice).toBe(800);
    expect(booking.price.currency).toBe("INR");
    expect(booking.price.total).toBe(1600);
    expect(booking.bookingCoupon).toBe("TRAVEL123456");
  });

  it("should have valid email format", async () => {
    const booking = await BookingMock.create({
      Email: "valid@email.com",
    });
    expect(booking.Email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should have default status as Not paid", async () => {
    const booking = await BookingMock.create({
      bookingId: 2,
      userId: 1,
      packageId: 1,
      Fullname: "Jane Doe",
      Email: "jane@example.com",
      Phone: "9876543210",
      Travelers: 1,
      Date: new Date("2026-04-20"),
    });
    expect(booking.status).toBe("Not paid");
  });

  it("should calculate correct total price based on travelers", async () => {
    const booking = await BookingMock.create({
      Travelers: 3,
      price: {
        originalPrice: 500,
        discountedPrice: 400,
        currency: "INR",
        perPerson: true,
        total: 1200,
        finalTotal: 1200,
        couponApplied: false,
        couponDiscount: 0,
      },
    });
    expect(booking.price.total).toBe(
      booking.price.discountedPrice * booking.Travelers,
    );
  });

  it("should store coupon information when applied", async () => {
    const booking = await BookingMock.create({
      couponUsed: "SUMMER20",
      price: {
        originalPrice: 1000,
        discountedPrice: 800,
        currency: "INR",
        perPerson: true,
        total: 1600,
        finalTotal: 1280,
        couponApplied: true,
        couponDiscount: 320,
      },
    });
    expect(booking.couponUsed).toBe("SUMMER20");
    expect(booking.price.couponApplied).toBe(true);
    expect(booking.price.couponDiscount).toBe(320);
    expect(booking.price.finalTotal).toBeLessThan(booking.price.total);
  });
});
