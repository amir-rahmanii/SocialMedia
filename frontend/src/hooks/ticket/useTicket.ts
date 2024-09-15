import { useMutation, useQuery, useQueryClient } from "react-query";
import apiRequest from "../../Services/axios";
import { newMessageTicket, newTicket, ticketUser } from "./tickets.types";


function usePostNewTicket() {
    const queryClient = useQueryClient();
    return useMutation(async (newTicket: newTicket) => {
        return apiRequest.post(`ticket/add-new-ticket`, newTicket)
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getUserTicket"])
            }
        }
    )
}

function usePutNewMessageTicket() {
    const queryClient = useQueryClient();
    return useMutation(async ({ticketId , message} : newMessageTicket) => {
        return apiRequest.put(`ticket/respond-ticket/${ticketId}`, {
            message : message
        })
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["getUserTicket"])
            }
        }
    )
}

function useGetUserTicket() {
    return useQuery<ticketUser[]>(['getUserTicket'],
        async () => {
            const response = await apiRequest.get("ticket/user-tickets");
            return response.data
        },
    )
}



export {
    useGetUserTicket,
    usePostNewTicket,
    usePutNewMessageTicket

}