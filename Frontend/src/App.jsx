
import './App.css'
import PrivateRoutes from './routes/privateroutes';
import Publicroutes from './routes/publicroutes';


function App() {
  const token = localStorage.getItem("authtoken");
  console.log(token)
  return(
token? <PrivateRoutes/>:<Publicroutes/>
  )
}
export default App
