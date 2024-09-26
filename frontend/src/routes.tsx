import { io } from "socket.io-client";
import PrivateRoutes from "./Components/PrivateRoutes/PrivateRoutes";
import ForgetPassword from "./Page/ForgetPassword/ForgetPassword";
import Home from "./Page/Home/Home";
import Inbox from "./Page/Inbox/Inbox";
import Login from "./Page/Login/Login";
import LoginInfo from "./Page/LoginInfo/LoginInfo";
import Profile from "./Page/Profile/Profile";
import Register from "./Page/Register/Register";
import ResetPassword from "./Page/ResetPassword/ResetPassword";
import SearchPosts from "./Page/SearchPosts/SearchPosts";
import UpdatePassword from "./Page/UpdatePassword/UpdatePassword";
import Tickets from "./Page/Tickets/Tickets";
import Dashboard from "./Page/Dashboard/Dashboard";
import NotFound from "./Page/NotFound/NotFound";
import Index from "./Page/Dashboard/Index";
import Users from "./Page/Dashboard/Users";
import ProfileAdmin from "./Page/Dashboard/ProfileAdmin";
import TicketsAdmin from "./Page/Dashboard/TicketsAdmin";


const routes = [
    { path: "/", element: <PrivateRoutes><Home /></PrivateRoutes> },
    { path: "/profile/:userId", element: <PrivateRoutes><Profile /></PrivateRoutes> },
    { path: "/search/:title", element: <PrivateRoutes><SearchPosts /></PrivateRoutes> },
    { path: "/direct", element: <PrivateRoutes><Inbox /></PrivateRoutes> },
    { path: "/login-info", element: <PrivateRoutes><LoginInfo /></PrivateRoutes> },
    { path: "/tickets", element: <PrivateRoutes><Tickets /></PrivateRoutes> },


    {
        path: "/dashboard", element: <PrivateRoutes><Dashboard /></PrivateRoutes>, children: [
            { path: "panel", element: <Index /> },
            { path: "users", element: <Users /> },
            { path: "profile", element: <ProfileAdmin /> },
            { path: "tickets", element: <TicketsAdmin /> },
        ]
    },

    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/update-password", element: <PrivateRoutes><UpdatePassword /></PrivateRoutes> },
    { path: "*", element: <NotFound /> },
]


export default routes