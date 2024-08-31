import { useQuery } from "react-query";
import apiRequest from "../../Services/axios";
import { allMessage } from "./message.types";




function useGetAllMessages(fromUserId : string, toUserId : string) {
    return useQuery<allMessage>(['getAllStories'],
        async () => {
            const response = await apiRequest.get(`message/get-all-message/`, {
                params: { fromUserId, toUserId },
            });

            return response.data
        },
        {
            enabled: !!fromUserId && !!toUserId,
        }
    )
}






export { useGetAllMessages }