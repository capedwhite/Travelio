
import './App.css'
import { useAuth } from './context/authContext';
import PrivateRoutes from './routes/privateroutes';
import Publicroutes from './routes/publicroutes';


function App() {
  const { user,loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? <PrivateRoutes /> : <Publicroutes />;
}
export default App
