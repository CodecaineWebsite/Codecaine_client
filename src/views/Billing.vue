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
          v-if="authStore.userProfile?.is_pro"
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
    <div v-show="showPaymentForm">
      <div
        ref="cardElement"
        style="border: 1px solid #ccc; padding: 12px; border-radius: 6px"
      ></div>
      <p style="color: red">{{ errorMessage }}</p>
      <button :disabled="processing" @click="handleSubmit">
        {{ processing ? "付款中..." : "刷卡付款" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
    });
    clientSecret.value = res.data.clientSecret;
  } catch (err) {
    errorMessage.value = "建立付款意向失敗：" + err.message;
  }
}

async function setupStripeElements() {
  stripe = await stripePromise;
  elements = stripe.elements();

  const style = {
    base: {
      color: "#ffffff", // 白字
      fontSize: "16px",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      "::placeholder": {
        color: "#cccccc", // 淺灰 placeholder
      },
    },
    invalid: {
      color: "#ff6b6b", // 錯誤紅色
    },
  };

  card = elements.create("card", { style: style });
  card.mount(cardElement.value);

  card.on("change", (event) => {
    errorMessage.value = event.error ? event.error.message : "";
  });
}

async function handleSubmit() {
  processing.value = true;
  errorMessage.value = "";

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    clientSecret.value,
    {
      payment_method: {
        card: card,
      },
    }
  );

  if (error) {
    errorMessage.value = error.message;
    processing.value = false;
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    alert("付款成功！開始開通會員...");

    // 這裡呼叫你的後端開通會員 API
    try {
      const rest = await api.post("/api/stripe/activate-pro", {
        paymentIntentId: paymentIntent.id,
      });
      alert("已成為高級會員！");
      console.log("會員開通成功：", rest.data);
    } catch (err) {
      alert("會員開通失敗：" + err.message);
    }
    processing.value = false;
  }
}

onMounted(async () => {
  await createPaymentIntent();
  await setupStripeElements();
});
</script>

<style scoped>
.shake-on-click:active {
  transform: translateY(3px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
</style>
