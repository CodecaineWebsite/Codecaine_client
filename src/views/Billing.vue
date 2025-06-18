<template>
  <div class="w-1/2">
    <div
      ref="cardElement"
      style="border: 1px solid #ccc; padding: 12px; border-radius: 6px"
    ></div>
    <p style="color: red">{{ errorMessage }}</p>

    <button :disabled="processing" @click="handleSubmit">
      {{ processing ? "付款中..." : "刷卡付款" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import api from "../config/api";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY // 替換成你的 Stripe 公鑰
);
const cardElement = ref(null);
const errorMessage = ref("");
const processing = ref(false);

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
