import PrivateRoutes from "./Components/PrivateRoutes/PrivateRoutes";
import ForgetPassword from "./Page/ForgetPassword/ForgetPassword";
import Home from "./Page/Home/Home";
import Login from "./Page/Login/Login";
import Profile from "./Page/Profile/Profile";
import Register from "./Page/Register/Register";
import ResetPassword from "./Page/ResetPassword/ResetPassword";
import SearchPosts from "./Page/SearchPosts/SearchPosts";
import UpdatePassword from "./Page/UpdatePassword/UpdatePassword";



const routes = [
    { path: "/", element: <PrivateRoutes><Home /></PrivateRoutes> },
    { path: "/profile/:userid", element: <PrivateRoutes><Profile /></PrivateRoutes> },
    { path: "/search/:title", element: <PrivateRoutes><SearchPosts /></PrivateRoutes> },

    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/update-password", element: <PrivateRoutes><UpdatePassword /></PrivateRoutes> },
]


export default routes