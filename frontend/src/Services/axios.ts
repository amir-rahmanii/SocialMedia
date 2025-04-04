import axios from "axios";


const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // آدرس سرور خود را در اینجا وارد کنید
});

// Interceptor برای اضافه کردن access-token به هدرها (در صورت وجود)
apiRequest.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access-token"); // دریافت access token از کوکی‌ها
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // تنظیم توکن در هدر
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت انقضای access token و انجام فرآیند refresh
// apiRequest.interceptors.response.use(
//   (response) => {
//     return response; // اگر پاسخ موفقیت‌آمیز بود، آن را برگردانید
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // بررسی خطای 404 و پیام "please fitst login"
//     if (
//       error.response?.status === 404 &&
//       error.response.data?.error === "please fitst login"
//     ) {
//       handleSessionExpired(); // هدایت کاربر به صفحه لاگین
//     }

//     // بررسی انقضای توکن و تلاش برای refresh
//     if (error.response?.status === 409 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = Cookies.get("refresh-token"); // دریافت refresh token از کوکی‌ها

//       if (refreshToken) {
//         try {
//           // تلاش برای تازه‌سازی access token
//           await apiRequest.post(`/users/refresh-token`, { refreshToken });

//           // توکن جدید از سمت بک‌اند در کوکی‌ها ست خواهد شد، بنابراین نیازی به set دستی نیست
//           return apiRequest(originalRequest); // تلاش مجدد با درخواست اصلی
//         } catch (error) {
//           // در صورت عدم موفقیت در refresh توکن، کاربر را logout کنید و توکن‌ها را پاک کنید
//           handleSessionExpired();
//         }
//       } else {
//         handleSessionExpired();
//       }
//     }

//     return Promise.reject(error); // اگر خطا مدیریت نشد، آن را برگردانید
//   }
// );

// مدیریت انقضای نشست (کاربر را logout کنید و به صفحه ورود هدایت کنید)
// const handleSessionExpired = () => {
//   localStorage.removeItem("access-token");
//   toast.error("Session expired. Please log in again.");
//   setTimeout(() => {
//     window.location.href = "/login"; // این مسیر را به صفحه ورود اپلیکیشن خود تنظیم کنید
//   }, 1500); // تأخیر برای نمایش toast قبل از هدایت
// };

export default apiRequest;
