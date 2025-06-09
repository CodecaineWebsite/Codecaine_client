export const getRegisterErrorMessage = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    default:
      return "Registration failed. Please try again later.";
  }
};
