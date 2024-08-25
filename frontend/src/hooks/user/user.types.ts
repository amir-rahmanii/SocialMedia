import { PostItemProps } from "../../Components/Home/PostsContainer/PostsContainer"

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
        user: {
            profilePicture: {
                path: string,
                filename: string
            },
            _id: string,
            name: string,
            username: string,
            email: string,
            isVerified: boolean,
            role: "ADMIN" | "USER",
            isban: boolean,
            createdAt: Date,
            updatedAt: Date,
            __v: 0
        },
        posts: PostItemProps[],
    }