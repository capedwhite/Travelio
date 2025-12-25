import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios.js"
function LoginPage(){
  const navigate = useNavigate()
    const logIn= ()=>{

        try {
            
        const res = api.post("/auth/login",{username:username,password:password})
        alert(res.message)
      navigate("/explore packages")
        } 
        catch (error) {
            console.log(error)
            alert(error.response?.data?.message)
        }
        
    }
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    return (
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-[url(/images/SignupBg.png)] md:bg-contain md:bg-no-repeat  md:bg-bottom  opacity-30 md:opacity-100 lg-bg-cover"></div>

      <div className="relative z-10 bg-white w-[90%] md:w-[80%] lg:w-[60%] max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        <div className="w-full  p-6 sm:p-10">
          <h1 className="text-[#3ab19d] font-semibold text-3xl sm:text-4xl lg:text-5xl mb-3">
            Welcome to Travelio
          </h1>

          <p className="text-gray-500 mb-8">
            The best stories begin with a passport and a plan
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

            <label className="text-gray-900 mb-2 mt-4">Password</label>
            <input
             placeholder="Enter your Password"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="self-end mt-2 text-sm text-gray-500 font-medium cursor-pointer hover:underline">
              Forgot Password?
            </p>

            <button className="w-full h-[50px] rounded-lg bg-[#3ab19d] text-white mt-5 hover:opacity-70 transition">
              Login
            </button>

            <button className="w-full h-[50px] rounded-lg border-2 border-[#3ab19d] text-[#3ab19d] mt-3 hover:bg-[#3ab19d] hover:text-white transition">
              Continue with Google
            </button>

            <div className="flex gap-2 mt-4 text-sm">
              <span>Don’t have an account?</span>
              <Link to="/signup">
                <span className="font-medium text-[#369d8c] hover:underline">
                  Sign up
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute bottom-10  left-100">
          <img
            src="/images/signuplogo.png"
            alt="Travel illustration"
            className="w-[110%] h-[100%]"
          />
        </div>

      </div>
    </div>
  )
}

export default LoginPage