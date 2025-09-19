<template>
    <div class="betting-parser-container">
        <div class="two-column-layout">
            <!-- 左边列 -->
            <div class="left-column">
                <area-input-section-area @confirm="handleConfirm" />

            </div>
            <!-- 右边列 -->
            <div class="right-column">
                <area-results-section-area ref="resultRef" />
            </div>
        </div>
        <div class="bottom-layout">
            <area-input-other-area :use="'pao'"></area-input-other-area>
            <area-bet-history-area :use="'pao'"></area-bet-history-area>
        </div>
    </div>
</template>

<script setup>
import { createDiscreteApi } from 'naive-ui'
const { dialog, message } = createDiscreteApi(['dialog', 'message'])

definePageMeta({
    layout: 'race-layouts'
})
const resultRef = ref()

const mainStore = useMainStore()
const raceStore = useRaceStore()

const handleConfirm = () => {
    if (mainStore.addBetLines.length == 0) {
        message.warning(`请输入数据`)
        return
    }
    const { canConfirm, invalidIndexes } = mainStore.isCanConfirm()
    if (canConfirm) {
        dialog.success({
            title: '投注',
            content: `批量抛出${mainStore.addBetLines.filter(line => line.amount > 0).length}条，总金额为${mainStore.addBetLines.reduce((total, item) => total + item.totalAmount, 0)}元`,
            positiveText: '确定',
            negativeText: '取消',
            maskClosable: false,
            onPositiveClick: () => {
                //提交抛
                raceStore.placePao(mainStore.addBetLines)
            },
            onNegativeClick: () => {
                message.warning('取消')
            }
        })
    } else {
        // console.log(invalidIndexes.map(i => mainStore.addBetLines[i - 1]));
        message.error(`以下行输入有误：${invalidIndexes.join(', ')}`)
        resultRef.value.scrollToLine(invalidIndexes[0])
    }
}
</script>

<style scoped>
.betting-parser-container {
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a1a;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.two-column-layout {
    display: flex;
    gap: 20px;
}

.bottom-layout {
    margin-bottom: 100px;
}

.left-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.right-column {
    flex: 1;
    min-width: 0;
}

.history-section {
    flex: 1;
}

@media (max-width: 768px) {
    .betting-parser-container {
        padding: 12px;
    }

    .two-column-layout {
        flex-direction: column;
    }

    .history-section {
        display: none;
    }
}

@media (max-width: 480px) {
    .betting-parser-container {
        padding: 8px;
    }
}
</style>