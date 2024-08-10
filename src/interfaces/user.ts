import { role } from "./role";

export interface user {
    accountId: number,
    username: string,
    firstName: string,
    lastName: string,
    role:role
}