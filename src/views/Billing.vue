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
            Only US$12 / month
          </div>
          <button
            @click="showPaymentForm = true"
            class="bg-yellow-300 hover:bg-yellow-500 text-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors shake-on-click"
          >
            Subscribe
          </button>
        </div>
        <div v-else class="text-bold mt-6 text-green-300 text-center text-3xl">
          You are currently subscribed to Codecaine.
        </div>
      </div>
    </div>
    <div
      v-show="showPaymentForm"
      class="bg-gray-700 rounded-lg p-4 animate-fade-in-up shadow-lg transition-all duration-500"
    >
      <div
        ref="cardElement"
        style="
          border: 1px solid #ccc;
          padding: 12px;
          border-radius: 6px;
          background: #23272f;
        "
      ></div>
      <p class="text-red-400 mt-2 min-h-[24px]">{{ errorMessage }}</p>
      <div class="flex flex-row items-center justify-end mt-5 gap-4">
        <p class="text-xl text-gray-100 m-0">Total Charge: $12</p>
        <button
          :disabled="processing"
          @click="handleSubmit"
          class="cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded transition-colors duration-300 shake-on-click disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ processing ? "付款中..." : "刷卡付款" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/config/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const authStore = useAuthStore();
const cardElement = ref(null);
const errorMessage = ref("");
const processing = ref(false);
const showPaymentForm = ref(false);

let stripe;
let elements;
let card;

const clientSecret = ref(""); // 後端取得的 clientSecret

async function createPaymentIntent() {
  try {
    const res = await api.post("api/stripe/create-payment-intent", {
      amount: 10000, // 例如 1000 = 1000分 = 1000台幣（你改成想要的金額）
      userId: authStore.userProfile.id, // 把用戶ID帶給後端
    });
    clientSecret.value = res.data.clientSecret;
    setupStripeElements(clientSecret.value);
  } catch (err) {
    errorMessage.value = "建立付款意向失敗：" + err.message;
  }
}

async function setupStripeElements(clientSecret) {
  stripe = await stripePromise;

  // 自訂 appearance 設定
  const appearance = {
    theme: "night",
    labels: "floating",
    variables: {
      colorPrimary: "#00D1B2", // 主要顏色
      colorBackground: "#1f1f1f", // 背景色
      colorText: "#ffffff", // 字體顏色
      borderRadius: "8px",
      fontSizeBase: "16px",
    },
  };

  // 將 appearance 與 clientSecret 一起傳入
  elements = stripe.elements({ clientSecret, appearance });

  // 建立卡片元件
  card = elements.create("payment");
  card.mount(cardElement.value); // Vue 的 ref 綁定 DOM 元素

  // 錯誤監聽
  card.on("change", (event) => {
    errorMessage.value = event.error ? event.error.message : "";
  });
}

async function handleSubmit() {
  processing.value = true;
  errorMessage.value = "";

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `http://localhost:5173/${encodeURIComponent(
        authStore.userProfile.username
      )}/caines/showcase`,
    },
  });

  if (error) {
    errorMessage.value = error.message;
    processing.value = false;
  }
  // 成功的情況不用在這裡判斷，因為會直接跳轉到 return_url
}

watch(showPaymentForm, async (val) => {
  if (val) {
    await createPaymentIntent();
  }
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
