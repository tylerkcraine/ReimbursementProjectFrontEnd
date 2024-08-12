import { user } from "./user"

export interface reimbursement {
    reimbursementId:number,
    description:string,
    amount:number,
    status:string,
    account:user
}