<template>
    <div style="max-width: 1500px; margin: 0 auto; text-align: center;">
        <area-data-show-area></area-data-show-area>
    </div>

</template>

<script setup>

import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(
    ['message']
)
definePageMeta({
    layout: 'race-layouts'
})
const raceStore = useRaceStore()
const prizeStore = usePrizeStore()
onBeforeMount(async () => {
    const route = useRoute()
    const raceId = route.query.raceId
    if (raceId) {
        await raceStore.loadFromKvAPI()
        raceStore.setCurrentRaceId(raceId)
        prizeStore.setCurrentCategoryId(raceStore.currentCategoryId)
    }
    if (!prizeStore.getCurrentCategory() || !prizeStore.getCurrentCategory().prizes.length) {
        await prizeStore.loadFromKvAPI()
    }
})

</script>