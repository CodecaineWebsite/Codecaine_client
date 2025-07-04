<template>
  <div class="h-full w-full bg-[#131417] p-6 grid grid-rows-12">
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(140px,330px)_minmax(365px,760px)] row-span-3 flex-1 mb-8"
    >
      <div>
        <h3 class="text-xl font-bold mb-2">Profile Image</h3>
      </div>
      <div
        class="w-full max-w-190 h-full min-h-16 bg-[#1E1F26] rounded-lg flex flex-row gap-4 p-6"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="Avatar Preview"
          class="w-56 h-56 object-cover border-2 border-gray-600 rounded"
        />
        <div
          v-else
          class="w-56 h-56 bg-gray-700 flex items-center justify-center text-gray-400 rounded"
        >
          NO Image
        </div>
        <div>
          <label class="block">
            <button
              type="button"
              class="rounded bg-[#444857] text-white px-4 py-2 border-0 cursor-pointer hover:bg-[#5A5F73] transition-colors duration-200"
              @click="isCropModalOpen = true"
            >
              Select File
            </button>
          </label>
          <div class="mt-2 flex flex-col items-start gap-2 min-h-6">
            <div class="flex flex-row items-center gap-2 w-full">
              <span v-if="fileName" class="overflow-hidden">{{
                fileName
              }}</span>
              <span v-else class="text-gray-400">No file selected</span>
            </div>
          </div>
          <div
            v-if="message && message.target === 'avatar'"
            class="px-4 py-2 rounded text-sm font-medium mt-2"
            :class="
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            "
          >
            {{ message.text }}
          </div>
          <button
            v-if="fileName"
            @click="saveProfile('avatar')"
            type="button"
            class="rounded bg-[#05DF72] text-black px-4 py-2 font-bold hover:bg-[#04c862] transition self-end cursor-pointer mt-2"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </section>
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(140px,330px)_minmax(365px,760px)] row-span-5 flex-1 mb-8"
    >
      <div>
        <h3 class="text-xl font-bold mb-2">About You</h3>
        <p class="text-sm text-gray-500">
          Let others know more about you by providing optional information.
        </p>
      </div>
      <div
        class="w-full max-w-190 h-full min-h-16 bg-[#1E1F26] rounded-lg flex flex-col justify-center gap-4 p-6"
      >
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm">Username</label>
          <input
            v-model="userName"
            type="text"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 transition"
            :class="
              usernameError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-[#05DF72]'
            "
            maxlength="20"
            @input="handleUsernameInput"
            @keypress="preventInvalidChars"
            placeholder="All languages supported, no spaces"
          />
          <div v-if="usernameError" class="text-red-400 text-xs mt-1">
            {{ usernameError }}
          </div>
          <div v-else-if="userName" class="text-green-400 text-xs mt-1">
            ✓ Username is valid
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm">Display Name</label>
          <input
            v-model="displayName"
            placeholder="Optional"
            type="text"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm">Location</label>
          <input
            v-model="location"
            type="text"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="50"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-white text-sm">Bio</label>
          <textarea
            v-model="bio"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition resize-none"
            maxlength="100"
            rows="3"
          ></textarea>
          <div class="text-xs text-gray-400 text-right">
            {{ bio.length }}/100 characters used.
          </div>
        </div>
        <div
          v-if="message && message.target === 'profile'"
          class="px-4 py-2 rounded text-sm font-medium"
          :class="
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          "
        >
          {{ message.text }}
        </div>
        <button
          @click="saveProfile('profile')"
          class="mt-4 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition self-end cursor-pointer"
        >
          Save Profile
        </button>
      </div>
    </section>
    <section
      class="grid grid-cols-1 md:grid-cols-[minmax(140px,330px)_minmax(365px,760px)] row-span-4 flex-1 mb-8"
    >
      <div>
        <h3 class="text-xl font-bold mb-2">Profile Links</h3>
        <p class="text-sm text-gray-500">
          You can add up to three links to your profile. Maybe you’d like to add
          your portfolio or GitHub profile?
        </p>
      </div>
      <div
        class="w-full max-w-190 h-full min-h-16 bg-[#1E1F26] rounded-lg flex flex-col justify-center gap-4 p-6"
      >
        <div
          v-for="(link, idx) in profileLinks"
          :key="idx"
          class="flex flex-col"
        >
          <span class="text-white text-sm">Link #{{ idx + 1 }}</span>
          <input
            v-model="profileLinks[idx]"
            type="text"
            :placeholder="`Link ${idx + 1}`"
            class="w-full px-3 py-2 rounded bg-white text-black border-2 border-gray-600 focus:outline-none focus:border-[#05DF72] transition"
            maxlength="100"
          />
        </div>
        <div
          v-if="message && message.target === 'links'"
          class="px-4 py-2 rounded text-sm font-medium"
          :class="
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          "
        >
          {{ message.text }}
        </div>
        <button
          @click="saveProfile('links')"
          class="mt-4 px-4 py-2 bg-[#05DF72] text-black rounded font-bold hover:bg-[#04c862] transition self-end cursor-pointer"
        >
          Save Links
        </button>
      </div>
    </section>
  </div>
  <AvatarUploaderModal
    :isOpen="isCropModalOpen"
    @close="isCropModalOpen = false"
    @submit="handleCroppedBlob"
    @filename="originalFileName = $event"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import { useAuthStore } from "@/stores/useAuthStore";
import AvatarUploaderModal from "@/components/ui/AvatarUploaderModal.vue";
import api from "@/config/api";

const isCropModalOpen = ref(false);
const croppedAvatarBlob = ref(null);
const originalFileName = ref("avatar.jpg");
const authStore = useAuthStore();
const avatarUrl = ref("");
const fileName = ref("");
const profileLinks = ref(["", "", ""]);
const userName = ref("");
const displayName = ref("");
const location = ref("");
const bio = ref("");
const message = ref(null);
const usernameError = ref(null);

const isUsernameValid = computed(() => {
  const value = userName.value.trim();

  if (!value) return "Username is required.";
  if (value.length < 2) return "Username must be at least 2 characters.";
  if (value.length > 20) return "Username must be 20 characters or less.";
  if (/\s/.test(value)) return "Username cannot contain spaces.";
  if (/[<>:\"/\\|?*]/.test(value))
    return "Username contains invalid characters for URLs.";

  return null;
});

const preventInvalidChars = (event) => {
  const char = event.key;
  const isSpace = /\s/.test(char);
  const isControlKey = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ].includes(char);

  if (isSpace && !isControlKey) {
    event.preventDefault();
  }
};

const handleUsernameInput = (event) => {
  let value = event.target.value;
  const cleanValue = value.replace(/\s/g, "");

  if (cleanValue !== value) {
    userName.value = cleanValue;
    event.target.value = cleanValue;
  }
};

// Other existing functions remain unchanged
const handleCroppedBlob = (blob) => {
  fileName.value = originalFileName.value;
  croppedAvatarBlob.value = blob;
  const reader = new FileReader();
  reader.onload = (event) => {
    avatarUrl.value = event.target.result;
  };
  reader.readAsDataURL(blob);
  isCropModalOpen.value = false;
};

const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const saveProfile = async (target = "profile") => {
  if (target === "profile") {
    if (!userName.value.trim()) {
      message.value = {
        type: "error",
        text: "Username is required.",
        target: "profile",
      };
      return;
    }
    if (isUsernameValid.value) {
      message.value = {
        type: "error",
        text: isUsernameValid.value,
        target: "profile",
      };
      return;
    }
  }

  try {
    const userId = authStore.userProfile.id;
    const formData = new FormData();
    if (target === "profile") {
      formData.append("display_name", displayName.value);
      formData.append("username", userName.value);
      formData.append("location", location.value);
      formData.append("bio", bio.value);
    }
    if (target == "avatar") {
      if (croppedAvatarBlob.value) {
        const file = new File(
          [croppedAvatarBlob.value],
          originalFileName.value,
          { type: "image/jpeg" }
        );
        formData.append("profile_image", file);
      }
    }
    if (target === "links") {
      for (let i = 0; i < profileLinks.value.length; i++) {
        const link = profileLinks.value[i];
        if (link && !isValidUrl(link)) {
          message.value = {
            type: "error",
            text: `Link #${i + 1} is not a valid URL.`,
            target: "links",
          };
          return;
        }
      }
      formData.append("profile_link1", profileLinks.value[0]);
      formData.append("profile_link2", profileLinks.value[1]);
      formData.append("profile_link3", profileLinks.value[2]);
    }
    const res = await api.put(`/api/users/${userId}`, formData);
    message.value = {
      text: res.data.message,
      type: "success",
      target,
    };
    authStore.setUserProfile(res.data.user);
  } catch (err) {
    message.value = {
      text:
        target === "profile"
          ? "Failed to save profile."
          : "Failed to save links.",
      type: "error",
      target,
    };
    console.error(err);
  }
};

watchDebounced(
  userName,
  () => {
    usernameError.value = isUsernameValid.value;
  },
  { debounce: 300, immediate: true }
);

onMounted(() => {
  if (authStore.userProfile) {
    const {
      username,
      location: userLocation,
      display_name: userDisplayName,
      bio: userBio,
      profile_link1,
      profile_link2,
      profile_link3,
      profile_image_url,
    } = authStore.userProfile;
    userName.value = username || "";
    location.value = userLocation || "";
    displayName.value = userDisplayName || "";
    bio.value = userBio || "";
    profileLinks.value = [
      profile_link1 || "",
      profile_link2 || "",
      profile_link3 || "",
    ];
    avatarUrl.value = profile_image_url || "";
  }
});
</script>
