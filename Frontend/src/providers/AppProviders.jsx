import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/authContext";
import { LoadingProvider, useLoading } from "../context/loadingContext";
import {ClipLoader} from "react-spinners"
const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <GlobalLoader/>
        {children}
        <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toasterId="default"
  toastOptions={{

    className: '',
    duration: 5000,
    removeDelay: 1000,
    style: {
      background: '#eafae1',
      color: 'black',
      borderRadius:"12px"
    },

 
    success: {
      duration: 3000,
      iconTheme: {
        primary: 'green',
        secondary: 'white',
      },
    },
    error:{
        duration: 3000,
      iconTheme: {
        primary: 'red',
        secondary: 'white',
      },
          style: {
      background: '#fad7d7',
      color: 'black',
      borderRadius:"12px"
    },
    }
  }}
/>

</LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
};
const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null; 

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <ClipLoader color="white" loading={true} size={80} />
    </div>
  );
}


export default AppProviders;
