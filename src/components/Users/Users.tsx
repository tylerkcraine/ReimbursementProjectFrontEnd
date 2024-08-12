import { Navigate, useNavigate } from "react-router-dom"
import { currentUserStore } from "../../globalData/currentUserStore"
import { user } from "../../interfaces/user"
import { useState } from "react"
import { store } from "../../globalData/store"
import axios, { AxiosError } from "axios"
import { useEffect } from "react"
import { Button, Table } from "react-bootstrap"
import toast from "react-hot-toast"
import { logout } from "../../Utils/logout"
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar"

export const Users: React.FC = () => {
    const navigate = useNavigate()
    if (currentUserStore.currentUser === undefined || currentUserStore.currentUser.role.roleType == "USER" || store.jwt === undefined) {
        return <Navigate to="/"/>
    }

    let users:user[]
    let setUser: any
    [users, setUser] = useState([])
    let redraw_toggle = false

    const getUsers = async () => {
        await axios.get(store.base_url + "/accounts", {headers: {'Authorization': 'Bearer ' + store.jwt, 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS", "Access-Control-Allow-Headers": "Authorization"}, withCredentials:true}).then(
            (response) => setUser(response.data)
        )
        .catch((error:AxiosError) => {
            if (error.response?.data == "Invalid JWT token") {
                logout(true)
                navigate("/")
            } else {
                toast.error("Unknown error getting users")
            }
        })
    }

    const deleteUser = async (accountId: number) => {
        
        const thing = axios.delete(store.base_url + "/account/" + accountId, {headers: {'Authorization': 'Bearer ' + store.jwt, 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS", "Access-Control-Allow-Headers": "Authorization"}, withCredentials:true})
        .then(getUsers)
        .catch((error:AxiosError) => {
            if (error.response?.data == "Invalid JWT token") {
                logout(true)
                navigate("/")
            } else {
                toast.error("Unknown error deleting user")
            }
        })
        toast.promise(thing, {
            loading: 'Loading',
            success: 'Deleted user',
            error: 'Error when deleting',
          }, store.toast_options)
    }

    useEffect(
        () => {
            getUsers()
        }, [redraw_toggle]
    )

    return <div className="container text-center h-100">
        <ReimbursementNavbar></ReimbursementNavbar>
        <h2>Users</h2>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(
                    (item:user) => {
                        return <tr>
                            <td>{item.username}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.role?.roleType}</td>
                            <td className="flex flex-row">
                                <Button className = "w-10 m-1" onClick={() => navigate("/editUser", {state: {user: item}})}>Edit</Button>
                                <Button className = "w-10 m-1" onClick={() => deleteUser(item.accountId)}>Delete</Button>
                            </td>
                        </tr>
                    }
                )}
            </tbody>
        </Table>
    </div>
}