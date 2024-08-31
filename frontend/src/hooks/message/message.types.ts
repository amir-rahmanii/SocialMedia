


export type message = {
    createdAt: Date,
    _id: string,
    fromUserId: {
        profilePicture: { path: string, filename: string },
        username: string,
        _id: string,
    },
    toUserId: {
        profilePicture: { path: string, filename: string },
        username: string,
        _id: string,
    },
    isRead: boolean,
    sentAt: Date,
    updatedAt: Date,
    message: string
}

export type allMessage = message[]