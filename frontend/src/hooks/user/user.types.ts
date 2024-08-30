import { PostItemProps } from "../../Components/Home/PostsContainer/PostsContainer"
import { story } from "../story/story.type"

export type userRegister = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    username: string,
}

export type userLogin = {
    identity: string,
    password: string
}

export type forgetPassword = {
    email: string,
}

export type resetPassword = {
    token: string,
    new_password: string
}

export type userId = {
    userid: string,
}

export type updatePassword = {
    pervPassword: string,
    newPassword: string,
    newConfrimPassword: string
}


export type profile =
    {
        user: userInformation,
        posts: PostItemProps[],
        stories : story[]
    }


export type userInformation = {
    profilePicture: {
        path: string,
        filename: string
    },
    _id: string,
    name: string,
    username: string,
    following: {
        profilePicture: { path: string },
        userId: string,
        username: string,
        _id: string,
    }[],
    followers: {
        profilePicture: { path: string },
        userId: string,
        username: string,
        _id: string,
    }[],
    email: string,
    isVerified: boolean,
    role: "ADMIN" | "USER",
    isban: boolean,
    createdAt: Date,
    updatedAt: Date,
    systemInfos: {
        os: string,
        browser: string,
        country: string,
        ip: string,
        date: Date,
        _id: string
    }[]
}

export type userInformationAll = {
    response: {
        users: userInformation[]
    }
}

export type user = {
    response: {
        message: string,
        user: userInformation
    }
}