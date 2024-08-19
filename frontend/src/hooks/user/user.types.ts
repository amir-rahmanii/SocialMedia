export type userRegister = {
    name : string ,
    email : string,
    password : string,
    confirmPassword : string,
    username : string,
}

export type userLogin = {
    identity : string,
    password : string
}

export type forgetPassword = {
    email : string,
}

export type resetPassword ={
    token : string,
    new_password : string
}

export type userId ={
    userid : string,
}
