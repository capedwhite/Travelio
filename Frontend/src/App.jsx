import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LoginPage from './Pages/Login.jsx'
import SignupPage from "./Pages/Signup.jsx";
import ForgetPassword from "./Pages/Forgetpassword.jsx";
function App() {
  return(
<BrowserRouter>
  {/* // <HomePage/> */}
<Routes >
  <Route path="/login" element={<LoginPage></LoginPage>}></Route>
    <Route path="/Signup" element={<SignupPage></SignupPage>}></Route>
    <Route path="/explorepackges" element={<h1>packages</h1>}></Route>
    <Route path="/forgetpassword" element={<ForgetPassword></ForgetPassword>}></Route>
</Routes>
  
  </BrowserRouter>
  )
}


export default App
