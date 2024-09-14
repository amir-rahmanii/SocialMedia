import * as Yup from "yup";

const newTicketSchema = Yup.object().shape({
    title: Yup.string()
        .required("The title is required.")
        .matches(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, "The title must contain only English letters, numbers, and single spaces between words.")
        .min(3, "The title must be at least 3 characters.")
        .max(16, "The title must be at most 16 characters."),
    description: Yup.string()
        .required("The description is required.")
        .matches(/^[A-Za-z0-9.,!?'"()-\s]+$/, "The description must contain only English letters, numbers, spaces, and common punctuation marks.")
        .min(20, "The description must be at least 20 characters.")
        .max(60, "The description must be at most 60 characters."),
});

export default newTicketSchema;