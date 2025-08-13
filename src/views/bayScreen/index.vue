<template>
  <div class="main-bay">
    <!-- <Map /> -->
    <div class="bg">
      <WarpBackground></WarpBackground>
    </div>
    <div class="title">
      <Title @menu="handleMenu" />
    </div>
    <div class="content">
      <oceanMonitor v-if="menuIndex === 0" />
      <!-- <landMonitor v-else-if="menuIndex === 1" />
      <skyMonitor v-else-if="menuIndex === 2" />
      <videoMonitor v-else-if="menuIndex === 3" />
      <emergencyMonitor v-else-if="menuIndex === 4" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Title from './components/Title.vue'
import WarpBackground from './components/WarpBackground.vue'
// import Map from './components/Map.vue'
import oceanMonitor from './components/submodules/oceanMonitor/index.vue'
// import landMonitor from './components/submodules/landMonitor/index.vue'
// import skyMonitor from './components/submodules/skyMonitor/index.vue'
// import videoMonitor from './components/submodules/videoMonitor/index.vue'
// import emergencyMonitor from './components/submodules/emergencyMonitor/index.vue'

let menuIndex = ref(0)
const handleMenu = (index) => {
  menuIndex.value = index
}

</script>

<style lang="scss" scoped>
.main-bay {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #000;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
  background: url("../../assets/screen/bg6.jpeg") no-repeat center center;
  background-size: cover;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
    background-color: rgba(5, 27, 76, 0.151);
  }
  .title {
    width: 100%;
    position: relative;
    z-index: 11;
  }
}
</style>
