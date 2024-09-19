import { useMutation } from "react-query";
import apiRequest from "../Services/axios";
import toast from "react-hot-toast";

const useDeleteData = <T>(url: string, successMsg: string | null, onSuccess?: () => void) => {
  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationFn: async (data: T) => {
      const response = await apiRequest.delete(url, {
        data, // Send data in the request body
      });
      return response.data;
    },
    onSuccess: () => {
      if (successMsg) {
        toast.success(successMsg);
      }
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.error?.message ||
        "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });

  return { mutate, isLoading, isSuccess, isError };
};

export default useDeleteData;
