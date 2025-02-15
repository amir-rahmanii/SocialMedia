import * as Yup from "yup";

const updatePassSchema = Yup.object().shape({
    pervPassword: Yup.string().trim().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/, "The password must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),
    newPassword: Yup.string().trim().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/, "The password must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),
    newConfrimPassword: Yup.string().trim().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/, "The password must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),
});

export default updatePassSchema;