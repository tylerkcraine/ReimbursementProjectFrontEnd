import { useState } from "react"
import axios, { AxiosError } from "axios"
import { store } from "../../globalData/store"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar"

export const Register: React.FC = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        username:"",
        rawPassword:"",
        firstName:"",
        lastName:""
    })

    const storeValue = (input:any) => {
        if (input.target.name === "username") {
            setUser({...user, username:input.target.value})
        } if (input.target.name === "password") {
            setUser({...user, rawPassword:input.target.value})
        } if (input.target.name === "firstname") {
            setUser({...user, firstName:input.target.value})
        } if (input.target.name === "lastname") {
            setUser({...user, lastName:input.target.value})
        }
    }

    const register = async () => {
        if (user.firstName === "" || user.lastName === "" || user.rawPassword == "") {
            toast.error("All Fields Required", store.toast_options)
            return;
        }
        await axios.post(store.base_url + "/register", user, {headers: {"Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(() => {toast.success("Success! Please login", store.toast_options); navigate("/")})
        .catch((error:AxiosError) => {
                if (error.response?.status === 409) {
                    toast.error("Sorry that user name is already taken try another", store.toast_options)
                }
            }
        )
    }

    return <div className="login container mx-auto">
        <ReimbursementNavbar></ReimbursementNavbar>
            <div className="text-container flex flex-column text-center mx-auto">
                <h1>Reimbursement System</h1>
                <h2>Please make an account</h2>

                <div className="input-container">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="username" name="username" onChange={storeValue}/>
                </div>

                <div className="input-container">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="password" placeholder="password" name="password" onChange={storeValue}/>
                </div>

                <div className="input-container">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="First Name" name="firstname" onChange={storeValue}/>
                </div>

                <div className="input-container">
                    <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="Last Name" name="lastname" onChange={storeValue}/>
                </div>

                <button className="register-button btn btn-primary" onClick={register}>Register</button>
            </div>
        </div>
}