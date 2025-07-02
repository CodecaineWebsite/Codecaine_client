import { defineStore } from "pinia";
import { ref } from "vue";

export const useMsgStore = defineStore("messageModal", () => {
  const show = ref(false);
  const title = ref("");
  const message = ref("");
  const variant = ref("warning");
  const confirmText = ref("OK");
  const cancelText = ref("");
  const confirming = ref(false);
  const loadingText = ref("Processing...");
  const onConfirm = ref(null);

  function open({
    title: t,
    message: m,
    variant: v = "warning",
    confirmText: c = "OK",
    cancelText: ct = "",
    confirming: cg = false,
    loadingText: lt = "Processing...",
    onConfirm: oc = null,
  }) {
    title.value = t;
    message.value = m;
    variant.value = v;
    confirmText.value = c;
    cancelText.value = ct;
    confirming.value = cg;
    loadingText.value = lt;
    onConfirm.value = oc;
    show.value = true;
  }
  function close(isConfirm = false) {
    show.value = false;
    if (isConfirm && onConfirm.value) onConfirm.value();
    onConfirm.value = null;
  }

  return {
    show,
    title,
    message,
    variant,
    confirmText,
    cancelText,
    confirming,
    loadingText,
    open,
    close,
  };
});
