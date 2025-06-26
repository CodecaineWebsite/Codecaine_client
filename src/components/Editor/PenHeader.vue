<script setup>
	import { provide, ref, watch, nextTick, computed} from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useWorkStore } from '@/stores/useWorkStore'; 
  import { useAuthStore } from '@/stores/useAuthStore';
  import api from "@/config/api";
  import UserMenu from '@/components/UserMenu.vue';
  import PenIcon from '@/components/icons/PenIcon.vue';
  import PenSettingModal from '@/components/Editor/PenSettingModal.vue';
  import ProTag from './ProTag.vue';
  import Icon from '@/assets/icon.svg';
  import Edit from '@/assets/edit.vue';
  import Like from '@/assets/like.vue';
  import Run from '@/assets/run.vue';
  import Cloud from '@/assets/cloud.vue';
  import Arrow from '@/assets/arrow.vue';
  import Settings from '@/assets/settings.vue';
  import Layout from '@/assets/layout.vue';
  import { useHandleSave } from '@/utils/handleWorkSave';
  import LogoIcon from '@/components/icons/LogoIcon.vue';

  const route = useRoute();
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signup')
  }
  const handleLogin = () => {
    router.push('/login')
  }

  const workStore = useWorkStore();
  const authStore = useAuthStore();
  const { userProfile } = storeToRefs(authStore);
  const { currentWork } = storeToRefs(workStore); //放資料

  const isAutoPreview = ref(true);
  const userName = ref('');
  const isPro = ref(true);
  const isEdited = ref(false);

  // 判斷是否為作者
  const isAuthor = computed(() => {
    const userId = userProfile.value?.id;
    const authorId = currentWork.value?.userId;
    const isNewWork = !currentWork.value?.id;

    // 若 userId 尚未設定完成，暫時回傳 true 避免錯判
    if (!authorId) return true;
    return isNewWork || userId === authorId;
  });
  // 初始化 userName
  userName.value =
    currentWork.value?.userName ??
    userProfile.value?.username ??
    '';

  // 監聽 currentWork 更新 UI 狀態
  watch(currentWork, (newWork) => {
    if (!newWork) return;
    isPro.value = newWork.isPro ?? false;
    isAutoPreview.value = newWork.isAutoPreview ?? true;
    userName.value = newWork.userName ?? '';
  }, { deep: true });

  watch( () => [
      currentWork.value.title,
      currentWork.value.description,
      currentWork.value.html,
      currentWork.value.css,
      currentWork.value.javascript,
      currentWork.value.cdns,
      currentWork.value.links,
      currentWork.value.viewMode,
      currentWork.value.isAutoSave,
      currentWork.value.isAutoPreview,
      currentWork.value.isPrivate,
      currentWork.value.tags,
    ],
    () => {
      isEdited.value = true
    }
  )
  
  const isLoggedIn = computed(() => !!authStore.idToken);
  const navListVisible = ref(false);
  const saveOptionVisible = ref(false);
  const layoutOptionVisible = ref(false);
  const isEditing = ref(false);
  const settingOptionVisible = ref(false);
  const selectedTab = ref('');
  const title = computed({
    get: () => currentWork.value.title,
    set: (val) => currentWork.value.title = val,
  })
  provide('title', title)

  const isLoginModalShow = ref(false)
  const { handleSave } = useHandleSave();

  const handleWorkSave = async () => {
    navListVisible.value = false;
    if (!isLoggedIn.value) {
      isLoginModalShow.value = true;
      router.push({ path: route.path, query: { modal: 'login' } })
    } else {
      handleSave()
      isEdited.value = false;
    }
  };

  const handleWorkAutoSave = async () => {
    if (isLoggedIn.value) {
      handleSave()
      isEdited.value = false;
    }
  };

  const toggleSave = () => {
    saveOptionVisible.value = !saveOptionVisible.value    
  };
  const toggleLayout = () => {
    layoutOptionVisible.value = !layoutOptionVisible.value
  };
  const toggleSetting = (tab) => {
    selectedTab.value = tab;
    settingOptionVisible.value = !settingOptionVisible.value
  };
  const toggleList = () => {
    navListVisible.value = !navListVisible.value
  };


  const layoutOptions = [
    { id: 'left', rotation: -90, display: 'flex-row'},
    { id: 'center', rotation: 0, display: 'flex-col'},
    { id: 'right', rotation: 90, display: 'flex-row-reverse'}
  ];

  const selectedLayout = ref(layoutOptions[1]);
  const selectLayout = (layout) => {
    selectedLayout.value = layout
    currentWork.value.viewMode = layout.id // 回寫 store
    layoutOptionVisible.value = false
  }

  const titleInput = ref(null);

  const toggleEdit = () => {
    isEditing.value = true
    nextTick(() => {
      titleInput.value?.focus();
    });
  };

  const stopEdit = () => {
    isEditing.value = false
  };

  const emit = defineEmits(['run-preview'])

  function runPreview() {
    emit('run-preview')
  }
  const segments = route.path.split('/');
  const section = segments[2];
  const viewMode = ref(section)

  const handleChangeViewMode = (mode) => {
    viewMode.value = mode;
    router.push(`/${userName.value}/${viewMode.value}/${currentWork.value.id}`)
  }

  defineExpose({ toggleSetting, handleWorkAutoSave });

  // 收藏功能

  const isLiked = ref(false);
 
  const checkFavorite = async () => {
    if(!isLoggedIn.value || !currentWork.value?.id) return;
    try {
      const res = await api.get(`/api/favorites/check/${currentWork.value.id}`);
      isLiked.value = res.data.liked;
    } catch (err) {
      console.log.err("checkFavorite error", error)
    }
  }

  const toggleFavorite = async () => {
    if (!isLoggedIn.value) {
      isLoginModalShow.value = true;
      router.push({ path: route.path, query: { modal: "login"}})
      return;
    }

    try {
      if(!isLiked.value) {
        const res = await api.post(`/api/favorites/`, {
          pen_id:currentWork.value.id,
        });
        isLiked.value = true;
      } else {
        const res = await api.delete(`/api/favorites`,{
          data: {
            pen_id: currentWork.value.id,
          }
        });
        isLiked.value = false;
      }
    } catch(err) {
      console.error("toggleFavorite error", err);
    }
  }

  watch(
    () => currentWork.value?.id,
    (newId) => {
      if (newId) checkFavorite();
    },
    { immediate: true }
  );
