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
            autocomplete="off"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <label class="text-white text-sm font-bold">New Password</label>
          <input
            v-model="newPassword"
            autocomplete="off"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <label class="text-white text-sm font-bold"
            >Confirm New Password</label
          >
          <input
            v-model="confirmPassword"
            autocomplete="off"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
          <div class="flex flex-col gap-2">
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
          <label class="text-white text-sm font-bold">Current Password</label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
            placeholder="請輸入目前密碼以驗證身份"
          />
          <label class="text-white text-sm font-bold">Email Address </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="100"
            placeholder="請輸入新電子信箱"
          />
          <div class="flex flex-col gap-2">
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
              @click="handleChangeEmail"
              class="self-end mt-2 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition cursor-pointer"
            >
              Change Email
            </button>
          </div>
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
import { ref, onMounted } from "vue";
import { auth } from "../config/firebase";
import {
  EmailAuthProvider,
  updateEmail,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const email = ref("");
const passwordMessage = ref("");
const passwordMessageType = ref("");
const emailMessage = ref("");
const emailMessageType = ref("");
//修改密碼
const handleUpdatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = "The new password and confirmation do not match.";
    passwordMessageType.value = "error";
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
    messageType.value = "error";
  }
};
//修改信箱
const handleChangeEmail = async () => {
  message.value = ""; // 清空訊息
  messageType.value = "";
  const user = auth.currentUser;

  if (!user || !email.value || !currentPassword.value) {
    message.value = "請輸入完整資料";
    messageType.value = "error";
    return;
  }

  try {
    if (email.value === user.email) {
      message.value = "新信箱與目前信箱相同，請輸入不同的信箱。";
      messageType.value = "error";
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, email.value);
    message.value = "信箱更新成功";
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
        message.value = "目前密碼錯誤，請再試一次。";
        break;
      case "auth/missing-password":
        message.value = "請輸入目前密碼。";
        break;

      case "auth/invalid-email":
        message.value = "請輸入有效的電子信箱格式。";
        break;
      case "auth/email-already-in-use":
        message.value = "這個電子信箱已被使用，請使用其他信箱。";
        break;
      default:
        message.value = "操作失敗：" + error.message;
    }
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

<style scoped>
/* 你可以根據需要調整樣式 */
</style>
