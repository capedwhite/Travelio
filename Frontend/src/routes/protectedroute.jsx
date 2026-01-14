import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"

const ProtectedRoute  = ({children,allowedroles})=>{
    const{user}=useAuth();
    console.log(user)
    console.log(allowedroles)
    if(!user){
        return <Navigate to="/" replace/>
    }
    console.log(user.usertype)
    if(!allowedroles.includes(user.usertype)){
            console.log(" Access denied - userType not in allowed roles")
        return <Navigate to = "/unauthorized"/>
    }
    return children;
};
export default ProtectedRoute;