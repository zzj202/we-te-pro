<template>
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <area-data-show-area :data="dataNumbers"></area-data-show-area>
    </div>

</template>

<script setup>

import { createDiscreteApi } from 'naive-ui'

const {  message } = createDiscreteApi(
    [ 'message']
)
definePageMeta({
    layout: 'race-layouts'
})

const raceStore = useRaceStore()
const dataNumbers = computed(() => {
    return raceStore.getCurrentRace()?.numbers || []
})
onBeforeMount(async () => {
    const route = useRoute()
    // 获取查询参数 (如 ?search=xxx)
    const sessionId = route.query.sessionId
    if (sessionId) {
        await raceStore.loadFromKvAPI()
        raceStore.setCurrentRaceId(sessionId).then(() => {
            console.log('场次切换')
        }).catch(() => {
            message.error('场次不存在，请手动切换')
        })
    }

})

</script>