import { reimbursement } from "../../interfaces/reimbursement";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { currentUserStore } from "../../globalData/currentUserStore";
import { Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { store } from "../../globalData/store";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { ReimbursementNavbar } from "../ReimbursementNavbar/ReimbursementNavbar";

export const CreateReimbursement: React.FC = () => {
    const navigate = useNavigate();

    if (currentUserStore.currentUser === undefined || store.jwt === undefined) {
        return <Navigate to="/"/>
    }

    const [reimbursement, setReimbursement] = useState({
        description: "",
        amount: 0,
        status: "PENDING",
        accountId: currentUserStore.currentUser?.accountId
    })

    const storeValue = (input:any) => {
        if (input.target.name === "description") {
            setReimbursement({...reimbursement, description:input.target.value})
        } if (input.target.name === "status") {
            setReimbursement({...reimbursement, status:input.target.value})
        } if (input.target.name === "amount") {
            setReimbursement({...reimbursement, amount:input.target.value})
        }
    }

    const renderStatus = () => {
        if (currentUserStore.currentUser?.role.roleType == "USER") {
            return <></>
        } else {
            return <Form.Select className="bg-dark text-light"aria-label="Select role for the user" name="status" onChange={storeValue}>
                    <option disabled selected>Select the status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DENIED">Denied</option>
                </Form.Select>
        }
    }

    const postReimbursement = () => {
        const promise = axios.post(store.base_url + "/reimbursement", reimbursement, {headers: {'Authorization': 'Bearer ' + store.jwt,"Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(() => {navigate("/reimbursements")})

        toast.promise(promise, {
            success: "Reimbursement created!",
            error: "Error editing reimbursement (description too long)",
            loading: "Saving reimbursement"
        }, store.toast_options)
    }

    return  <div className="register-container h-100">
        <ReimbursementNavbar></ReimbursementNavbar>
    <div className="text-container container flex flex-column text-center">
        <h1>Edit reimbursement</h1>
        <h2>Please make your changes</h2>

        <div className="input-container">
            <label htmlFor="username">Description</label>
            <textarea className="bg-dark text-light border border-light m-2 w-75 h-100 rounded" placeholder="description" name="description" onChange={storeValue}/>
        </div>

        <div className="input-container">
            <label htmlFor="amount">Amount</label>
            <input className="bg-dark text-light border border-light m-2 w-75 h-100 rounded" type="number" min="0.01" max="100000.00" step="0.01" placeholder="amount for your business expense" name="amount" onChange={storeValue}/>
        </div>
        {
            renderStatus()
        }

        <button className="register-button btn btn-primary" onClick={postReimbursement}>save</button>
    </div>
    </div>
}