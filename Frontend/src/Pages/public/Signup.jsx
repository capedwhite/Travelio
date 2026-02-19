import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../api/axios.js";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";
import { signupSchema } from "./schema/signupschema.jsx";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: zodResolver(signupSchema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [eyepass, setEyepass] = useState("");
  const [eyeretype, setEyeretype] = useState("");
  const onsubmit = async (data) => {
    try {
      const res = await api.post("/auth/signup", data);
      await login(res.data.token);
      toast.success(res.data.message);
      navigate("/explorepackages");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url(/images/SignupBg.png)] md:bg-contain md:bg-no-repeat  md:bg-bottom  opacity-30 md:opacity-100 lg-bg-cover"></div>

        <div className="relative bg-white w-[90%] md:w-[75%] lg:w-[55%] max-w-4xl rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-[slideUp_0.4s_ease-out]">
          <div className="w-full p-5 sm:p-6 sm:pb-4 sm:pr-10 flex flex-col md:items-end lg:items-end ">
            <h1 className="text-[#3ab19d] font-semibold text-2xl sm:text-3xl lg:text-4xl mb-2">
              Join Travelio Community
            </h1>

            <p className="text-gray-500 text-sm mb-3">
              Let’s wrap it in a package just for you
            </p>

            <div className="flex flex-col md:w-[50%] z-1 ">
              <label className="text-gray-900 text-sm mb-1">Username</label>
              <input
                placeholder="Enter your username"
                className="h-[40px] text-sm border border-gray-400 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
                type="text"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-[red] text-xs">{errors.username.message}</p>
              )}
              <label className="text-gray-900 text-sm mb-1 mt-2">Email</label>
              <input
                placeholder="Enter your email"
                className="h-[40px] text-sm border border-gray-400 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
                type="text"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[red] text-xs">{errors.email.message}</p>
              )}
              <label className="text-gray-900 text-sm mb-1 mt-2">Number</label>
              <input
                placeholder="Enter your Phone Number"
                max={10}
                className="h-[40px] text-sm border border-gray-400 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
                type="text"
                {...register("number")}
              />
              {errors.number && (
                <p className="text-[red] text-xs">{errors.number.message}</p>
              )}
              <div className="flex flex-col relative">
                <label className="text-gray-900 text-sm mb-1 mt-2">
                  Password
                </label>
                <input
                  placeholder="Enter your password"
                  className="h-[40px] text-sm border border-gray-400 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#3ab19d] "
                  type={eyepass ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-2 bottom-2"
                  onClick={() => setEyepass(!eyepass)}
                >
                  {!eyepass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="grey"
                      class="size-5"
                    >
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path
                        fill-rule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="grey"
                      class="size-5"
                    >
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[red] text-xs">{errors.password.message}</p>
              )}
              <div className="flex flex-col relative">
                <label className="text-gray-900 text-sm mb-1 mt-2">
                  Re-enter Password
                </label>
                <input
                  placeholder="Re-type your password"
                  className="h-[40px] text-sm border border-gray-400 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#3ab19d]"
                  type={eyeretype ? "text" : "password"}
                  {...register("retype")}
                />
                <button
                  type="button"
                  className="absolute right-2 bottom-2"
                  onClick={() => setEyeretype(!eyeretype)}
                >
                  {!eyeretype ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="grey"
                      class="size-5"
                    >
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path
                        fill-rule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="grey"
                      class="size-5"
                    >
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.retype && (
                <p className="text-[red] text-xs">{errors.retype.message}</p>
              )}
              <button className="w-full h-[40px] rounded-lg bg-[#3ab19d] text-white text-sm mt-4 hover:opacity-70 transition">
                Sign-In
              </button>

              <div className="flex gap-2 mt-3 text-sm">
                <span>Already have an account?</span>
                <Link to="/login">
                  <span className="font-medium text-[#369d8c] hover:underline">
                    Log in
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block  absolute bottom-10 right-100 pl-8">
            <img
              src="/images/SigninLogonew.png"
              alt="Travel illustration"
              className="w-[60%]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
