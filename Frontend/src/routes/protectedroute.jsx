import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"

const ProtectedRoute  = ({children,allowedroles})=>{
    const{user}=useAuth();
    console.log(user)
    console.log(allowedroles)
    if(!user){
        return <Navigate to="/" replace/>
    }
    if(!allowedroles.includes(user.usertype)){
        return <Navigate to = "/unauthorized"/>
    }
    return children;
};
export default ProtectedRoute;