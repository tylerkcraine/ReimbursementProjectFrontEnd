import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { currentUserStore } from "../../globalData/currentUserStore"
import { store } from "../../globalData/store"
import { reimbursement } from "../../interfaces/reimbursement"
import { Button, Table } from "react-bootstrap"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { logout } from "../../Utils/logout"
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar"

export const Reimbursements: React.FC = () => {
    const navigate = useNavigate()
    if (currentUserStore.currentUser === undefined || store.jwt === undefined) {
        return <Navigate to="/"/>
    }

    let reimbursements:reimbursement[]
    let setReimbursements: any
    [reimbursements, setReimbursements] = useState([])
    const redraw_toggle = false

    const deleteReimbursement = async (reimbursementId: number) => {
        const promise = axios.delete(store.base_url + "/reimbursement/" + reimbursementId, {headers: {'Authorization': 'Bearer ' + store.jwt, 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS", "Access-Control-Allow-Headers": "Authorization"}, withCredentials:true})
        .then(getReimbursements)
        .catch(
            (err:AxiosError) => {
                if (err.response?.data == "Invalid JWT token") {
                    logout(true)
                    navigate("/")
                } else {
                    toast.error("Unknown error fetching reimbursements")
                }
            }
        )

        toast.promise(promise, {
            loading: 'Deleting reimbursement',
            success: 'Deleted reimbursement!',
            error: 'Error when deleting',
          }, store.toast_options)
    }
    
    const getReimbursements = async () => {
        const promise = axios.get(store.base_url + "/reimbursements", {headers: {'Authorization': 'Bearer ' + store.jwt, 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS", "Access-Control-Allow-Headers": "Authorization"}, withCredentials:true})
        .then(
            (response) => setReimbursements(response.data))
        .catch(
            (err:AxiosError) => {
                if (err.response?.data == "Invalid JWT token") {
                    logout(true)
                    navigate("/")
                } else {
                    toast.error("Unknown error fetching reimbursements")
                }
            }
        )
    }

    useEffect(
        () => {
            getReimbursements()
        }, [redraw_toggle]
    )

    const allReimbursements = 
        (item:reimbursement) => {
            return <tr>
                <td>{item.description}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>{item.account.username}</td>
                <td className="flex flex-row">
                    <Button className = "w-10 m-1" onClick={() => navigate("/editReimbursement", {state: {reimbursement: item}})}>Edit</Button>
                    <Button className = "w-10 m-1 btn-danger" onClick={() => deleteReimbursement(item.reimbursementId)}>Delete</Button>
                </td>
            </tr>
        }

    const pendingReimbursements = 
        (item:reimbursement) => {
            if (item.status === "PENDING") {
                return <tr>
                <td>{item.description}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>{item.account.username}</td>
                <td className="flex flex-row">
                    <Button className = "w-10 m-1" onClick={() => navigate("/editReimbursement", {state: {reimbursement: item}})}>Edit</Button>
                    <Button className = "w-10 m-1 btn-danger" onClick={() => deleteReimbursement(item.reimbursementId)}>Delete</Button>
                </td>
            </tr>
            } else {
                return <></>
            }
        }

    const [filter, setFilter] =useState({method: allReimbursements})


    return <div className="container text-center h-100">
        <ReimbursementNavbar></ReimbursementNavbar>
        <h2>Users</h2>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {reimbursements.map(filter.method)}
            </tbody>
        </Table>
        <Button className="m-2" onClick={() => {navigate("/createReimbursement")}}>Create Reimbursement</Button>
        <Button className="m-2" onClick={() => {setFilter({method: allReimbursements})}}>Show all reimbursements</Button>
        <Button className="m-2" onClick={() => {setFilter({method: pendingReimbursements})}}>Show pending reimbursements</Button> 
    </div>
}