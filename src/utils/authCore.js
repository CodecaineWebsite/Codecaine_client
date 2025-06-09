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
  await signOut(auth); // 註冊完立刻登出
  return { user: userCredential.user, token };
};
