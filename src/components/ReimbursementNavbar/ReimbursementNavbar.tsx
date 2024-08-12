import React, { useEffect, useState } from "react"
import { currentUserStore } from "../../globalData/currentUserStore"
import { Button, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { logout } from "../../Utils/logout"

export const ReimbursementNavbar: React.FC = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(currentUserStore.currentUser)

    useEffect(() => {
        setUser(currentUserStore.currentUser)
    }, [currentUserStore.currentUser])

    const admin_buttons = [
        <Button className="m-2" onClick={() => {navigate("/users")}}>Users</Button>,
        <Button className="m-2"onClick={() => {navigate("/reimbursements")}}>Reimbursements</Button>,
        <Button className="m-2" onClick={() => {logout(false), navigate("/")}}>Log Out</Button>
    ]

    const manager_buttons = [
        <Button className="m-2" onClick={() => {navigate("/users")}}>Users</Button>,
        <Button className="m-2" onClick={() => {navigate("/reimbursements")}}>Reimbursements</Button>,
        <Button className="m-2" onClick={() => {logout(false), navigate("/")}}>Log Out</Button>
    ]

    const user_buttons = [
        <Button className="m-2" onClick={() => {navigate("/reimbursements")}}>Reimbursement</Button>,
        <Button className="m-2" onClick={() => navigate("/editUser", {state: {user: currentUserStore.currentUser}})}>Change user details</Button>,
        <Button className="m-2" onClick={() => {logout(false), navigate("/")}}>Log Out</Button>
    ]

    const anon_buttons = [
        <Button className="m-2" onClick={() => {navigate("/")}}>Login</Button>,
        <Button className="m-2" onClick={() => {navigate("/register")}}>Register</Button>
    ]

    const renderBar = () => {
        if (user === undefined) {
            return anon_buttons
        } else if (user.role.roleType === "ADMIN") {
            return admin_buttons
        } else if (user.role.roleType === "USER") {
            return user_buttons
        } else if (user.role.roleType === "MANAGER") {
            return manager_buttons
        } else {
            return anon_buttons
        }
    }

    return <Navbar className="d-flex justify-content-center">
        {renderBar()}
    </Navbar>
}