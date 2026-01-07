import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"

import api from "../../api/axios.js"

function LoginPage(){
  
    const login= async()=>{
        try {
            
        const res = await api.post("/auth/login",{username:username,password:password})
        alert(res.data.message)
        localStorage.setItem("authtoken",res.data.token)
      navigate("/explorepackages")
  
        } 
        catch (error) {
            console.log(error)
            alert(error.response?.data?.message)
        }
        
    }
      const navigate = useNavigate();
 
    const [useparams] = useSearchParams()
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const[Error,setError]=useState("")
    const[eye,setEye]=useState("")
   
      useEffect(() => {
    const errorMsg = useparams.get("error");
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
    }
  }, [useparams]);
  
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google?prompt=select_account";
  };


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

          <div className="flex flex-col md:w-[50%] z-2 ">
            <label className="text-gray-900 mb-2">Username</label>
            <input
            placeholder="Enter your username"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
    <div className="flex flex-col relative">
            <label className="text-gray-900 mb-2 mt-4">Password</label>
            <input
             placeholder="Enter your Password"
              className="h-[50px] border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
              type={eye? "text":"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
 {Error && <p className="text-red-500 mt-2">{Error}</p>}
         <p className="self-end mt-2 text-sm text-gray-500 font-medium cursor-pointer hover:underline">
                <Link to="/forgetpassword">Forgot Password?</Link> 
            </p>
                <button type="button" className="absolute right-2 bottom-10" onClick={()=>setEye(!eye)}>
        {!eye?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
</svg>:<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
  <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
  <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
</svg>

}

  </button>
</div>

            <button className="w-full h-[50px] rounded-lg bg-[#3ab19d] text-white mt-5 hover:opacity-70 transition" onClick={login}>
              Login
            </button>

            <button className="w-full h-[50px] rounded-lg border-2 border-[#3ab19d] text-[#3ab19d] mt-3 hover:bg-[#3ab19d] hover:text-white transition" onClick={handleGoogleSignIn}>
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

        <div className="hidden md:block absolute bottom-10 -z-10 left-100">
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
  export const GoogleSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {

      localStorage.setItem("authToken", token);
      navigate("/explorepackges"); 
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Logging in...</p>;
};

export default LoginPage