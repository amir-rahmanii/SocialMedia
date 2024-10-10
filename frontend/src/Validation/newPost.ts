import * as Yup from "yup";

const newPostSchema = Yup.object().shape({
    title: Yup.string().trim()
    .required("The title is required.")
    .matches(/^[A-Za-z0-9 ]+$/, "The title must contain only English letters, numbers, and spaces.")
    .min(3, "The title must be at least 3 characters.")
    .max(25, "The title must be at most 25 characters."),
    hashtags: Yup.string().trim().required("").matches(/#\S+/g, "The hashtags needed # and please enter valid value"),
});

export default newPostSchema;