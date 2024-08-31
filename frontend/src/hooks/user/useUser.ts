import { useMutation, useQuery, useQueryClient } from "react-query"
import apiRequest from "../../Services/axios"
import { forgetPassword, profile, resetPassword, updatePassword, user, userId, userInformationAll, userRegister } from "./user.types";
import { userLogin } from "./user.types";
// import Cookies from "js-cookie";

function usePostUserRegister() {
    return useMutation(async (user: userRegister) => {
        return apiRequest.post(`users/register`, user)
    },
    )
}


function usePostUserLogin() {
    return useMutation(async (user: userLogin) => {
        return apiRequest.post(`users/login`, user)
    },
    )
}

function usePostUserForgetPassword() {
    return useMutation(async (email: forgetPassword) => {
        return apiRequest.post(`users/forget-password`, email)
    },
    )
}

function usePostUserUpdatePassword() {
    return useMutation(async (data: updatePassword) => {
        return apiRequest.post(`users/update-password`, data)
    },
    )
}


function usePostUserResetPassword() {
    return useMutation(async (data: resetPassword) => {
        return apiRequest.post(`users/reset-password`, data)
    },
    )
}

function useGetUserInformation() {
    return useQuery<user>(['getUserInformation'],
        async () => {
            const response = await apiRequest.get(`users/user-information`);
            return response.data
        },
    )
}

function useGetUserData(userId: string) {
    return useQuery<profile>(['getUserData', userId],
        async () => {
            const response = await apiRequest.get(`users/user-allData/${userId}`);
            return response.data
        },
        {
            enabled: !!userId, 
            onSuccess : (res) => {
                console.log(res);
                
            }
        }
    )
}

function useGetAllUsersInformation() {
    return useQuery<userInformationAll>(['getAllUserData'],
        async () => {
            const response = await apiRequest.get(`users/all-users`);
            return response.data
        },
    )
}


function usePostUserBan() {
    const queryClient = useQueryClient();
    return useMutation(async (userId: userId) => {
        return apiRequest.post(`users/user-ban-toggle`, userId)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getUserData"]);
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["mySavedPost"]);
                queryClient.invalidateQueries(["searchPosts"]);
            }
        }
    )
}

function useUpdateUserProfile() {
    const queryClient = useQueryClient();
    return useMutation(async (profilePicture: FormData) => {
        return apiRequest.put(`users/update-profile-picture`, profilePicture)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getUserData"]);
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["mySavedPost"]);
                queryClient.invalidateQueries(["getUserInformation"]);
                queryClient.invalidateQueries(["searchPosts"]);
            },
        }
    )
}

function usePostFollowToggle() {
    const queryClient = useQueryClient();
    return useMutation(async (userId: string) => {
        return apiRequest.post(`users/followToggle/${userId}`)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getUserData"]);
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["mySavedPost"]);
                queryClient.invalidateQueries(["getUserInformation"]);
                queryClient.invalidateQueries(["searchPosts"]);
            },
        }
    )
}




export {
    useGetAllUsersInformation,
    useGetUserData,
    useGetUserInformation,
    useUpdateUserProfile,
    usePostFollowToggle,
    usePostUserRegister,
    usePostUserLogin,
    usePostUserForgetPassword,
    usePostUserUpdatePassword,
    usePostUserResetPassword,
    usePostUserBan
}