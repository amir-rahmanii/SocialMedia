

export type allStories = {
    stories: story[]
}




export type story = {
    createdAt: Date,
    media: {
        path: string,
        filename: string,
        __v: number,
        createdAt: Date,
        _id: number
    }[],
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