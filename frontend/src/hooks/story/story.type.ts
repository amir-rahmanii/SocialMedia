import { boolean, string } from "yup";

export type allStories = {
    stories: story[]
}




export type story = {
    createdA: Date,
    media: { path: string, filename: string }[],
    updatedAt: Date,
    user: {
        userPicture: { path: string, filename: string },
        id: string,
        username: string,
        email: string,
        name: string,
        role: "ADMIN" | "USER",
        isban: boolean
    },
    __v: number,
    _id: string
}