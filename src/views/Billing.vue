<template>
  <div class="h-full w-full p-6">
    <div class="max-w-md mx-auto mt-10 p-6 rounded-xl shadow bg-white">
      <h2 class="text-2xl font-bold mb-4">高級會員方案</h2>
      <p class="mb-4 text-gray-700">
        每月只需 <span class="font-semibold text-blue-600">$10</span>
      </p>

      <!-- PayPal 按鈕掛載區 -->
      <div id="paypal-button-container"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const clientId = ""; // 替換為你的 Sandbox Client ID

const renderPaypalButton = () => {
  window.paypal
    .Buttons({
      createSubscription: (data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
        });
      },
      onApprove: async (data, actions) => {
        console.log("訂閱成功", data.subscriptionID);

        // 呼叫後端 API 開通會員
        await fetch("/api/user/upgrade-to-pro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer yourUserToken", // 如果有登入驗證
          },
          body: JSON.stringify({
            subscriptionId: data.subscriptionID,
          }),
        });

        alert("你已成功訂閱成為高級會員！");
      },
    })
    .render("#paypal-button-container");
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
  script.addEventListener("load", renderPaypalButton);
  document.body.appendChild(script);
});
</script>
