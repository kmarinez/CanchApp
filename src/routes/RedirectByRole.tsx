import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function RedirectByRole() {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            navigate("/login");
        }else if(user.role === "admin" || user.role === "staff") {
            navigate("/dashboard");
        }else if(user.role === "customer") {
            navigate("/inicio")
        }else {
            navigate("/not-authorized");
        }
    }, [user, navigate]);

    return null;
}

export default RedirectByRole;