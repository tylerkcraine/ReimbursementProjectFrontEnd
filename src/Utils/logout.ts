import { useNavigate } from "react-router-dom";
import { currentUserStore } from "../globalData/currentUserStore";
import { store } from "../globalData/store";
import toast from "react-hot-toast";

export function logout(didJwtExpire:boolean) {
    store.jwt = ""
    currentUserStore.currentUser = undefined
    if (didJwtExpire) {
        toast.error("Your session expired please login again", store.toast_options)
    }
}