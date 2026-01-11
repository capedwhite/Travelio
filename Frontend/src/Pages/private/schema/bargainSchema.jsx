import z from "zod";

export const bargainSchema = z.object({
offerprice:z.string().nonempty("offerprice cannot be empty"),
offerdate:z.string().nonempty("offerprice cannot be empty"),
notes:z.string().nonempty("offerprice cannot be empty")
})