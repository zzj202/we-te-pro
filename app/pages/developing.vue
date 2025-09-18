<template>
    <div>
        <button @click="click">11111</button>
        {{ res }}
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'race-layouts'
})
const res = ref()


const prizeStore = usePrizeStore()

const click = () => {
    res.value = prizeStore.getNumberLastAppearBycategoryId(prizeStore.currentCategoryId)
}
</script>