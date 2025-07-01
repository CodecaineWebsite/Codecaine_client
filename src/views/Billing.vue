<template>
  <div class="flex flex-col gap-4 mx-auto p-6 h-full w-full">
    <div class="max-w-3xl mx-auto p-6 w-full">
      <div class="bg-cc-16 rounded-lg p-4 border-2 border-cc-yellow border-dashed">
        <div>
          <h2 class="text-2xl font-bold mb-4 text-center">Why subscribe us?</h2>
          <ul class="list-disc mx-auto max-w-85 md:text-lg text-sm space-y-1 pl-5">
            <li>Unlimited public and private Doses</li>
            <li>Access to exclusive features</li>
            <li>Support the development of Codecaine</li>
          </ul>
          <div
            class="block md:flex justify-end items-center gap-3 mt-4 mb-2"
            v-if="!authStore.userProfile?.is_pro">
            <div
              class="text-lg font-extrabold text-gray-300 drop-shadow px-3 py-2 md:py-1"
              style="letter-spacing: 1px">
              Only NT$120 / month
            </div>
            <button
              @click="subscribe"
              class="w-full md:w-auto bg-yellow-300 hover:bg-yellow-500 text-black hover:text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors shake-on-click">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="authStore.userProfile?.is_pro && subscriptionInfo"
        class="relative card-dark-glow p-8 rounded-xl mt-6 mb-6 w-full max-w-3xl mx-auto text-white overflow-hidden transition-all duration-300">
        <div class="flex items-center justify-center h-20 pt-6">
          <CodecaineIcon class="w-75"/>
        </div>

        <div>
          <div
            class="font-extrabold m-4 text-cc-yellow text-center text-xl md:text-2xl drop-shadow animate-fade-in-up">
            You are currently subscribed to Codecaine.
          </div>
          <div class="text-center mt-2 text-lg text-cc-1 font-semibold">
            Start Date: {{ subscriptionInfo.subscribed_at || "—" }}<br />
            <template v-if="subscriptionInfo.cancel_at_period_end">
              Subscription will expire on
              {{ subscriptionInfo.current_period_end || "—" }} (cancellation
              requested)
            </template>
            <template v-else class="my-1">
              Next billing date:
              {{ subscriptionInfo.current_period_end || "—" }}
            </template>
          </div>
          <div
            v-if="!subscriptionInfo.cancel_at_period_end"
            class="mt-4">
            <button
              @click="showunsubscribeModal = true"
              class="mt-6 text-white font-bold py-1 shadow-lg transition-colors cursor-pointer shake-on-click border-b-2 border-cc-1 transition duration-300 ease-in-out
         hover:border-pink-400">
              Cancel Subscription
            </button>
            <ConfirmModal
              v-if="showunsubscribeModal"
              variant="danger"
              :confirm-text="'Confirm'"
              :cancelText="'Cancel'"
              :confirming="false"
              :loadingText="'Cancelling...'"
              @confirm="canConfirmUnsubscribe ? unSubscribe() : null"
              @cancel="
                () => {
                  showunsubscribeModal = false;
                  confirmName = '';
                }
              "
              :disabled="!canConfirmUnsubscribe">
              <template #title>
                Are you sure you want to cancel your subscription?
              </template>

              <template #message>
                <p>
                  Please type
                  <span class="font-bold text-pink-600">{{
                    authStore.userProfile?.username
                  }}</span>
                  to confirm.
                  <br />
                  <input
                    v-model="confirmName"
                    type="text"
                    class="border rounded px-2 py-1 mt-2 text-black bg-white"
                    placeholder="Enter your username" />
                </p>
                <p class="mt-3 text-sm text-white">
                  After cancellation, you will continue to enjoy Pro features
                  until the end of your current billing period.
                  <br />
                  You can re-subscribe at any time.
                  <br />
                  <span class="text-red-600 font-bold"
                    >This action will not delete your data.</span
                  >
                </p>
              </template>
            </ConfirmModal>
          </div>
          <div
            v-else
            class="mt-4 text-yellow-700 text-center font-bold">
            You have requested cancellation. Your subscription will end on the
            expiration date.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRoute } from "vue-router";
import api from "@/config/api";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import { useMsgStore } from "@/stores/useMsgStore";
import CodecaineIcon from "@/components/icons/CodecaineIcon.vue";

const authStore = useAuthStore();
const route = useRoute();
const msg = useMsgStore();

const showunsubscribeModal = ref(false);
const confirmName = ref("");
const subscriptionInfo = ref(null);

const productSub = () => {
  if (route.query.subscribed === "false") {
    msg.open({
      title: "Error",
      message: "Failed to create subscription session.",
      variant: "warning",
      confirmText: "OK",
    });
  }
};
const checkPendingPayment = async () => {
  try {
    const res = await api.get("/api/stripe/subscription-status");
    subscriptionInfo.value = res.data;
  } catch (error) {
    msg.open({
      title: "Error",
      message: "Failed to fetch subscription status.",
      variant: "warning",
      confirmText: "OK",
    });
    subscriptionInfo.value = null;
  }
};
const subscribe = async () => {
  try {
    const res = await api.post("/api/stripe/create-subscription-session", {
      username: authStore.userProfile.username,
    });

    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      msg.open({
        title: "Error",
        message: "Failed to create subscription session.",
        variant: "warning",
        confirmText: "OK",
      });
    }
  } catch (error) {
    msg.open({
      title: "Error",
      message: "Failed to create subscription session.",
      variant: "warning",
      confirmText: "OK",
    });
  }
};
const canConfirmUnsubscribe = computed(() => {
  return confirmName.value === authStore.userProfile?.username;
});
const unSubscribe = async () => {
  try {
    const res = await api.put("/api/stripe/cancel-subscription");
    await checkPendingPayment();
  } catch (error) {
    msg.open({
      title: "Error",
      message: "Failed to cancel subscription.",
      variant: "warning",
      confirmText: "OK",
    });
  }
  confirmName.value = "";
};

onMounted(() => {
  productSub();
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

.card-dark-glow::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0)
  );
  transition: width 0.4s ease;
  z-index: 0;
  pointer-events: none;
  border-radius: 1rem;
  backdrop-filter: blur(2px);
}
.card-dark-glow:hover::after {
  width: 100%;
}

.card-dark-glow > * {
  position: relative;
  z-index: 1;
}
</style>
