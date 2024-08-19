import { useMutation } from "react-query"
import apiRequest from "../../Services/axios"
import { createPost } from "./post.types"




function usePostCreatePost() {
    return useMutation(async (post: createPost) => {
        console.log(post);
        return apiRequest.post(`posts/create-post`, post)
    },
        {
            onSuccess: (res) => {
                console.log(res)
            },
            onError: (err) => {
                console.log(err);
            }
        }
    )
}



export { usePostCreatePost }