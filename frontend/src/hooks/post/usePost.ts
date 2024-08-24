import { useMutation, useQuery, useQueryClient } from "react-query"
import apiRequest from "../../Services/axios"
import { comment, deletecomment, postid } from "./post.types";




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
                queryClient.invalidateQueries(["mySavedPost"]);
            },
        }
    )
}

function usePutUpdatePost() {
    const queryClient = useQueryClient();
    return useMutation(async (post: FormData) => {
        return apiRequest.put(`posts/update-post`, post, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
                queryClient.invalidateQueries(["mySavedPost"]);
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
    )
}

function useGetMySavedPost() {
    return useQuery(['mySavedPost'],
        async () => {
            const response = await apiRequest.get("posts/my-save-posts");
            return response.data
        },
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
                queryClient.invalidateQueries(["mySavedPost"]);
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
                queryClient.invalidateQueries(["mySavedPost"]);
            }
        }
    )
}


function usePostAddComment() {
    const queryClient = useQueryClient();
    return useMutation(async (comment: comment) => {
        return apiRequest.post(`posts/add-comment`, comment)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
                queryClient.invalidateQueries(["mySavedPost"]);
            }
        }
    )
}


function useDeleteComment() {
    const queryClient = useQueryClient();
    return useMutation(async (idcomment: deletecomment) => {
        return apiRequest.delete(`posts/delete-comment`, {
            data: idcomment, // Use the data field to send the body
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
                queryClient.invalidateQueries(["mySavedPost"]);
            }
        }
    )
}


function useDeletePost() {
    const queryClient = useQueryClient();
    return useMutation(async (postid: postid) => {
        return apiRequest.delete(`posts/delete-post`, {
            data: postid, // Use the data field to send the body
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["AllPostAllUsers"]);
                queryClient.invalidateQueries(["myPost"]);
                queryClient.invalidateQueries(["mySavedPost"]);
            }
        }
    )
}



export {
    usePostCreatePost,
    usePutUpdatePost,
    useGetAllPostAllUsers,
    useGetMyPost,
    useGetMySavedPost,
    usePostLikeToggle,
    usePostSavePostToggle,
    usePostAddComment,
    useDeleteComment,
    useDeletePost
}