import * as Yup from "yup";

const newPostSchema = Yup.object().shape({
    title: Yup.string()
        .required("The title is required.")
        .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "The title must contain only English letters, numbers, and single spaces between words.")
        .min(3, "The title must be at least 3 characters.")
        .max(16, "The title must be at most 16 characters."),
    hashtags: Yup.string().required("").matches(/#\S+/g, "The hashtags needed # and please enter valid value"),
});

export default newPostSchema;