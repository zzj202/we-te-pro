<template>
    <div class="results-section">
        <div class="section-header">
            <div class="header-content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="header-icon">
                    <path
                        d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
                <h3 class="section-title">解析结果</h3>
                <span class="result-count">{{ lines.length }} 条记录</span>
            </div>
            <div class="header-actions">
                <button class="action-button refresh-button" @click="$emit('confirm')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="feather feather-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>提交</span>
                </button>
            </div>
        </div>

        <div v-if="lines.length > 0" class="results-container">
            <div class="line-numbers" ref="lineNumbersContainer">
                <div v-for="(value, index) in lines" :key="index" class="line-number-item"
                    :ref="el => setLineRef(el, index)">
                    <span class="number-badge">{{ index + 1 }}</span>
                    <area-check-bet-area :index="index + 1"></area-check-bet-area>
                </div>
            </div>
        </div>
        <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="empty-text">暂无解析结果</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
const mainStore = useMainStore()

const emit = defineEmits(['confirm', 'refresh'])

const lines = computed(() => {
    return mainStore.addBetLines
})
const lineNumbersContainer = ref(null)
const lineRefs = ref([])

const setLineRef = (el, index) => {
    if (el) {
        lineRefs.value[index] = el
    }
}

// 跳转到指定行
const scrollToLine = (lineNumber) => {
    if (lineNumber - 1 >= 0 && lineNumber - 1 < lineRefs.value.length && lineNumbersContainer.value) {
        const targetElement = lineRefs.value[lineNumber - 1]
        if (targetElement) {
            lineNumbersContainer.value.scrollTo({
                top: targetElement.offsetTop - lineNumbersContainer.value.offsetTop,
                behavior: 'smooth'
            })
        }
    }
}

defineExpose({
    scrollToLine: scrollToLine
})


</script>

<style scoped>
.results-section {
    margin: 16px;
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 83vh;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    width: 20px;
    height: 20px;
    fill: #3b82f6;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.result-count {
    font-size: 13px;
    color: #64748b;
    background-color: #f1f5f9;
    padding: 4px 8px;
    border-radius: 12px;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.results-container {
    flex: 1;
    margin-bottom: 16px;
    overflow: hidden;
}

.line-numbers {
    height: 100%;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

.line-numbers::-webkit-scrollbar {
    width: 6px;
}

.line-numbers::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.line-numbers::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

.line-number-item {
    position: relative;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.line-number-item:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.number-badge {
    position: absolute;
    right: -5px;
    top: -5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #3b82f6;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    gap: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-button svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

.action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.refresh-button {
    background-color: #f0f9ff;
    color: #0369a1;
    border: 1px solid #e0f2fe;
}

.refresh-button:hover:not(:disabled) {
    background-color: #e0f2fe;
}

.confirm-button {
    background-color: #166534;
    color: white;
    border: 1px solid #14532d;
    width: 100%;
    padding: 10px;
    font-size: 14px;
}

.confirm-button:hover:not(:disabled) {
    background-color: #14532d;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #64748b;
}

.empty-text {
    margin-top: 12px;
    font-size: 14px;
    color: #64748b;
}

@media (max-width: 768px) {
    .results-section {
        padding: 12px;
    }

    .line-number-item {
        padding: 10px;
    }

    .number-badge {
        width: 22px;
        height: 22px;
        margin-right: 10px;
    }
}

@media (max-width: 480px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .header-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .action-button {
        padding: 6px 10px;
        font-size: 12px;
    }
}
</style>