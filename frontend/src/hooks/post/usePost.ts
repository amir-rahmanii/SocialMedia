import { useMutation, useQuery, useQueryClient } from "react-query"
import apiRequest from "../../Services/axios"
import { comment, postid } from "./post.types";




function usePostCreatePost() {
    const queryClient = useQueryClient();
    return useMutation(async (post: FormData) => {
        return apiRequest.post(`posts/create-post`, post, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
            },
        }
    )
}


function useGetAllPostAllUsers() {
    return useQuery(['AllPostAllUsers'],
        async () => {
            const response = await apiRequest.get("posts/get-all-posts");
            return response.data
        },
    )
}

function useGetMyPost() {
    return useQuery(['myPost'],
        async () => {
            const response = await apiRequest.get("posts/my-posts");
            return response.data
        },
        {
            onSuccess : (res) => {
                console.log(res);
            },
            onError : (err) => {
                console.log(err);
                
            }
        }
    )
}


function usePostLikeToggle() {
    const queryClient = useQueryClient();
    return useMutation(async (postid: postid) => {
        return apiRequest.post(`posts/like-toggle`, postid)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
            },
        }
    )
}

function usePostSavePostToggle() {
    const queryClient = useQueryClient();
    return useMutation(async (postid: postid) => {
        return apiRequest.post(`posts/save-post-toggle`, postid)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
            }
        }
    )
}


function usePostAddComment() {
    const queryClient = useQueryClient();
    return useMutation(async (comment : comment) => {
        return apiRequest.post(`posts/add-comment`, comment)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
            }
        }
    )
}



export { usePostCreatePost, useGetAllPostAllUsers, usePostLikeToggle, usePostSavePostToggle , usePostAddComment , useGetMyPost }