<template>
    <div>
        <!--读入澳门开奖记录-->
        <FuncParseDataFunc></FuncParseDataFunc>
        <!--重置导出导入数据-->
        <FuncResetDataFunc></FuncResetDataFunc>
        <!--开奖记录-->
        <func-set-prize-data-func></func-set-prize-data-func>
    </div>
</template>


<script setup>


definePageMeta({
    layout: 'race-layouts'
})

const raceStore = useRaceStore()



</script>