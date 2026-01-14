import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/authContext";

const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
