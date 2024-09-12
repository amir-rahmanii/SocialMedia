import { useMutation, useQueryClient } from "react-query";
import apiRequest from "../../Services/axios";
import { newTicket } from "./tickets.types";


function usePostNewTicket() {
    const queryClient = useQueryClient();
    return useMutation(async (newTicket : newTicket) => {
        return apiRequest.post(`ticket/add-new-ticket` , newTicket)
    },
        {
            onSuccess: (res) => {
                console.log(res);
            },
        }
    )
}


export {usePostNewTicket}