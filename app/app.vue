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

onMounted(() => {
  if (appStore.isAuthenticated()) {
    raceStore.loadFromKvAPI()
  }
})

</script>
<style>
body {
  margin: 0;
}
</style>
