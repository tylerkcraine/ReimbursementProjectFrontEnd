import './App.css'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { Login } from './components/LoginRegister/Login'
import { Users } from './components/Users/Users'
import { Register } from './components/LoginRegister/Register'
import { Reimbursements } from './components/Reimbursements/Reimbursements'
import { Toaster } from 'react-hot-toast'
import { EditUser } from './components/EditUser/EditUser'
import { EditReimbursement } from './components/EditReimbursment/EditReimbursement'
import { Button, Navbar } from 'react-bootstrap'
import { CreateReimbursement } from './components/EditReimbursment/CreateReimbursement'
import { ReimbursementNavbar } from './components/ReimbursementNavbar/ReimbursementNavbar'

function App() {
  return (
    <div className='h-100'>
      <Toaster></Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/reimbursements" element={<Reimbursements/>}/>
          <Route path="/editUser" element={<EditUser/>}/>
          <Route path="/editReimbursement" element={<EditReimbursement/>}/>
          <Route path="/createReimbursement" element={<CreateReimbursement/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
