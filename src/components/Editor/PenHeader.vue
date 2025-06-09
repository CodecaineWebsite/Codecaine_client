<script setup>
	import { provide, ref, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router'

  import { storeToRefs } from 'pinia'
  import { useWorkStore } from '@/stores/workStore';
  
  import PenIcon from '../icons/PenIcon.vue';
  import PenSetting from './PenSetting.vue';
  
  import Icon from '../../assets/icon.svg';
  import Edit from '../../assets/edit.svg';
  import Like from '../../assets/like.svg';
  import Run from '../../assets/run.svg';
  import Cloud from '../../assets/cloud.svg';
  import Arrow from '../../assets/arrow.svg';
  import ArrowWhite from '../../assets/arrow-white.svg';
  import Settings from '../../assets/settings.svg';
  import Layout from '../../assets/layout.svg';
  import { computed } from 'vue';
  
  const route = useRoute();
  const router = useRouter();
  const workStore = useWorkStore()
  const { handleCurrentIdChange  }= workStore; //放function
  const { currentWork } = storeToRefs(workStore); //放資料
  handleCurrentIdChange(route.params.id)
  
	const isAutoPreview = ref(true);
	const isLoggedIn = ref(false);
  const navListVisible = ref(false);
  // console.log(isAutoPreview);

  watch( currentWork ,(newValue) => {
    isAutoPreview.value = newValue.is_autopreview
    
  }, { deep: true })
  
  const saveOptionVisible = ref(false);
  const layoutOptionVisible = ref(false);
  const bookmarkVisible = ref(false);
  // 之後改成userTable中資料形式
  const userName = ref(123);
  const isEditing = ref(false);
  const settingOptionVisible = ref(false);
  // const title = computed({
  //   get: () => currentWork.value.title,
  //   set: (val) => currentWork.value.title = val,
  // })
  const title = ref("")
  watch(currentWork, (newWork) => {
    if(newWork) {
      title.value = newWork.title;
    }
  })
  provide('title', title)

  const isLoginModalShow = ref(false)

  const handleSave = async() => {
    if(isLoggedIn.value) {
      // 執行儲存api
    } else {
      isLoginModalShow.value = true;
      router.push({ path: '/pen', query: { modal: 'login' } })
    }
  }
  const closeModal = () => {
    isLoginModalShow.value = false;
    router.replace({
      query: {
        ...route.query,
        modal: undefined,
      },
    })
  }
 
  const toggleSave = () => {
    saveOptionVisible.value = !saveOptionVisible.value    
  };
  const toggleLayout = () => {
    layoutOptionVisible.value = !layoutOptionVisible.value
  };
  const toggleSetting = () => {
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
    currentWork.value.view_mode = layout.id // 回寫 store
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
</script>

<template>
    <nav class="relative md:h-16 h-14 w-full bg-black flex items-center justify-between">
      <div class="flex items-center ml-2">
        <a href="/" class="flex text-0 ">
          <img :src="Icon" alt="icon" class=" w-9 mb-2 ml-1 mr-2 ">
        </a>
        <div>
          <template v-if="isEditing">
            <input ref="titleInput" v-model="title" @blur="stopEdit" @keyup.enter="stopEdit"
              class="bg-transparent border-b border-white text-white outline-none" />
          </template>
          <template v-else>
            <span class="text-white font-black">{{ title.length? title : "Untitled" }}</span>
          </template>
          <button type="button" class="ml-1" @click="toggleEdit">
            <img :src="Edit" alt="editBtn" class="w-[13px] h-[13px] hover:cursor-pointer" />
          </button>
          <div>
            <a href="#" class="text-sm text-gray-400">{{ userName ? userName : "Captain Anonymous" }}</a>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mr-3">
        <button v-if="isLoggedIn" type="button" class="text-[aliceblue] rounded px-3 md:px-5 py-1 md:py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer">
          <div class="h-7 flex">
            <img :src="Like" alt="likeBtn" class="w-4">
          </div>
        </button>

        <button v-if="viewMode === 'full'" type="button" class="text-[aliceblue] rounded px-3 md:px-5 py-1 md:py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" @click="handleChangeViewMode('pen')">
          <div class="h-7 flex">
            <span class="md:inline hidden">View Source Code</span>
            <PenIcon class="w-4 block sm:hidden"/>
          </div>
        </button>

        <button v-if="!isAutoPreview && viewMode !== 'full'" type="button" class="text-[aliceblue] rounded-l px-5 py-2 bg-[#444857] mr-[1px] editorSmallButton-hover-bgc  hover:cursor-pointer" @click="runPreview">
          <div class="h-7 flex items-center gap-1">
            <img :src="Run" alt="runBtn" class="w-4">
            <span>Run</span>
          </div>
        </button>
        <div class="md:flex hidden" v-if="viewMode !== 'full'">
          <button type="button" class="text-[aliceblue] rounded-l px-5 py-2 bg-[#444857] mr-[1px] editorSmallButton-hover-bgc  hover:cursor-pointer"
            :class="{ 'rounded mr-[2px]': !isLoggedIn }" @click.prevent="handleSave">
            <div class="h-7 flex items-center gap-1">
              <img :src="Cloud" alt="saveBtn" class="w-4">
              <span class="text-15">Save</span>
            </div>
          </button>
          <div class="relative">
            <div v-if="saveOptionVisible" class="fixed inset-0 z-40 transition-opacity duration-200" @click="toggleSave"></div>
            <button v-if="isLoggedIn" @click.prevent="toggleSave" type="button"
              class="relative text-[aliceblue] rounded-r  py-2 bg-[#444857] flex justify-center items-center w-5 editorSmallButton-hover-bgc  hover:cursor-pointer">
              <div class="h-7 flex justify-center items-center">
                <img :src="Arrow" alt="arrow" class="w-2.5">
              </div>
            </button>
            <div v-if="saveOptionVisible" class="fixed inset-0 transition-opacity duration-200" @click="toggleSave"></div>
            <ul 
              v-if="saveOptionVisible" class="absolute z-50 flex flex-col rounded-sm top-12 right-0 bg-[#2C303A] text-white w-80 justify-around border-4 border-gray-800 px-5"
            >
              <label class="flex py-2  justify-between border-b border-gray-600 hover:cursor-pointer">
                <span>Private</span>
                <div>
                  <div class="relative inline-block w-13 h-7 ">
                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                    <span
                      class="absolute pointer bg-gray-300 top-0 left-0 right-0 bottom-0 rounded-4xl peer-checked:bg-green-400  transition before:content-[''] before:h-8 before:w-8 before:left-0 before:bottom-[-2px] before:bg-white before:transition  before:absolute before:rounded-4xl  peer-checked:before:translate-x-6"></span>
                  </div>
                  <span class="ml-2">off</span>  
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
        <button v-if="viewMode !== 'full'"  @click.prevent="toggleList" type="button" class="flex md:hidden text-[aliceblue] rounded px-2 py-1 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" >
          <div class="h-7 flex justify-between w-6 items-center">
            <div class="transition-transform h-0.5 bg-gray-200 relative before:content-[''] before:w-1.5 before:h-0.5 before:bg-gray-200 before:absolute before:-top-1.5 before:left-0 after:content-[''] after:w-3.5 after:h-0.5 after:bg-gray-200 after:absolute after:-bottom-1.5 after:left-0" :class="navListVisible ? 'before:w-2 w-1.5' : 'before:w-1.5 w-2.5'"></div>
            <img :src="ArrowWhite" alt="arrowWhite" class=" transition-transform	w-3 self-start mt-1.5 " :class=" {'scale-y-[-1]':navListVisible}">
          </div>
        </button>
        <div v-if="navListVisible" class="z-50 absolute flex flex-col top-14 right-0 w-55 gap-1 py-1 bg-[#1E1F26] rounded-sm">
          <button class="flex w-full px-2 py-1 hover:bg-gray-500" @click.prevent="handleSave">
            <img :src="Cloud" alt="saveBtn" class="w-4">
            <span>Save</span>
          </button>
          <button @click.prevent="toggleSetting" class="flex w-full px-2 py-1 hover:bg-gray-500">
            <img :src="Settings" alt="settingBtn" class="w-4">
            <span>Settings</span>
          </button>
          <div class="w-full bg-gray-700 h-[1px] mb-4"></div>
        </div>
        <button v-if="viewMode !== 'full'" @click.prevent="toggleSetting" type="button" class="hidden md:flex text-[aliceblue] rounded px-4 py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer" >
          <div class="h-7 flex items-center gap-1">
            <img :src="Settings" alt="settingBtn" class="w-4">
            <span class="text-15">Settings</span>
          </div>
        </button>
        <div v-if="settingOptionVisible" class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200" @click="toggleSetting"></div>
        <penSetting v-if="settingOptionVisible" @close="toggleSetting" class="z-50" />

        <div class="relative md:flex hidden" >
          <button  v-if="viewMode !== 'full'" type="button" @click.prevent="toggleLayout" class="text-[aliceblue] rounded px-4 py-2 bg-[#444857] editorSmallButton-hover-bgc  hover:cursor-pointer">
            <div class="h-7 flex items-center gap-1">
              <img :src="Layout" alt="" class="w-[14px]" :style="{ transform: `rotate(${selectedLayout.rotation}deg)` }">
            </div>
          </button>
          <div v-if="layoutOptionVisible" class="fixed inset-0 transition-opacity duration-200" @click="toggleLayout"></div>
          <div v-if="layoutOptionVisible" class="absolute z-50 bg-[#2C303A] top-12 right-0 py-3 rounded-lg border-4 border-gray-800">
            <div class="px-3 text-white">
              <span>Change View</span>
            </div>
            <div class="flex justify-center align-middle py-3">
              <div class="flex justify-center align-middle py-3 ">
                <label
                  v-for="option in layoutOptions" :key="option.id" class="border-2 border-[#444857] w-20 flex justify-center h-12 editorSmallButton-hover-bgc   hover:cursor-pointer" :class="{ 'rounded-l-sm': option.id === 'left', 'rounded-r-sm': option.id === 'right', 'bg-[#444857]': selectedLayout.id === option.id }"
                >
                  <button @click="selectLayout(option) " class=" hover:cursor-pointer">
                    <img :src="Layout" :style="{ transform: `rotate(${option.rotation}deg)` }" class="w-5 "  alt="">
                  </button>
                </label>
              </div>
            </div>
            <ul
              class="relative flex flex-col rounded-sm right-0 bg-[#2C303A] text-white w-65 justify-between text-sm p-1"
              v-if="userName"
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
                  <div>/pen/</div>
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

        <button v-if="!isLoggedIn" type="button" class="text-black rounded px-2 py-1 md:px-4 md:py-2 bg-[#47cf73] hover:cursor-pointer">
          <div class="h-7 flex items-center gap-1">
            <span>Sign Up</span>
          </div>
        </button>
        <button v-if="!isLoggedIn" type="button" class="text-[aliceblue] rounded px-2 py-1 md:px-4 md:py-2 bg-[#444857] hover:cursor-pointer">
          <div class="h-7 flex items-center gap-1">
            <span>Log In</span>
          </div>
        </button>
        <div v-if="isLoggedIn" class="w-9 h-9 md:w-11 md:h-11 overflow-hidden mx-1 rounded hover:cursor-pointer">
          <img src="https://fakeimg.pl/300x200/500" class="w-full h-full object-cover" />
        </div>
     </div>
    </nav>

</template>
