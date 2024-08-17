import { useMutation } from "react-query"
import apiRequest from "../../Services/axios"
import {userRegister} from "./user.types";
import {userLogin} from "./user.types";
// import Cookies from "js-cookie";

function usePostUserRegister() {
    return useMutation(async (user: userRegister) => {
        return apiRequest.post(`users/register`, user)
    },
        // {
        //     onSuccess: (res) => {
        //         console.log(res);
        //         Cookies.set('token', res.data.response.user.accessToken)
        //     },
        // }

    )
}


function usePostUserLogin() {
    return useMutation(async (user: userLogin) => {
        return apiRequest.post(`users/login`, user)
    },
        // {
        //     onSuccess: (res) => {
        //         console.log(res);
        //         Cookies.set('token', res.data.response.data.accessToken)
        //     },
        // }

    )
}



export { usePostUserRegister , usePostUserLogin}