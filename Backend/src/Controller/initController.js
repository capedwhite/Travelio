const init = async(req,res)=>{
  try {
    console.log("init api hititng")
    console.log(req.user)
    const userdata = req.user.dataValues
    console.log(userdata)
    res.status(200).send({data:userdata,message:"sucessfully fetched user data"})
  } catch (error) {
    res.status(500).send({message:error.message})
  }
}
export default init