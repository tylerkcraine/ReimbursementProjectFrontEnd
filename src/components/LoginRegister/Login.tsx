import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { store } from "../../globalData/store";
import toast, { Toaster }  from "react-hot-toast";

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
        const response = await axios.post(store.base_url + "/login", user, {withCredentials:true})
        .then(
            (response) => {
                console.log(response.data)
                store.jwt = response.data
            }
        )
    }

}