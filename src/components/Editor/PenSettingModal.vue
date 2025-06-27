<script setup>
import { inject, ref, watch, computed } from "vue";
import { useWorkStore } from "@/stores/useWorkStore";
import { useAuthStore } from '@/stores/useAuthStore';
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useHandleSave } from "@/utils/handleWorkSave";
import { useToastStore } from "@/stores/useToastStore";
import SettingCard from "@/components/Editor/SettingCard.vue";
import SettingInput from "@/components/Editor/SettingInput.vue";
import SettingTagInput from "@/components/Editor/SettingTagInput.vue";
import SettingTextarea from "@/components/Editor/SettingTextarea.vue";
import SettingSelect from "@/components/Editor/SettingSelect.vue";
import Cdnjs from "@/components/Editor/Cdnjs.vue";
import ProTag from "@/components/Editor/ProTag.vue";
import TrashCanIcon from "@/components/icons/TrashCanIcon.vue";

const toastStore = useToastStore();
const workStore = useWorkStore();
const authStore = useAuthStore();
const { showToast } = toastStore;
const { currentWork } = storeToRefs(workStore);
const { userProfile } = storeToRefs(authStore);
const router = useRouter();
const props = defineProps({
  cdns: {
    type: Array,
    default: () => [],
  },
  links: {
    type: Array,
    default: () => [],
  },
  selectedTab: {
    type: String,
    default: "html",
  },
});

const isAuthor = computed(() => {
  const userId = userProfile.value?.id;
  const authorId = currentWork.value?.userId;
  const isNewWork = !currentWork.value?.id;

  // 若 userId 尚未設定完成，暫時回傳 true 避免錯判
  if (!authorId) return true;
  return isNewWork || userId === authorId;
});

const title = inject("title");
const emit = defineEmits(["close", "update:cdns", "update:links", "update:modelValue"]);
const tabs = [
  { label: "HTML", key: "html" },
  { label: "CSS", key: "css" },
  { label: "JS", key: "js" },
...(isAuthor.value ? [{ label: "Dose Detail", key: "detail", gapBefore: true }] : []),
...(isAuthor.value ? [{ label: "Privacy", key: "privacy"}] : []),
...(isAuthor.value ? [{ label: "Behavior", key: "behavior"}] : [{ label: "Behavior", key: "behavior", gapBefore: true }]),
  { label: "Editor", key: "editor" },
];

const htmlClass = ref(currentWork.value.htmlClass)
const headStuff = ref(currentWork.value.headStuff)
const cdns = ref(currentWork.value.cdns)
const links = ref(currentWork.value.links)
const isPro = ref(currentWork.value.isPro)
const tabSize = ref(currentWork.value.tabSize)
const doseDescription = ref(currentWork.value.description)

watch(
  cdns,
  (newCDNs) => {
    workStore.updateCDNs(newCDNs);
  },
  { deep: true }
);

watch(
  links,
  (newLinks) => {
    workStore.updateLinks(newLinks);
  },
  { deep: true }
);

watch(htmlClass, (newhtmlClass) => {
  workStore.updateHtmlClass(newhtmlClass)
}, { deep: true })

watch(headStuff, (newStuff) => {
  workStore.updateHeadStuff(newStuff)
}, { deep: true })

watch(doseDescription, (newVal) => {
  currentWork.value.description = newVal;
});

const activeTab = ref(props.selectedTab);
const cdnInput = ref([]);
const linkInput = ref("");
const srcDoc = ref("");

