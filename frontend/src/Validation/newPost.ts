import * as Yup from "yup";

const newPostSchema = Yup.object().shape({
    title: Yup.string().required("").matches(/^\w+$/ , "The title contains only English letters and numbers.").min(3 , "The title must be at least 3 letters and at most 16 letters.").max(16, "The title must be at least 3 letters and at most 16 letters."),
    hashtags: Yup.string().required("").matches(/(^|\s)(#[a-z\d-]+$)/, "The hashtags needed # and please enter valid value"),
});

export default newPostSchema;