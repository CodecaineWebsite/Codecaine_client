import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const registerWithEmail = async (auth, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();
  await signOut(auth);
  return { user: userCredential.user, token };
};

export const loginWithEmail = async (auth, email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();
  return { user: userCredential.user, token };
};

export const loginWithProvider = async (auth, provider) => {
  const userCredential = await signInWithPopup(auth, provider);

  const token = await userCredential.user.getIdToken();
  return { user: userCredential.user, token };
};

export const resetPassword = async (auth, email) => {
  await sendPasswordResetEmail(auth, email);
};
