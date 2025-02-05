import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import apiRequest from "../Services/axios";
import toast from "react-hot-toast";


const useGetData = <T>(
    queryKey: string | (string | number)[],
    url: string,
    options?: UseQueryOptions<T, Error>
): UseQueryResult<T, Error> => {
    return useQuery<T, Error>({
        queryKey,
        queryFn: async () => {
            const response = await apiRequest.get(url);
            return response.data;
        },
        onError: (error) => {
            const errorMessage = (error as any)?.response?.data?.error?.message || (error as any)?.response?.data?.error || "An unexpected error occurred.";
            toast.error(errorMessage); // نمایش پیام خط
        },
        ...options // گزینه‌های اضافی
    });
};

export default useGetData;
