<template>
  <div class="w-full bg-[#131417] p-6 grid gap-6">
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr] mb-4">
      <div>
        <h3 class="text-xl font-bold mb-2">Update Password</h3>
        <p class="text-sm text-gray-500">
          Enter both fields to change your password.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6">
        <form
          class="flex flex-col gap-2"
          @submit.prevent="handleUpdatePassword">
          <label class="text-white text-sm font-bold">Current Password</label>
          <input
            v-model="currentPassword"
            autocomplete="current-password"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50" />
          <label class="text-white text-sm font-bold">New Password</label>
          <input
            v-model="newPassword"
            autocomplete="new-password"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50" />
          <label class="text-white text-sm font-bold"
            >Confirm New Password</label
          >
          <input
            v-model="confirmPassword"
            autocomplete="new-password"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50" />
          <div class="flex flex-col gap-2">
            <div
              v-if="passwordMessage"
              class="px-4 py-2 rounded text-sm font-medium"
              :class="
                passwordMessageType === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              ">
              {{ passwordMessage }}
            </div>
            <button
              type="submit"
              class="self-end mt-2 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition cursor-pointer">
              Update
            </button>
          </div>
        </form>
      </div>
    </section>

    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr] mb-4">
      <div>
        <h3 class="text-xl font-bold mb-2">Email</h3>
        <p class="text-sm text-gray-500">
          This is where all notifications will be sent, including lost password
          requests.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6">
        <form
          class="flex flex-col gap-2"
          @submit.prevent="handleChangeEmail">
          <label class="text-white text-sm font-bold">Current Password</label>
          <input
            v-model="currentPasswordForEmail"
            autocomplete="current-password"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50" />
          <label class="text-white text-sm font-bold">Email Address </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="100" />
          <div class="flex flex-col gap-2">
            <div
              v-if="emailMessage"
              class="px-4 py-2 rounded text-sm font-medium"
              :class="
                emailMessageType === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              ">
              {{ emailMessage }}
            </div>
            <button
              type="submit"
              class="self-end mt-2 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition cursor-pointer">
              Change Email
            </button>
          </div>
        </form>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr]">
      <div>
        <h3 class="text-xl font-bold mb-2 text-red-500">Danger Zone</h3>
        <p class="text-sm text-gray-500">
          Deleting your account will wipe all information about you and content
          you’ve created on CodePen.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6">
        <button
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition cursor-pointer">
          Deleting Account
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  EmailAuthProvider,
  updateEmail,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import api from "@/config/api";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordMessage = ref("");
const passwordMessageType = ref("");
const currentPasswordForEmail = ref("");
const email = ref("");
const emailMessage = ref("");
const emailMessageType = ref("");

const handleUpdatePassword = async () => {
  const user = auth.currentUser;
  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = "The new password and confirmation do not match.";
    passwordMessageType.value = "error";
    return;
  }
  try {
    if (!user || !user.email) throw new Error("User not logged in.");
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);
    passwordMessage.value = "Password updated successfully.";
    passwordMessageType.value = "success";
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
        passwordMessage.value =
          "Current password is incorrect. Please try again.";
        break;
      case "auth/weak-password":
        passwordMessage.value =
          "The new password is too weak. Please enter at least 6 characters.";
        break;
      case "auth/requires-recent-login":
        passwordMessage.value = "Please re-login to update your password.";
        break;
      case "auth/missing-password":
        passwordMessage.value = "Please enter your current password.";
        break;
      case "auth/password-does-not-meet-requirements":
        passwordMessage.value = "Password must contain at least 8 characters.";
        break;
      default:
        passwordMessage.value = "Password update failed: " + error.message;
    }
    passwordMessageType.value = "error";
  }
};
const handleChangeEmail = async () => {
  const user = auth.currentUser;
  if (!user || !email.value || !currentPasswordForEmail.value) {
    emailMessage.value = "Please fill in all required fields.";
    emailMessageType.value = "error";
    return;
  }
  try {
    if (email.value === user.email) {
      emailMessage.value =
        "The new email is the same as the current one. Please enter a different email address.";
      emailMessageType.value = "error";
      return;
    }
    const res = await api.put("/api/users/:id/email", {
      email: email.value,
    });
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPasswordForEmail.value
    );
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, email.value);
    emailMessage.value = res.data.message;
    emailMessageType.value = "success";
    console.log(res.data);
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
        emailMessage.value = "Current password is incorrect. Please try again.";
        break;
      case "auth/missing-password":
        emailMessage.value = "Please enter your current password.";
        break;
      case "auth/invalid-email":
        emailMessage.value = "Please enter a valid email address.";
        break;
      case "auth/email-already-in-use":
        emailMessage.value =
          "This email address is already in use. Please use another one.";
        break;
      case "auth/wrong-password":
        emailMessage.value = "Current password is incorrect. Please try again.";
        break;
      default:
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          emailMessage.value =
            "Email update failed: " + error.response.data.error;
        } else {
          emailMessage.value = "Email update failed: " + error.message;
        }
    }
    emailMessageType.value = "error";
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      email.value = user.email || "";
    } else {
      email.value = "";
    }
  });
});
</script>
