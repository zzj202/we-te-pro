<template>
    <div class="input-section">
        <div class="input-header">
            <label for="betting-input" class="input-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="input-icon">
                    <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                <span class="label-text">输入投注内容</span>
            </label>
            <div class="button-group">
                <button class="action-button organize-button" @click="organizeInput">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="4" y1="14" x2="9" y2="14"></line>
                        <line x1="4" y1="10" x2="13" y2="10"></line>
                        <line x1="4" y1="6" x2="17" y2="6"></line>
                        <polyline points="21 16 16 16 16 21"></polyline>
                    </svg>
                    <span>整理</span>
                </button>
                <button class="action-button clear-button" @click="clearInput">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                        </path>
                    </svg>
                    <span>清空</span>
                </button>
                <button class="action-button confirm-button" @click="confirm">
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
        <div class="textarea-container">
            <input-my-textarea v-model="inputText" @input="parseText"></input-my-textarea>
        </div>
    </div>
</template>

<script setup>
import { debounce } from 'lodash-es'
const mainStore = useMainStore()


const inputText = computed({
    get: () => mainStore.addBetString || '',
    set: (value) => mainStore.setAddBetString(value)
})

const emit = defineEmits(['parse', 'confirm'])

const parseText = debounce(() => {
    mainStore.handleAddBetString()
}, 500)

//整理
//清除空行
const organizeInput = () => {
    const lines = inputText.value.split('\n').filter(line => line.trim())
    inputText.value = lines.join('\n')
    parseText()
}
//清空
const clearInput = () => {
    inputText.value = ''
    mainStore.reset()
}

//提交投注
const confirm = () => {
    emit('confirm')
}
</script>

<style scoped>
.input-section {
    margin-bottom: 16px;
    background: #ffffff;
    border-radius: 12px;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.input-label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2d3748;
    font-size: 15px;
}

.label-text {
    margin-left: 8px;
}

.button-group {
    display: flex;
    gap: 8px;
    align-items: center;
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

.organize-button {
    background-color: #f0f9ff;
    color: #0369a1;
    border: 1px solid #e0f2fe;
}

.organize-button:hover {
    background-color: #e0f2fe;
}

.clear-button {
    background-color: #fff1f2;
    color: #be123c;
    border: 1px solid #ffe4e6;
}

.clear-button:hover {
    background-color: #ffe4e6;
}

.confirm-button {
    background-color: #166534;
    color: white;
    border: 1px solid #14532d;
}

.confirm-button:hover {
    background-color: #14532d;
}

.textarea-container {
    position: relative;
    width: 100%;
}



.input-icon {
    width: 18px;
    height: 18px;
    fill: #3b82f6;
}

@media (max-width: 768px) {
    .input-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .button-group {
        width: 100%;
        justify-content: flex-end;
    }


}

@media (max-width: 480px) {
    .input-section {
        padding: 12px;
    }

    .action-button {
        padding: 6px 10px;
        font-size: 12px;
    }


}
</style>