const isValidUrl = (url) => /^https?:\/\/.+/.test(url);
function handleSelectedPackage(packageData) {
  const selectedCDN = packageData.latest;
  if (!isValidUrl(selectedCDN)) {
    showToast({
      message: "Please enter a valid CDN URL (must start with http or https)",
      variant: "danger",
    });
    return;
  }
  if (cdns.value.includes(selectedCDN)) {
    showToast({
      message: "This CDN has already been added!",
      variant: "danger",
    });
    return;
  }
  cdns.value.push(selectedCDN);
  cdnInput.value = "";
}
const addCDN = () => {
  const url = cdnInput.value.trim();
  if (!isValidUrl(url)) {
    showToast({
      message: "Please enter a valid CDN URL (must start with http or https)",
      variant: "danger",
    });
    return;
  }
  if (cdns.value.includes(url)) {
    showToast({
      message: "This CDN has already been added!",
      variant: "danger",
    });
    return;
  }
  cdns.value.push(url);
  cdnInput.value = "";
};
const removeCDN = (index) => {
  cdns.value.splice(index, 1);
};
const addLink = () => {
  const url = linkInput.value.trim();
  if (!isValidUrl(url)) {
    showToast({
      message: "Please enter a valid link URL (must start with http or https)",
      variant: "danger",
    });
    return;
  }
  if (links.value.includes(url)) {
    showToast({
      message: "This link has already been added!",
      variant: "danger",
    });
    return;
  }
  links.value.push(url);
  linkInput.value = "";
};
const removeLink = (index) => {
  links.value.splice(index, 1);
};

