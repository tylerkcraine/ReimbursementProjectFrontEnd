import axios, { AxiosHeaders } from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { store } from "../../globalData/store";
import toast, { Toaster }  from "react-hot-toast";
import { currentUserStore } from "../../globalData/currentUserStore";
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar";

export const Login: React.FC = () => {
    const [user, setUser] = useState({
        username:"",
        rawPassword:""
    })

    const navigate = useNavigate()

    const storeValue = (input:any) => {
        if (input.target.name === "username") {
            setUser({...user, username:input.target.value})
        } if (input.target.name === "password") {
            setUser({...user, rawPassword:input.target.value})
        } 
    }

    const login = async () => {
        
        await axios.post(store.base_url + "/login", user, {headers: {"Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(
            (response) => {
                console.log(response.data)
                store.jwt = response.data
            }
        ).catch(() => {
            toast.error("Username/Password incorrect.", store.toast_options)
        })

        console.log(store.jwt)

        await axios.get(store.base_url + "/me", {headers: {'Authorization': "Bearer " + store.jwt, "Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(
            (response) => {
                currentUserStore.currentUser = response.data;
            }
        )

        console.log(currentUserStore.currentUser)

        if (currentUserStore.currentUser?.role?.roleType === "ADMIN" || currentUserStore.currentUser?.role?.roleType == "MANAGER") {
            navigate("/users")
        } else if (currentUserStore.currentUser?.role?.roleType == "USER") {
            navigate("/reimbursements")
        }
    }
    
    return (
        <div className="login h-100">
            <div className="text-container container d-flex flex-column justify-content-center text-center mx-auto">
                <h1>Reimbursement System</h1>
                <h2>Please login:</h2>

                <div className="input-container justify-content-center">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="username" name="username" onChange={storeValue}/>
                </div>

                <div className="input-container">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="password" placeholder="password" name="password" onChange={storeValue}/>
                </div>

                <button className="login-button btn btn-primary m-2 w-50 mx-auto" onClick={login}>Login</button>
                <button className="register-button btn btn-primary m-2 w-50 mx-auto" onClick={() => navigate("/register")}>Register</button>
            </div>
        </div>
    )

}