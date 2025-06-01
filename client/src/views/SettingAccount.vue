<template>
  <div class="w-full bg-[#131417] p-6 grid gap-6">
    <!-- 密碼相關 -->
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr] mb-4"
    >
      <div>
        <h3 class="text-xl font-bold mb-2">Update Password</h3>
        <p class="text-sm text-gray-500">
          Enter both fields to change your password.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6"
      >
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm font-bold">Current Password</label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <label class="text-white text-sm font-bold">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <label class="text-white text-sm font-bold"
            >Confirm New Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <div>
            <div
              v-if="message"
              class="px-4 py-2 rounded text-sm font-medium"
              :class="
                messageType === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              "
            >
              {{ message }}
            </div>
            <button
              @click="handleUpdatePassword"
              class="self-end mt-2 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 重設電子信箱 -->
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr] mb-4"
    >
      <div>
        <h3 class="text-xl font-bold mb-2">Email</h3>
        <p class="text-sm text-gray-500">
          This is where all notifications will be sent, including lost password
          requests.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6"
      >
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm font-bold">Email Address </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="100"
            placeholder="請輸入新電子信箱"
          />
          <button
            class="self-end mt-2 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition cursor-pointer"
          >
            Change Email
          </button>
        </div>
      </div>
    </section>

    <!-- 刪除帳號 -->
    <section class="grid grid-cols-1 md:grid-cols-[minmax(210px,330px)_1fr]">
      <div>
        <h3 class="text-xl font-bold mb-2 text-red-500">Danger Zone</h3>
        <p class="text-sm text-gray-500">
          Deleting your account will wipe all information about you and content
          you’ve created on CodePen.
        </p>
      </div>
      <div
        class="w-full max-w-160 bg-[#1E1F26] rounded-lg flex flex-col gap-4 p-6"
      >
        <button
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition cursor-pointer"
        >
          Deleting Account
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "../config/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const email = ref("");
const message = ref("");
const messageType = ref("");
const handleUpdatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = "The new password and confirmation do not match.";
    messageType.value = "error";
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not logged in.");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);

    message.value = "Password updated successfully.";
    messageType.value = "success";
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
        message.value = "Current password is incorrect. Please try again.";
        break;
      case "auth/weak-password":
        message.value =
          "The new password is too weak. Please enter at least 6 characters.";
        break;
      case "auth/requires-recent-login":
        message.value = "Please re-login to update your password.";
        break;
      case "auth/missing-password":
        message.value = "Please enter your current password.";
        break;
      default:
        message.value = "Password update failed: " + error.message;
    }
    messageType.value = "error";
  }
};
</script>

<style scoped>
/* 你可以根據需要調整樣式 */
</style>