const { handleSave } = useHandleSave();
const handleSaveAndClose = () => {
  handleSave();
  emit("close");
};
const closeModal = () => {
  emit("close");
}
</script>
<template>
  <div
    class="fixed md:translate-y-4/7 translate-y-1/2 left-1/2 -translate-x-1/2 md:h-4/5 h-11/12 md:w-175 max-w-185 w-full pb-20 px-2"
  >
    <div
      class="flex flex-col rounded-t-md bg-cc-17 text-white border-x-3 border-t-3 border-cc-pensettingmodal-border h-full w-full"
    >
      <div class="mx-4 pt-4">
        <div class="flex justify-between">
          <span
            class="after:content-[''] after:border-b-2 after:border-green-400 after:absolute after:-bottom-0.5 after:left-0 after:w-full relative pb-1"
            >Dose Settings</span
          >
          <button
            type="button"
            @click.prevent="emit('close')"
            class="right-1 bg-[#424655] w-7 flex justify-center h-4"
          >
            <svg class="w-2.5" viewBox="0 0 100 100">
              <path
                fill="white"
                d="M96.8 83.7L63.1 50l33.7-33.7c3.6-3.6 3.6-9.4 0-13.1s-9.5-3.6-13.1 0L50 36.9 16.3 3.2C12.7-.4 6.9-.4 3.2 3.2s-3.6 9.5 0 13.1L36.9 50 3.2 83.7c-3.6 3.6-3.6 9.4 0 13.1s9.5 3.6 13.1 0L50 63.1l33.7 33.7c3.6 3.6 9.4 3.6 13.1 0s3.6-9.5 0-13.1z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="w-full h-0.5 bg-gray-600 mb-4"></div>
      </div>
      <div class="md:flex h-full md:pr-4 block overflow-y-auto mx-4 md:mx-0">
        <ul
          class="md:w-1/4 flex md:flex-col md:overflow-y-auto md:pl-0 overflow-y-auto"
        >
          <li
            v-for="tab in tabs"
            :key="tab.key"
            tabindex="0"
            @click.prevent="activeTab = tab.key"
            class="whitespace-nowrap transition cursor-pointer hover:bg-cc-14 px-2 md:px-1.5 py-2 md:py-1 md:pl-4 ml-1 md:ml-0 relative before:content-none md:before:content-[''] before:absolute before:w-0 before:h-full before:left-0 before:top-0 focus:before:bg-green-500 before:transition-all before:duration-200"
            :class="{
              'before:bg-green-500 before:w-1': activeTab === tab.key,
              'md:mt-4': tab.gapBefore,
              'bg-cc-14': activeTab === tab.key,
            }"
          >
            {{ tab.label }}
            <ProTag v-if="tab.key === 'privacy'" />
          </li>
        </ul>
        <div
          class="md:hidden w-full flex mb-1 md:before:content-none before:content-[''] before:relative before:w-full before:h-0.5 before:bg-gray-700"
        ></div>
        <div class="md:w-3/4 md:pl-6 w-full h-11/12 overflow-y-auto">
          <div v-show="activeTab === 'html'" class="w-full flex flex-col gap-4">
            <SettingInput
              id="addClassToHtml"
              label="Add Class(es) to <html>"
              placeholder="e.g. single post post-1234"
              v-model="currentWork.htmlClass"
            />
            <SettingTextarea
              id="stuffForHead"
              label="Stuff for <head>"
              placeholder="e.g. <meta>, <link>, <script>"
              v-model="currentWork.headStuff"
            />
          </div>

          <div v-show="activeTab === 'css'" class="w-full flex flex-col gap-4">
            <SettingInput
              id="addExternalStylesheets"
              label="Add External Stylesheets / Doses"
              placeholder="Enter Link script URL"
              v-model="linkInput"
              @keyup.enter="addLink"
            >
              <button
                @click="addLink"
                class="mb-4 bg-gray-600 text-white w-full mt-3 px-3 py-1 rounded hover:bg-gray-700 "
              >
                ➕ 加入 Link
              </button>
              <ul class="mb-4 list-disc list-inside">
                  <li
                    v-for="(link, index) in links"
                    :key="link"
                    class="flex items-center justify-between gap-2"
                  >
                    <span class="break-words max-w-[80%]">{{ link }}</span>
                  <button
                  @click="removeLink(index)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    <TrashCanIcon class="w-4"/>
                  </button>
                  </li>
                </ul>
            </SettingInput>
          </div>

          <div v-show="activeTab === 'js'" class="w-full flex flex-col gap-4">
            <SettingCard
              id="addExternalScripts"
              label="Add External Scripts / Doses"
            >
              <Cdnjs @select="handleSelectedPackage" />
              <label>
                <input
                  v-model="cdnInput"
                  @keyup.enter="addCDN"
                  type="text"
                  placeholder="Enter CDN script URL"
                  class="appearance-none w-full border border-gray-300 rounded-sm px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500 mb-3 placeholder:text-gray-500"
                />
              </label>
              <button
                @click="addCDN"
                class="mb-4 bg-gray-600 text-white w-full px-3 py-1 rounded hover:bg-gray-700"
              >
                ➕ Add CDN
              </button>
              <ul class="mb-4">
                <li
                  v-for="(cdn, index) in cdns"
                  :key="cdn"
                  class="appearance-none w-full border border-gray-300 rounded-sm px-2 py-2 mb-2 bg-white text-gray-500 flex items-center justify-between"
                >
                  <span class="max-w-[90%] text-xs truncate">{{ cdn }}</span>
                  <button
                    @click="removeCDN(index)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    <TrashCanIcon class="w-4"/>
                  </button>
                </li>
              </ul>
            </SettingCard>
          </div>

          <div
            v-show="activeTab === 'detail'"
            class="w-full flex flex-col gap-4"
          >
            <SettingInput
              id="penTitle"
              v-model="title"
              label="Dose Title"
              placeholder="Untitled"
            />
            <SettingTextarea
              id="penDescription"
              label="Dose Description"
              placeholder="Explain what's going on in your Dose here. This text is searchable, so it can also help others find your work. Remember to credit others where credit is due. Markdown supported."
              v-model="doseDescription"
              class="placeholder:text-xs h-24"
            />
            <SettingTagInput/>
          </div>

          <div
            v-show="activeTab === 'privacy'"
            class="w-full flex flex-col gap-4"
          >
            <div
              v-if="isPro"
              class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-gray-500 before:content-[''] before:absolute before:top-0 before:left-0"
            >
              <div class="flex flex-col">
                <label> Privacy </label>
                <span class="text-xs align-text-bottom mb-4 mt-1"
                  >Set this Dose as private. Only you can access it .</span
                >
              </div>
              <label class="py-2 hover:cursor-pointer">
                <div class="relative inline-block w-13 h-7">
                  <input
                    type="checkbox"
                    class="opacity-0 w-0 h-0 peer"
                    v-model="currentWork.isPrivate"
                  />
                  <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400 transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition before:absolute before:rounded-4xl peer-checked:before:translate-x-6"
                  ></span>
                </div>
              </label>
              <span class="ml-4">{{
                currentWork.isPrivate ? "On" : "Off"
              }}</span>
            </div>
            <div
              v-else
              class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-gray-500 before:content-[''] before:absolute before:top-0 before:left-0"
            >
              <div class="flex flex-col items-center justify-center gap-3 py-3">
                <div class="my-4">
                  <img
                    src="https://cpwebassets.codepen.io/assets/pro/privacy-048c44f7b51ade74eef277e8027a41fe1a8651c393278b25a807ad7ea79f8418.svg"
                    alt=""
                  />
                </div>
                <h4 class="font-semibold text-15">
                  Keep it secret; keep it safe.
                </h4>
                <p class="font-thin text-15 text-center">
                  Private Doses are hidden everywhere on Codecaine, except to
                  you. You can still share them and other people can see them,
                  they just can't find them through searching or browsing.
                </p>
                <!-- todo 加入導向升級pro頁面 -->
                <a
                  href="#"
                  @click.prevent="router.push('/settings/billing')"
                  class="py-2 px-3 bg-cc-yellow rounded text-cc-20 hover:text-cc-1 hover:bg-cc-yellow-dark"
                  >Upgrade to PRO</a
                >
              </div>
            </div>
          </div>

          <div
            v-show="activeTab === 'behavior'"
            class="md:w-3/4 w-full flex flex-col gap-4"
          >
            <div
              class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-cc-13 before:content-[''] before:absolute before:top-0 before:left-0"
            >
              <div class="flex flex-col">
                <label for="autoSave">Auto Save</label>
                <span class="text-xs align-text-bottom mb-4 mt-1"
                  >If active, Doses will autosave every 30 seconds after being
                  saved once.</span
                >
              </div>
              <label class="py-2 hover:cursor-pointer">
                <div class="relative inline-block w-13 h-7">
                  <input
                    type="checkbox"
                    class="opacity-0 w-0 h-0 peer"
                    v-model="currentWork.isAutoSave"
                  />
                  <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400 transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition before:absolute before:rounded-4xl peer-checked:before:translate-x-6"
                  ></span>
                </div>
              </label>
              <span class="ml-4">{{
                currentWork.isAutoSave ? "on" : "off"
              }}</span>
            </div>
            <div
              class="relative editorSettingCard-linear-bgc py-3 px-4 w-full before:h-full before:w-1 before:bg-cc-13 before:content-[''] before:absolute before:top-0 before:left-0"
            >
              <div class="flex flex-col">
                <label for="autoUpdatingPreview">Auto-Updating Preview</label>
                <span class="text-xs align-text-bottom mb-4 mt-1"
                  >If enabled, the preview panel updates automatically as you
                  code. If disabled, use the "Run" button to update.</span
                >
              </div>
              <label class="py-2 hover:cursor-pointer">
                <div class="relative inline-block w-13 h-7">
                  <input
                    type="checkbox"
                    class="opacity-0 w-0 h-0 peer"
                    v-model="currentWork.isAutoPreview"
                  />
                  <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400 transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition before:absolute before:rounded-4xl peer-checked:before:translate-x-6"
                  ></span>
                </div>
              </label>
              <span class="ml-4">{{
                currentWork.isAutoPreview ? "on" : "off"
              }}</span>
            </div>
          </div>

          <div
            v-show="activeTab === 'editor'"
            class="w-full flex flex-col gap-4"
          >
            <SettingSelect
              id="codeIndentWidth"
              v-model="tabSize"
              label="Code Indent width"
            >
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
              <option :value="6">6</option>
            </SettingSelect>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-cc-15 rounded-b-md shadow-lg w-full flex flex-col py-4 px-2">
      <button
        v-if="isAuthor"
        type="button"
        @click.prevent="handleSaveAndClose"
        class="self-end bg-green-400 text-black rounded-md p-3"
        >
        Save & Close
      </button>
      <button
          v-if="!isAuthor"
          type="button"
          @click.prevent="closeModal"
          class="self-end bg-green-400 text-black rounded-md p-3"
        >
        Close
      </button>
    </div>
  </div>
</template>
