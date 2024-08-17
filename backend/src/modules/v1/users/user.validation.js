const yup = require("yup");
const userModel = require("../../../models/v1/user");
const { throwError } = require("../../../utils/response");

exports.registerUserVakidator = yup.object({
  name: yup
    .string()
    .required("name is required")
    .trim("name cannot contain leading/trailing spaces")
    .min(3, "name must be at least 3 characters long")
    .max(20, "name cannot be longer than 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  username: yup
    .string()
    .required("Username is required")
    .trim("Username cannot contain leading/trailing spaces")
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: yup
    .string()
    .required("email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("password is required")
    .min(8, "password must be at least 8 characters long"),
  role: yup
    .string()
    .oneOf(["USER", "ADMIN"], "Invalid role. Allowed values: USER, ADMIN")
    .transform((v) => v.toUpperCase(), "Convert role to uppercase"), // Optional: convert to uppercase
  confirmPassword: yup
    .string()
    .required("confirmPassword is required")
    .oneOf([yup.ref("password")], "Passwords must match"), // Reference password field
});
exports.logInUserValidator = yup.object({
  identity: yup.string().required("identity is required"),

  password: yup
    .string()
    .required("password is required")
    .min(8, "password must be at least 8 characters long"),
});
exports.updatePasswordValidator = yup.object({
  pervPassword: yup
    .string()
    .required("pervPassword is required")
    .min(8, "pervPassword must be at least 8 characters long"),
  newPassword: yup
    .string()
    .required("newPassword is required")
    .min(8, "newPassword must be at least 8 characters long")
    .max(20, "name cannot be longer than 20 characters")

    .notOneOf([yup.ref("pervPassword"), null]),
  newConfrimPassword: yup
    .string()
    .required("confirmPassword is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"), // Reference password field
  authorizationHeader: yup
    .string()
    .required(" authorization Header is required"),
});
exports.forGetPasswordValidator = yup.object({
  email: yup
    .string()
    .required("email is required")
    .email("Invalid email format"),
});
exports.resetPasswordValidator = yup.object({
  token: yup.string().required("token is required"),
  new_password: yup
    .string()
    .min(8, "new_password must be at least 8 chars ...")
    .max(20, "name cannot be longer than 20 characters")
    .required(" new_password is required"),
});
exports.banUserToAccess = async (req) => {
  const { userid } = req.body;
  if (!userid) {
    throwError("please enter userid", 400);
  }
  const user = await userModel.findOne({ _id: userid });
  if (!user) {
    throwError("user not found", 404);
  }
  if (user.role === "ADMIN") {
    throwError("You cannot ban the admin", 403);
  }
  return user;
};
exports.userInformation = async (req) => {
  const { userid } = req.body;
  if (!userid) {
    throwError("please enter userid", 400);
  }
  const user = await userModel.findOne({ _id: userid }, { password: 0 });
  if (!user) {
    throwError("user not found", 404);
  }
  return user;
};