</script>

<template>
    <nav class="relative md:h-16 h-14 w-full bg-black flex items-center justify-between">
      <div class="flex items-center ml-2">
        <a href="/" class="flex items-center justify-center w-10 mr-1">
          <LogoIcon alt="icon"/>
        </a>
        <div class="flex flex-col gap-1 flex-1 min-w-0">
          <div class="flex items-center w-full min-w-0">
            <template v-if="isEditing">
              <input
                ref="titleInput"
                v-model="title"
                @blur="stopEdit"
                @keyup.enter="stopEdit"
                class="h-3 md:h-5 bg-transparent text-white font-black text-sm md:text-lg leading-none outline-none w-full appearance-none"
              />
            </template>
            <template v-else>
              <span class="h-3 md:h-5 text-white font-black text-sm md:text-lg leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                {{ title.length ? title : "Untitled" }}
              </span>
            </template>
            <button type="button" class="ml-1" @click="toggleEdit" v-if="!isEditing && isAuthor" >
              <Edit class="w-[13px] h-[13px] hover:cursor-pointer" />
            </button>
          </div>
          <router-link
            v-if="userName"
            :to="`/${userName}/doses/showcase`"
            :title="userName"
            class="text-xs md:text-11 text-gray-400 whitespace-nowrap leading-none overflow-hidden text-ellipsis"
          >
            {{ userName }}
          </router-link>
          <span v-else class="text-xs md:text-11 text-gray-400">Captain Anonymous</span>
        </div>
      </div>

      <div class="flex items-center gap-1 md:gap-2 mr-2 md:mr-3 ">
        <button v-if="isLoggedIn"
        @click="toggleFavorite" type="button" class="text-[aliceblue] rounded px-3 md:px-5 py-1 md:py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer">
          <div class="h-7 flex items-center">
            <Like 
            class="w-4" 
            :class="isLiked ? 'fill-cc-red' : 'fill-current'"/>
          </div>
        </button>

        <button v-if="viewMode === 'full'" type="button" class="text-[aliceblue] rounded px-3 md:px-5 py-1 md:py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" @click="handleChangeViewMode('pen')">
          <div class="h-7 flex">
            <span class="md:inline hidden">View Source Code</span>
            <PenIcon class="w-4 block sm:hidden"/>
          </div>
        </button>

        <button v-if="!currentWork.isAutoPreview && viewMode !== 'full'" type="button" class="text-[aliceblue] rounded px-1 py-1 md:px-4 md:py-2 bg-[#444857] mr-[1px] editorSmallButton-hover-bgc  hover:cursor-pointer" @click="runPreview">
          <div class="h-7 flex items-center gap-1 text-xs md:text-15">
            <Run class="w-4" />
            <span>Run</span>
          </div>
        </button>
        <div class="md:flex hidden" v-if="viewMode !== 'full' && isAuthor">
          <button type="button" class="text-[aliceblue] rounded-l px-5 py-2 bg-[#444857] mr-[1px] editorSmallButton-hover-bgc  hover:cursor-pointer relative"
            :class="{ 'rounded mr-[2px]': !isLoggedIn }" @click.prevent="handleWorkSave">
            <span  
              class="h-[3px] bg-yellow-300 absolute mx-auto left-1 right-1 top-0.5 origin-center rounded-t-md transition-all duration-500"
              :class="{
                'w-21': isEdited,
                'w-0': !isEdited,
              }">
            </span>
            <div class="h-7 flex items-center gap-1 ">
              <Cloud class="w-4 text-white" alt="saveBtn"/>
              <span class="text-15">Save</span>
            </div>
          </button>
          <div class="relative">
            <div v-if="saveOptionVisible" class="fixed inset-0 z-40 transition-opacity duration-200" @click="toggleSave"></div>
            <button v-if="isLoggedIn" @click.prevent="toggleSave" type="button"
              class="relative text-[aliceblue] rounded-r  py-2 bg-[#444857] flex justify-center items-center w-6.5 editorSmallButton-hover-bgc  hover:cursor-pointer">
              <div class="h-7 flex justify-center items-center">
                <Arrow class="w-2.5 h-2.5 fill-current text-gray-400"/>
              </div>
            </button>
            <div v-if="saveOptionVisible" class="fixed inset-0 transition-opacity duration-200" @click="toggleSave"></div>
            <ul 
              v-if="saveOptionVisible" class="absolute z-50 flex flex-col rounded-sm top-12 right-0 bg-[#2C303A] text-white w-80 justify-around border-4 border-gray-800 px-5"
            >
              <label class="flex py-2  justify-between border-b border-gray-600 hover:cursor-pointer">
                <span>Private <ProTag/> </span>
                <div class="flex items-center">
                  <div class="relative inline-block w-[52px] h-7">
                    <input
                      type="checkbox"
                      class="opacity-0 w-0 h-0 peer"
                      :disabled="!isPro"
                      v-model="currentWork.isPrivate"
                    />
                    <span
                      class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl 
                            peer-checked:bg-green-400 transition 
                            before:content-[''] before:h-8 before:w-8 before:left-0 before:-bottom-0.5 
                            before:bg-white before:transition before:absolute before:rounded-4xl 
                            peer-checked:before:translate-x-5

                            peer-disabled:bg-gray-200
                            peer-disabled:before:bg-gray-400
                      "
                    ></span>
                  </div>
                  <span class="ml-2 text-cc-1 peer-disabled:text-gray-400 peer-disabled:opacity-50">
                    <span class="">{{ currentWork.isPrivate ? 'On' : 'Off' }}</span> 
                  </span>
                </div>
              </label>
              <label class="flex py-2 justify-between border-b border-gray-600 hover:cursor-pointer">
                <span>Template</span>
                <div>
                  <div class="relative inline-block w-13 h-7 ">
                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                    <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400  transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition  before:absolute before:rounded-4xl  peer-checked:before:translate-x-6"></span>
                  </div>
                  <span class="ml-2">off</span>   
                </div>
              </label>
              <label class="flex py-2 justify-between border-b border-gray-600 hover:cursor-pointer" >
                <span>Auto Save</span>
                <div>
                  <div class="relative inline-block w-13 h-7 ">
                    <input type="checkbox" class="opacity-0 w-0 h-0 peer" v-model="currentWork.isAutoSave" >
                    <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400  transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition  before:absolute before:rounded-4xl  peer-checked:before:translate-x-6"></span>
                  </div>
                  <span class="ml-2">{{ currentWork.isAutoSave ? 'on' : 'off' }}</span>              
                </div>
                
              </label>
              <label class="flex py-2 justify-between hover:cursor-pointer">
                <span>Format Code on Save</span>
                <div>
                <div class="relative inline-block w-13 h-7 ">
                  <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                  <span
                    class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400  transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition  before:absolute before:rounded-4xl  peer-checked:before:translate-x-6"
                    ></span>
                </div>
                <span class="ml-2">off</span>  
                </div>
              </label>
            </ul>
          </div>
        </div>
        <div v-if="navListVisible" class="fixed inset-0 z-40 transition-opacity duration-200" @click="toggleList"></div>
        <!-- todo -->
        <button v-if="viewMode !== 'full'"  @click.prevent="toggleList" type="button" class="flex md:hidden text-[aliceblue] rounded px-1 py-1 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" >
          <div class="h-7 flex justify-between w-6 items-center">
            <div class="transition-transform h-0.5 bg-gray-200 relative before:content-[''] before:w-1.5 before:h-0.5 before:bg-gray-200 before:absolute before:-top-1.5 before:left-0 after:content-[''] after:w-3.5 after:h-0.5 after:bg-gray-200 after:absolute after:-bottom-1.5 after:left-0" :class="navListVisible ? 'before:w-2 w-1.5' : 'before:w-1.5 w-2.5'"></div>
            <Arrow class="w-3 h-3 fill-current transition-transform self-start mt-1.5" :class=" {'scale-y-[-1]':navListVisible}"/>
          </div>
        </button>
        <div v-if="navListVisible" class="z-50 absolute flex flex-col top-14 right-0 w-55 gap-1 py-1 bg-[#1E1F26] rounded-sm">
          <button v-if="isAuthor" class="flex w-full px-2 py-1 hover:bg-gray-500" @click.prevent="handleWorkSave">
            <Cloud class="w-4 mx-1" alt="saveBtn"/>
            <span>Save</span>
          </button>
          <button @click.prevent="toggleSetting('html')" class="flex w-full px-2 py-1 hover:bg-gray-500">
            <Settings class="w-4 mx-1"/>
            <span>Settings</span>
          </button>
          <div class="w-full bg-gray-700 h-[1px] mb-4"></div>
        </div>
        <button v-if="viewMode !== 'full'" @click.prevent="toggleSetting('html')" type="button" class="hidden md:flex text-[aliceblue] rounded px-4 py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" >
          <div class="h-7 flex items-center gap-1">
            <Settings alt="settingBtn" class="w-4"/>
            <span class="text-15">Settings</span>
          </div>
        </button>
        <div v-if="settingOptionVisible" class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200" @click="toggleSetting('html')"></div>
        <PenSettingModal :selectedTab="selectedTab" v-if="settingOptionVisible" @close="toggleSetting('html')" class="z-50" />
        <div class="relative md:flex hidden" >
          <button  v-if="viewMode !== 'full'" type="button" @click.prevent="toggleLayout" class="text-[aliceblue] rounded px-4 py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer">
            <div class="h-7 flex items-center gap-1">
              <Layout class="w-3.5" :style="{ transform: `rotate(${selectedLayout.rotation}deg)` }"/>
            </div>
          </button>
          <div v-if="layoutOptionVisible" class="fixed inset-0 z-40 transition-opacity duration-200" @click="toggleLayout"></div>
          <div v-if="layoutOptionVisible" class="absolute z-50 bg-[#2C303A] top-12 right-0 pt-3 pb-1 rounded-lg border-4 border-gray-800">
            <div class="px-3 text-white">
              <span>Change View</span>
            </div>
            <div class="flex justify-center align-middle py-2">
              <div class="flex justify-center align-middle py-1">
                <label
                  v-for="option in layoutOptions" :key="option.id" class="border-2 border-[#444857] w-20 flex justify-center h-12 editorSmallButton-hover-bgc   hover:cursor-pointer" :class="{ 'rounded-l-sm': option.id === 'left', 'rounded-r-sm': option.id === 'right', 'bg-[#444857]': selectedLayout.id === option.id }"
                >
                  <button @click="selectLayout(option) " class=" hover:cursor-pointer">
                    <Layout class="w-5" :style="{ transform: `rotate(${option.rotation}deg)` }"/>
                  </button>
                </label>
              </div>
            </div>
            <ul
              class="relative flex flex-col rounded-sm right-0 bg-[#2C303A] text-white w-65 justify-between text-sm p-1"
              v-if="currentWork.id"
            >
              <li
                class="flex py-1 px-5 justify-between transition duration-300"
                :class="viewMode === 'pen'
                  ? 'bg-[#404654] text-cc-1'
                  : 'text-[#AEB3BD] hover:bg-[#404654] hover:text-cc-1'"
                @click.prevent="handleChangeViewMode('pen')"
              >
                <a href="#" class="flex justify-between w-full">
                  <div>Editor View</div>
                  <div>/dose/</div>
                </a>
              </li>
              <li
                class="flex py-1 px-5 justify-between transition duration-300"
                :class="viewMode === 'full'
                  ? 'bg-[#404654] text-cc-1'
                  : 'text-[#AEB3BD] hover:bg-[#404654] hover:text-cc-1'"
                @click.prevent="handleChangeViewMode('full')"
              >
                <a href="#" class="flex justify-between w-full">
                  <div>Full Page View</div>
                  <div>/full/</div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <button v-if="!isLoggedIn" type="button" class="text-black rounded px-1 py-1 md:px-4 md:py-2 bg-[#47cf73] hover:cursor-pointer" @click="handleSignUp">
          <div class="h-7 flex items-center gap-1 whitespace-nowrap text-xs md:text-15">
            <span>Sign Up</span>
          </div>
        </button>
        <button v-if="!isLoggedIn" type="button" class="text-[aliceblue] rounded px-1 py-1 md:px-4 md:py-2 bg-[#444857] hover:cursor-pointer" @click="handleLogin">
          <div class="h-7 flex items-center gap-1 whitespace-nowrap text-xs md:text-15">
            <span>Log In</span>
          </div>
        </button>
        <div v-if="isLoggedIn" class="mx-1 rounded hover:cursor-pointer">
          <UserMenu />
        </div>
     </div>
    </nav>

</template>