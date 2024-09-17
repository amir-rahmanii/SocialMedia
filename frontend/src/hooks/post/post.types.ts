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