import z from "zod";

export const bookingSchema = z.object({
    fullname:z.string().nonempty("full name cannot be empty"),
    email:z.string().min(1,"Email cannot be empty").max(50,"Email cannot be that long"),
    phone:z.string().nonempty("number cannot be empty"),
    travelers:z.string().nonempty("Travelors cannot be empty"),
    date:z.string().nonempty("date cannot be empty")


})
