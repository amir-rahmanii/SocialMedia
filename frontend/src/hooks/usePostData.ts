import toast from "react-hot-toast";
import apiRequest from "../Services/axios";
import { useMutation } from "react-query";


const usePostData = <T extends object>(
    url: string,
    successMsg: string | null,
    put: boolean = false, // Default to POST if not specified
    successFunc?: ((data: any) => void) | null,
    formData: boolean = false // Default to non-form data
) => {

    const { mutate, isLoading, isSuccess, isError } = useMutation({
        mutationFn: async (data: T) => {
            const headers: HeadersInit = {};

            if (!formData) {
                headers["Content-Type"] = "application/json"; // Default for JSON data
            }

            // Perform the API request
            return await apiRequest({
                url, // Base URL is already defined in apiRequest
                method: put ? "PUT" : "POST",
                headers,
                data: data, // Use 'data' for POST/PUT body in axios
            });
        },
        onSuccess: (response) => {
            if (successFunc) {
                successFunc(response.data); // Execute the success callback if provided
            }
            if (successMsg) {
                toast.success(successMsg); // Show success message
            }
        },
        onError: (error) => {
            const errorMessage = (error as any)?.response?.data?.error?.message || (error as any)?.response?.data?.error || "An unexpected error occurred.";
            toast.error(errorMessage); // Show specific error if available, otherwise a fallback
            console.error(error); // Log the error for debugging
        }
    });

    return { mutate, isLoading, isSuccess, isError };
};

export default usePostData;
