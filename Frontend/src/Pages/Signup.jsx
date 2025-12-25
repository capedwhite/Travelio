import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../api/axios.js";
function SignupPage(){
    const [username,setUsername]=useState("")
     const [email, setEmail] = useState("");
    const [password,setPassword]=useState("")
    const [retype,setRetype] = useState("");
    return (
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-[url(/images/SignupBg.png)] md:bg-contain md:bg-no-repeat  md:bg-bottom  opacity-30 md:opacity-100 lg-bg-cover"></div>

      <div className="relative z-10 bg-white w-[90%] md:w-[80%] lg:w-[60%] max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        <div className="w-full p-6 sm:p-10 flex flex-col md:items-end lg:items-end ">
          <h1 className="text-[#3ab19d] font-semibold text-3xl sm:text-4xl lg:text-5xl mb-3">
           Join Travelio Community
          </h1>

          <p className="text-gray-500 mb-8">
            Let’s wrap it in a package just for you
          </p>

          <div className="flex flex-col md:w-[50%] ">
            <label className="text-gray-900 mb-2">Username</label>
            <input
            placeholder="Enter your username"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="text-gray-900 mb-2 mt-4">Email</label>
            <input
            placeholder="Enter your email"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-gray-900 mb-2 mt-4">Password</label>
            <input
            placeholder="Enter your password"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="text-gray-900 mb-2 mt-4">Re-enter Password</label>
            <input
            placeholder="Re-type your password"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="password"
              value={retype}
              onChange={(e) => setRetype(e.target.value)}
            />
            <button className="w-full h-[50px] rounded-lg bg-[#3ab19d] text-white mt-5 hover:opacity-70 transition">
           Sign-In
            </button>

            <div className="flex gap-2 mt-4 text-sm">
              <span>Already have an account?</span>
              <Link to="/login">
                <span className="font-medium text-[#369d8c] hover:underline">
                 Log in
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute bottom-10 right-100 pl-8">
          <img
            src="/images/SigninLogonew.png"
            alt="Travel illustration"
            className="w-[60%]"
          />
        </div>
      </div>
    </div>

  )
}

export default SignupPage