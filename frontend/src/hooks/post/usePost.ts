import { useMutation, useQuery, useQueryClient } from "react-query"
import apiRequest from "../../Services/axios"
import { postid } from "./post.types";




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


function usePostLikeToggle() {
    const queryClient = useQueryClient();
    return useMutation(async (postid : postid) => {
        return apiRequest.post(`posts/like-toggle`, postid)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
            },
        }
    )
}



export { usePostCreatePost, useGetAllPostAllUsers , usePostLikeToggle}