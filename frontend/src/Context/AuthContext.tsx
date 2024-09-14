import React, { createContext, useState, useEffect } from "react";
import apiRequest from "../Services/axios";
import SpinLoader from "../Components/SpinLoader/SpinLoader";
import { useGetMyUsersInfo } from "../hooks/user/useUser";
import toast from "react-hot-toast";

type AuthContextProviderProps = {
    children: React.ReactNode
}

type userInfo = {
    createdAt: Date,
    email: string,
    isVerified: boolean,
    isban: boolean,
    name: string,
    role: "ADMIN" | "USER",
    updatedAt: Date,
    systemInfos: {
        os: string;
        browser: string;
        country: string;
        ip: string;
        date: Date;
        _id: string;
    }[]
    profilePicture: { path: string, filename: string },
    username: string,
    _id: string,

    followers: {
        profilePicture: { path: string },
        userId: string,
        username: string,
        _id: string
    }[],
    following: {
        profilePicture: { path: string },
        userId: string,
        username: string,
        _id: string
    }[]
}

type AuthContextType = {
    user: userInfo | null,
    setUser: (user: userInfo | null) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<userInfo | null>(null);
    // const { data: myInfo, isLoading, isSuccess, isError } = useGetMyUsersInfo();

    // useEffect(() => {
    //     if (isSuccess) {
    //         setUser(myInfo);
    //     } else if (isError) {
    //         toast.error("please try again later 😩")
    //     }
    // }, [isSuccess, isError]);


    // if (isLoading) {
    //     return <div><SpinLoader /></div>; // You can replace this with a spinner or skeleton component
    // }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
