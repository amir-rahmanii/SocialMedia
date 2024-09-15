export type newTicket = {
    department: string,
    description: string,
    title: string,
    userId: string,
    priority: string,
}


export type newMessageTicket = {
    message : string , 
    ticketId : string
}


export type ticketUser = {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    department: "Support" | "Technical" | "HR" | "Management" | "Design" | "Other";
    description: string;
    status: "Open" | "Closed" | "Answered";
    title: string;
    priority: "Low" | "Medium" | "High";
    responses: {
        senderId: string,
        senderUsername: string,
        message: string,
        responseDate: Date,
        senderProfilePicture: { path: string, filename: string },
    }[];
    user: {
        profilePicture: { path: string, filename: string },
        userId: string,
        username: string
    };
}