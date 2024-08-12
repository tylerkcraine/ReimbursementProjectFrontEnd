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

export const EditReimbursement: React.FC = () => {
    const {state} = useLocation()
    const editReimbursement:reimbursement = state.reimbursement
    const navigate = useNavigate();

    if (currentUserStore.currentUser === undefined || (currentUserStore.currentUser.role.roleType == "USER" && currentUserStore.currentUser.accountId != editReimbursement.account.accountId)) {
        return <Navigate to="/"/>
    }

    const [reimbursement, setReimbursement] = useState({
        reimbursementId: editReimbursement.reimbursementId,
        description: editReimbursement.description,
        amount: editReimbursement.amount,
        status: editReimbursement.status,
        accountId: editReimbursement.account.accountId
    })

    const storeValue = (input:any) => {
        if (input.target.name === "description") {
            setReimbursement({...reimbursement, description:input.target.value})
        } if (input.target.name === "status") {
            setReimbursement({...reimbursement, status:input.target.value})
        }
    }

    const renderStatus = () => {
        if (currentUserStore.currentUser?.role.roleType == "USER") {
            return <></>
        } else {
            return <Form.Select className="bg-dark text-light w-50 text-center mx-auto"aria-label="Select role for the user" name="status" onChange={storeValue} defaultValue={editReimbursement.status}>
                    <option disabled selected>Select the status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DENIED">Denied</option>
                </Form.Select>
        }
    }

    const patchReimbursement = () => {
        const promise = axios.patch(store.base_url + "/reimbursement", reimbursement, {headers: {'Authorization': 'Bearer ' + store.jwt,"Access-Control-Allow-Origin": "*"}, withCredentials:true})
        .then(() => {navigate("/reimbursements")})

        toast.promise(promise, {
            success: "Reimbursement edited!",
            error: "Error editing reimbursement (description too long)",
            loading: "Saving reimbursement"
        }, store.toast_options)
    }

    return  <div className="register-container h-100">
        <ReimbursementNavbar></ReimbursementNavbar>
    <div className="text-container container d-flex flex-column text-center justify-content-center">
        <h1>Edit reimbursement</h1>
        <h2>Please make your changes</h2>

        <div className="input-container d-flex justify-content-center flex-row align-items-center">
            <label className="text-center" htmlFor="username">Description:</label>
            <textarea className="bg-dark text-light border border-light m-2 w-75 h-100 rounded" placeholder="description" name="description" onChange={storeValue} defaultValue={editReimbursement.description}/>

        </div>
        {
            renderStatus()
        }

        <button className="register-button btn btn-primary w-25 mx-auto m-2" onClick={patchReimbursement}>save</button>
    </div>
</div>
}