<template>
  <div class="flex flex-col gap-4 mx-auto max-w-3xl p-4">
    <div class="bg-gray-700 rounded-lg p-4">
      <div>
        <h2 class="text-2xl font-bold mb-4 text-center">Why subscribe us?</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li>☑️No ads</li>
          <li>☑️Unlimited public and private Pens</li>
          <li>☑️Access to exclusive features</li>
          <li>☑️Support the development of Codecaine</li>
        </ul>
        <div
          class="flex justify-end items-center gap-3 mt-4 mb-2"
          v-if="!authStore.userProfile.isPro"
        >
          <div
            class="text-lg font-extrabold text-yellow-400 drop-shadow bg-zinc-800 rounded px-3 py-1"
            style="letter-spacing: 1px"
          >
            Only NT$120 / month
          </div>
          <button
            @click="subscribe"
            class="bg-yellow-300 hover:bg-yellow-500 text-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors shake-on-click"
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="authStore.userProfile?.is_pro && subscriptionInfo"
      class="relative rounded-xl p-8 mt-6 mb-6 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 shadow-xl overflow-hidden animate-fade-in-up"
    >
      <!-- Confetti Icon -->
      <div
        class="absolute left-4 top-4 text-4xl pointer-events-none select-none"
      >
        🎉
      </div>
      <div
        class="absolute right-4 top-4 text-4xl pointer-events-none select-none"
      >
        🎊
      </div>
      <h2
        class="text-2xl font-bold mb-4 text-center text-purple-900 drop-shadow"
      >
        Payment
      </h2>
      <div>
        <div
          class="font-extrabold mt-6 text-green-700 text-center text-3xl drop-shadow animate-fade-in-up"
        >
          You are currently subscribed to Codecaine.
        </div>
        <div class="text-center mt-2 text-lg text-gray-800 font-semibold">
          Start Date: {{ subscriptionInfo.subscribed_at || "—" }}<br />
          <template v-if="subscriptionInfo.cancel_at_period_end">
            Subscription will expire on
            {{ subscriptionInfo.current_period_end || "—" }} (cancellation
            requested)
          </template>
          <template v-else>
            Next billing date: {{ subscriptionInfo.current_period_end || "—" }}
          </template>
        </div>
        <button
          v-if="!subscriptionInfo.cancel_at_period_end"
          @click="unSubscribe"
          class="mt-6 bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors cursor-pointer shake-on-click"
        >
          Cancel Subscription
        </button>
        <div v-else class="mt-4 text-yellow-700 text-center font-bold">
          You have requested cancellation. Your subscription will end on the
          expiration date.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/config/api";

const authStore = useAuthStore();

const subscriptionInfo = ref(null);

const checkPendingPayment = async () => {
  try {
    const res = await api.get("/api/stripe/subscription-status");
    subscriptionInfo.value = res.data;
  } catch (error) {
    alert("Failed to fetch subscription status.");
    subscriptionInfo.value = null;
  }
  // 成功的情況不用在這裡判斷，因為會直接跳轉到 return_url
};

const subscribe = async () => {
  try {
    const res = await api.post("/api/stripe/create-subscription-session", {
      userId: authStore.userProfile.id,
      username: authStore.userProfile.username,
    });

    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert("Failed to create subscription session.");
    }
  } catch (error) {
    alert("Failed to create subscription session.");
  }
};

const unSubscribe = async () => {
  try {
    const res = await api.put("/api/stripe/cancel-subscription", {
      userId: authStore.userProfile.id,
    });
    await checkPendingPayment();
  } catch (error) {
    alert("Failed to cancel subscription.");
  }
};

onMounted(() => {
  checkPendingPayment();
});
</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.shake-on-click:active {
  transform: translateY(3px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
</style>
