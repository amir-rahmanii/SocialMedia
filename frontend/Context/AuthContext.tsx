
import React, { createContext, useState } from "react";

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
    profilePicture : { path: string, filename: string },
    username: string,
    __v: number,
    _id: string
}

type AuthContextType = {
    user: userInfo | null,
    setUser: (user: userInfo | null) => void
}


export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<userInfo | null>(null)
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider