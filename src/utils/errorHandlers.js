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

export const getLoginErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "Account not found.";
    case "auth/invalid-email":
      return "Invalid email format.";
    default:
      return "Login failed. Please try again.";
  }
};

export const getResetErrorMessage = (code) => {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/invalid-email":
      return "Invalid email format.";
    default:
      return "Failed to send reset email. Please try again.";
  }
};
