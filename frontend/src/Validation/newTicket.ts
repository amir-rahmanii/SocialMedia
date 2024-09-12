import * as Yup from "yup";

const newTicketSchema = Yup.object().shape({
    title: Yup.string().required("").matches(/^\w+$/ , "The title contains only English letters and numbers.").min(5 , "The title must be at least 5 letters and at most 16 letters.").max(16, "The title must be at least 5 letters and at most 16 letters."),
    description: Yup.string().required("").matches(/^\w+$/ , "The description contains only English letters and numbers.").min(20 , "The decription must be at least 20 letters and at most 60 letters.").max(60 , "The title must be at least 20 letters and at most 60 letters."),
});

export default newTicketSchema;