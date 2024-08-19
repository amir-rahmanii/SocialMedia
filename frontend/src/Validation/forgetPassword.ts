import * as Yup from "yup";

const forgetPassSchema = Yup.object().shape({
    email: Yup.string().required("").email("Please enter a valid email address.").min(13 , "The email must be at least 13 letters and at most 30 letters.").max(30 , "The email must be at least 13 letters and at most 30 letters."),
});

export default forgetPassSchema;