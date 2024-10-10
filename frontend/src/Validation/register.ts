import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string().trim().required("").matches(/^\w+$/ , "The name contains only English letters and numbers.").min(3 , "The name must be at least 3 letters and at most 16 letters.").max(16, "The name must be at least 3 letters and at most 16 letters."),
  email: Yup.string().trim().required("").email("Please enter a valid email address.").min(13 , "The email must be at least 13 letters and at most 30 letters.").max(30 , "The email must be at least 13 letters and at most 30 letters."),
  username : Yup.string().trim().required("").matches(/^\w+$/ , "The username contains only English letters and numbers.").min(3 , "The username must be at least 3 letters and at most 20 letters.").max(20, "The username must be at least 3 letters and at most 20 letters."),
  password:Yup.string().trim().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/ , "The password must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),
  confirmPassword:Yup.string().trim().required("").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/ , "The confirmPassword must be at least 8 characters and at most 24 characters and contain at least one letter and one number."),
});

export default registerSchema;