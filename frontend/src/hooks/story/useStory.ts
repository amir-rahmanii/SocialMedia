import { useMutation, useQuery, useQueryClient } from "react-query";
import apiRequest from "../../Services/axios";
import { allStories } from "./story.type";



function usePostCreateStory() {
    const queryClient = useQueryClient();
    return useMutation(async (post: FormData) => {
        return apiRequest.post(`story/createStory`, post, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getAllStories"])
            }
        }
    )
}

function useGetAllStories() {
    return useQuery<allStories>(['getAllStories'],
        async () => {
            const response = await apiRequest.get(`story/get-all-stories`);
            return response.data
        },
    )
}


// function useGetStoryById(storyId : string){
//     return useQuery(['getOneStory'],
//         async () => {
//             const response = await apiRequest.get(`story//get-story/${storyId}`);
//             return response.data
//         },
//         {
//             onSuccess: (res) => {
//                 console.log(res);
//             },
//         }
//     )
// }



export {
    usePostCreateStory,
    useGetAllStories,
}