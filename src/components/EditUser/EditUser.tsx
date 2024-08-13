import { useLocation, useNavigate } from "react-router-dom"
import { user } from "../../interfaces/user"
import { currentUserStore } from "../../globalData/currentUserStore"
import { Navigate } from "react-router-dom"
import { useState } from "react"
import { Form } from "react-bootstrap"
import axios, { HttpStatusCode } from "axios"
import { store } from "../../globalData/store"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { logout } from "../../Utils/logout"
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar"

export const EditUser: React.FC = () => {
    const {state} = useLocation()
    const editUser:user = state.user
    const navigate = useNavigate();

    if (currentUserStore.currentUser === undefined || (currentUserStore.currentUser.role.roleType == "USER" && currentUserStore.currentUser.accountId != editUser.accountId)) {
        return <Navigate to="/"/>
    }

    const [user, setUser] = useState({
        accountId: editUser.accountId,
        username: editUser.username,
        rawPassword: null,
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        roleType: editUser.role.roleType
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
        } if (input.target.name === "role") {
            setUser({...user, roleType:input.target.value})
            console.log(input.target.value)
        }
    }

    const roleRender = () => {
        if (currentUserStore.currentUser?.role.roleType == "ADMIN" || currentUserStore.currentUser?.role.roleType == "MANAGER") {
            return <Form.Select className="bg-dark text-light text-center"aria-label="Select role for the user" name="role" onChange={storeValue} defaultValue={editUser.role.roleType}>
                    <option disabled selected>Select a role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="USER">User</option>
                </Form.Select>
        } else {
            return <></>
        }
    }

    const patchUser = async () => {
        const promise = axios.patch(store.base_url + "/account", user, {headers: {'Authorization': 'Bearer ' + store.jwt,"Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(() => {
                    if (currentUserStore.currentUser?.role.roleType == "USER") {
                        navigate("/reimbursements")
                    }
                    else {
                        navigate("/users")
                    }})
        toast.promise(promise, {
            loading: 'Saving',
            success: 'Edited User!',
            error: (err:AxiosError) => {
                if (err.response?.status == HttpStatusCode.Forbidden) {
                    return "You can't change the only admin account to anything other than admin"
                } else if (err.response?.status == HttpStatusCode.Conflict) {
                    return "Username already taken"
                } else if (err.response?.data == "Invalid JWT token") {
                    logout(true)
                    navigate("/")
                    return "Your session expired sign back in"
                } else {
                    console.log(err)
                    return "Unknown error saving"
                }},
          }, store.toast_options)
    }

    return <div className="register-container h-100">
        <ReimbursementNavbar></ReimbursementNavbar>
        <div className="text-container container flex flex-column text-center">
            <h1>Edit account: {editUser.username}</h1>
            <h2>Please make your changes</h2>

            <div className="input-container">
                <label htmlFor="username">Username</label>
                <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="username" name="username" onChange={storeValue} defaultValue={editUser.username}/>
            </div>

            <div className="input-container">
                <label htmlFor="password">Password</label>
                <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="password" placeholder="password (don't change to keep the same)" name="password" onChange={storeValue}/>
            </div>

            <div className="input-container">
                <label htmlFor="firstname">First Name</label>
                <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="First Name" name="firstname" onChange={storeValue} defaultValue={editUser.firstName}/>
            </div>

            <div className="input-container">
                <label htmlFor="lastname">Last Name</label>
                <input className="bg-dark text-light border border-light m-2 w-75 rounded" type="text" placeholder="Last Name" name="lastname" onChange={storeValue} defaultValue={editUser.lastName}/>
            </div>
            {
                roleRender()
            }

            <button className="register-button btn btn-primary" onClick={patchUser}>Save</button>
        </div>
    </div>
}