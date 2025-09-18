<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

</template>

<script setup>


const raceStore = useRaceStore()
const appStore = useAppStore()
const prizeStore = usePrizeStore()

onMounted(() => {
  if (appStore.isAuthenticated()) {
    raceStore.loadFromKvAPI()
    prizeStore.loadFromKvAPI()
    prizeStore.setCurrentCategoryId(raceStore.currentCategoryId)
  }
})

</script>
<style>
body {
  margin: 0;
}
</style>
