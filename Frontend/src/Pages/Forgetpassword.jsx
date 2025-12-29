
import { useState } from "react";
import { Link} from "react-router-dom";
export default function ForgetPassword(){

    const[email, setEmail] = useState("");
    const Resetbtn=async()=>{

if(!email){
    alert("please enter your email");
    return
}
    try{

      alert("Password reset link sent!");
    }
    catch(e){
console.log("error:",e)
    }
}

return(
<div className="bg-[#C8C8C8] flex items-center justify-center min-h-[100dvh] w-full overflow-hidden px-2 sm:px-10">
<div className="bg-white flex flex-col items-center justify-center p-15 w-full max-w-2xl shadow-[5px_5px_10px_grey] rounded-[11px]">
    <h1 className="text-2xl md:text-4xl font-semibold mt-7.5 mb-10 text-[#369d8c]"> Reset Password</h1>
    <div className="flex flex-col border-x-2 border-[#369d8c] px-6 w-85 sm:w-133">
<p className="mb-10 font-semibold w-60 sm:w-[900px]">Please enter the email address you want your reset link to be sent</p>


    <label className="mb-5">Email address:</label>
    <input type="email" className="w-[280px] h-[60px] sm:w-[480px] border border-black rounded-md p-10 "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
              />
             
              <button onClick={Resetbtn}
      className="sm:w-[480px] sm:h-[60px] rounded-[10px] bg-[#3ab19d] text-white mt-10 border-none flex items-center justify-center  w-[280px] h-[60px]"
    >
        Send Link
      </button>
        <Link to="/login" className="text-[#369d8c] font-semibold no-underline  mt-4 self-center">Back to Login</Link>
         </div>
</div>
</div>
)
}