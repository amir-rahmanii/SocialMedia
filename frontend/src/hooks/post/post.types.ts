export type postid = {
    postid: string
}


export type comment = {
    postid: string,
    title: string,
    content: string,
}

export type deletecomment = {
    commentid: string,
}


interface Comment {
    content: string;
    createdAt: Date;
    postid: string;
    title: string;
    updatedAt: string;
    userPicture: {
        path: string;
        filename: string;
    };
    userid: string;
    username: string;
    _id: string;
}

interface Like {
    userPicture: {
        path: string;
        filename: string;
    };
    _id: string;
    postid: string;
    userid: string;
    username: string;
    createdAt:Date;
}

interface Media {
    path: string;
    filename: string;
    _id: string;
}

interface User {
    email: string;
    id: string;
    isban: boolean;
    name: string;
    role: string;
    userPicture: {
        path: string;
        filename: string;
    };
    username: string;
}

export interface Post {
    _id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    hashtags: string;
    isSaved: boolean;
    title: string;
    comments: Comment[];
    likes: Like[];
    media: Media[];
    saved: string[];  // Array of user IDs who saved the post
    user: User;
}