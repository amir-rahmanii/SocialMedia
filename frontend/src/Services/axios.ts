import axios from "axios";


const apiRequest = axios.create({
    withCredentials: true,
    baseURL : "http://localhost:4002",
})

apiRequest.interceptors.request.use(request => {
    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

apiRequest.interceptors.response.use(response => {
    // Edit response config
    return response;
}, error => {
    return Promise.reject(error);
});

export default apiRequest