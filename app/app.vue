<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

</template>

<script setup>


const raceStore = useRaceStore()

onMounted(() => {
  raceStore.loadFromKvAPI()
})

</script>
<style>
body {
  margin: 0;
}
</style>
