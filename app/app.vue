<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>

<script setup>
const gameStore = useGameStore()
const mainStore = useMainStore()
onMounted(async () => {
  await gameStore.loadSessions()
  if (process.client) {
    const userAgent = navigator.userAgent;
    // 判断浏览器类型
    if (userAgent.includes('WeChat')) {
      mainStore.setUserBroswer('WeChat')
    } else if (userAgent.includes('Chrome')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Safari')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Edge')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Firefox')) {
      mainStore.setUserBroswer('Firefox')
    }
  }
})

</script>
<style></style>
