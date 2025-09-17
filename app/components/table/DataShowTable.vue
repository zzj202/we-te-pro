<template>
  <div class="zodiac-container">
    <table-zodiac-totals-table :numbers="numbers" />
    <table-zodiac-numbers-table :numbers="numbers" :pao-show="paoShow" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paoShow: {
    type: Boolean,
    default: false
  }
})

const raceStore = useRaceStore()
const numbers = computed(() => {
  return raceStore.getCurrentRace().numbers || []
})
</script>

<style scoped>
.zodiac-container {
  padding: 1px;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 40px;
}
</style>