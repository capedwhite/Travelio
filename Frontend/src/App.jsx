import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LoginPage from './Pages/Login.jsx'
import SignupPage from "./Pages/Signup.jsx";
function App() {
  return(
<BrowserRouter>
  {/* // <HomePage/> */}
<Routes >
  <Route path="/login" element={<LoginPage></LoginPage>}></Route>
    <Route path="/Signup" element={<SignupPage></SignupPage>}></Route>
</Routes>
  
  </BrowserRouter>
  )
}


export default App
