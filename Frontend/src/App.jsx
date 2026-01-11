
import './App.css'
import { useAuth } from './context/authContext';
import PrivateRoutes from './routes/privateroutes';
import Publicroutes from './routes/publicroutes';


function App() {
  const { user } = useAuth();
  return(
user? <PrivateRoutes/>:<Publicroutes/>
  )
}
export default App
