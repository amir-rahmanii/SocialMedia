import * as Yup from "yup";

const loginSchema = Yup.object().shape({
    identity: Yup.string().required("").matches(/^(?:[A-Z\d][A-Z\d_-]{5,10}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i, "Please enter the correct email or usename."),
    password: Yup.string().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/, "The password must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),

});

export default loginSchema;